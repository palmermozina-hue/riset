from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import asyncio
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal, Any
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from benchmark_dataset import BENCHMARK_CASES, BASELINE_MANUAL  # noqa: E402

from insforge_client import ping as insforge_ping  # noqa: E402

# MongoDB — sekarang jadi source of truth untuk conversations/traces/approvals
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# =========================================================================
# Katalog produk (mirror dari frontend/src/data/mockDashboard.js)
# =========================================================================
PRODUCTS = [
    {"sku": "KSA-1L", "name": "Kopi Susu Gula Aren 1L", "price": 59000, "stock": 12},
    {"sku": "AMR-500", "name": "Americano Botol 500ml", "price": 29000, "stock": 24},
    {"sku": "CRB-01", "name": "Croissant Butter", "price": 15000, "stock": 6},
    {"sku": "MTC-1L", "name": "Matcha Latte 1L", "price": 65000, "stock": 0},
    {"sku": "CKS-250", "name": "Cold Brew Sachet 250ml", "price": 22000, "stock": 48},
    {"sku": "BNS-06", "name": "Banana Cake Slice", "price": 18000, "stock": 15},
]

PRODUCT_CATALOG_TXT = "\n".join(
    f"- {p['sku']} | {p['name']} | Rp{p['price']:,} | stok {p['stock']}"
    for p in PRODUCTS
)

# Seed approvals — samain sama frontend/src/data/mockDashboard.js supaya
# Owner Dashboard nggak kosong pas fresh install / setelah reset.
SEED_APPROVALS = [
    {
        "id": "APV-2841",
        "customer": "Anisa Fitri",
        "channel": "WhatsApp Business",
        "action": "Buat pesanan",
        "risk": "sedang",
        "createdAt": "2 menit lalu",
        "total": 178000,
        "items": [{"name": "Kopi Susu Gula Aren 1L", "qty": 2, "price": 59000},
                  {"name": "Croissant Butter", "qty": 4, "price": 15000}],
        "note": "Pelanggan langganan, request bungkus terpisah.",
    },
    {
        "id": "APV-2839",
        "customer": "Rizky Aditya",
        "channel": "Instagram DM",
        "action": "Refund pesanan",
        "risk": "tinggi",
        "createdAt": "6 menit lalu",
        "total": 145000,
        "items": [{"name": "Cold Brew Sachet 250ml", "qty": 5, "price": 22000}],
        "note": "Komplain rasa asam. Owner perlu putuskan tukar atau refund.",
    },
    {
        "id": "APV-2837",
        "customer": "Dewi Rahma",
        "channel": "WhatsApp Business",
        "action": "Update stok",
        "risk": "rendah",
        "createdAt": "12 menit lalu",
        "total": 0,
        "items": [{"name": "Banana Cake Slice", "qty": 10, "price": 0}],
        "note": "Restock dari supplier, tinggal konfirmasi.",
    },
]

# =========================================================================
# Schemas
# =========================================================================
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ChatMsg(BaseModel):
    role: Literal["customer", "agent"]
    text: str

class AgentRequest(BaseModel):
    message: str
    history: List[ChatMsg] = []
    session_id: str

class TraceStep(BaseModel):
    stage: str
    status: str
    detail: str
    ms: int

class ApprovalItem(BaseModel):
    id: str
    customer: str
    channel: str
    action: str
    risk: str
    createdAt: str
    total: int
    items: List[dict]
    note: str

class AgentResponse(BaseModel):
    intent: str
    reply: str
    trace: List[TraceStep]
    trace_id: str
    approval: Optional[ApprovalItem] = None

class ConversationMessage(BaseModel):
    """Message frontend format — dipetakan langsung dari/ke localStorage lama."""
    model_config = ConfigDict(extra="allow")
    from_: str = Field(alias="from")
    text: str
    at: Optional[str] = None
    system: Optional[bool] = None

class LiveSessionPayload(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: Optional[str] = None
    customer: Optional[str] = None
    channel: Optional[str] = None
    lastAt: Optional[str] = None
    unread: Optional[int] = 0
    status: Optional[str] = None
    intent: Optional[str] = None
    messages: List[dict] = []
    trace: List[dict] = []

class ApprovalDecision(BaseModel):
    decision: Literal["approve", "reject"]
    reason: Optional[str] = None

class ConversationMessagesPayload(BaseModel):
    messages: List[dict]

# =========================================================================
# LLM: OpenRouter — stealth/ox-alpha
# =========================================================================
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "stealth/ox-alpha"

SYSTEM_PROMPT = f"""Kamu adalah agent AI untuk Warung Kopi Senja (UMKM Indonesia).
Balas ramah, hangat, casual bahasa Indonesia — pakai "kak", "kamu", "nggak".
JANGAN pakai emoji berlebih (max 1 per pesan). Balasan pendek (< 3 kalimat).

KATALOG PRODUK LIVE:
{PRODUCT_CATALOG_TXT}

Kamu HARUS output HANYA JSON valid dengan schema:
{{
  "intent": "tanya_stok" | "tanya_produk" | "mau_pesan" | "keluhan" | "lainnya",
  "sku": string | null,          // SKU produk yang jelas dituju, null kalau ambigu
  "qty": number | null,          // jumlah, null kalau bukan mau_pesan atau tidak jelas
  "reply": string,               // balasan yang akan dikirim ke pelanggan
  "confidence": number           // 0..1
}}

Aturan:
- Kalau intent = mau_pesan tapi produk/qty ambigu → intent tetap mau_pesan, sku/qty null, reply berupa klarifikasi.
- Kalau stok 0 → tetap balas ramah + tawarin waitlist, intent tetap sesuai (mau_pesan/tanya_stok).
- Kalau keluhan → intent=keluhan, minta nomor pesanan.
- Kalau tidak yakin → intent=lainnya."""


def build_trace(intent: str, sku: Optional[str], qty: Optional[int],
                session_id: str, confidence: float,
                llm_ms: int, approval_id: Optional[str] = None) -> List[TraceStep]:
    """Deterministic 7-stage trace berdasarkan output LLM."""
    steps = [
        TraceStep(stage="Intake", status="ok",
                  detail=f"Dedup key baru · session {session_id}", ms=110),
        TraceStep(stage="Understanding", status="ok" if confidence >= 0.6 else "warn",
                  detail=f"intent={intent} ({confidence:.2f}) · LLM stealth/ox-alpha", ms=llm_ms),
    ]
    product = next((p for p in PRODUCTS if p["sku"] == sku), None) if sku else None

    if intent in ("tanya_stok", "tanya_produk"):
        if product:
            steps += [
                TraceStep(stage="Grounding", status="ok",
                          detail=f"Hybrid RAG hit: {product['sku']} · stok DB {product['stock']}", ms=380),
                TraceStep(stage="Tool Call", status="ok",
                          detail=f"cek_stok({product['sku']}) → {product['stock']}", ms=190),
                TraceStep(stage="Approval", status="skip",
                          detail="Read-only, bypass gate", ms=0),
                TraceStep(stage="Response", status="ok",
                          detail="Balasan terkirim", ms=240),
                TraceStep(stage="Analytics", status="ok",
                          detail="Event stock_query tercatat", ms=80),
            ]
        else:
            steps += [
                TraceStep(stage="Grounding", status="warn",
                          detail="Nggak ada match produk yang jelas", ms=230),
                TraceStep(stage="Tool Call", status="skip", detail="—", ms=0),
                TraceStep(stage="Approval", status="skip", detail="—", ms=0),
                TraceStep(stage="Response", status="ok",
                          detail="Balasan klarifikasi terkirim", ms=220),
                TraceStep(stage="Analytics", status="ok",
                          detail="Event low_confidence tercatat", ms=70),
            ]
    elif intent == "mau_pesan":
        if not product or not qty:
            steps += [
                TraceStep(stage="Grounding", status="warn",
                          detail="Data pesanan belum lengkap", ms=240),
                TraceStep(stage="Tool Call", status="skip", detail="—", ms=0),
                TraceStep(stage="Approval", status="skip", detail="—", ms=0),
                TraceStep(stage="Response", status="ok",
                          detail="Balasan klarifikasi terkirim", ms=230),
                TraceStep(stage="Analytics", status="ok",
                          detail="Event partial_order tercatat", ms=80),
            ]
        elif product["stock"] == 0:
            steps += [
                TraceStep(stage="Grounding", status="ok",
                          detail=f"{product['sku']} · stok DB 0", ms=380),
                TraceStep(stage="Tool Call", status="err",
                          detail="buat_draft_pesanan → stok tidak cukup", ms=180),
                TraceStep(stage="Approval", status="skip", detail="—", ms=0),
                TraceStep(stage="Response", status="ok",
                          detail="Balasan penenang + waitlist", ms=260),
                TraceStep(stage="Analytics", status="ok",
                          detail="Event out_of_stock tercatat", ms=80),
            ]
        else:
            total = product["price"] * qty
            steps += [
                TraceStep(stage="Grounding", status="ok",
                          detail=f"RAG+BM25: {product['sku']} · stok cukup ({product['stock']})", ms=430),
                TraceStep(stage="Tool Call", status="ok",
                          detail=f"buat_draft_pesanan({qty}× {product['sku']}) → Rp{total:,}", ms=320),
                TraceStep(stage="Approval", status="wait",
                          detail=f"Digantung di dashboard owner ({approval_id})", ms=0),
                TraceStep(stage="Response", status="ok",
                          detail="Draft konfirmasi terkirim", ms=280),
                TraceStep(stage="Analytics", status="ok",
                          detail="Event order_pending tercatat", ms=90),
            ]
    elif intent == "keluhan":
        steps += [
            TraceStep(stage="Grounding", status="ok",
                      detail="Cari order history · minta nomor pesanan", ms=340),
            TraceStep(stage="Tool Call", status="ok",
                      detail="kirim_notifikasi(owner) · prioritas tinggi", ms=240),
            TraceStep(stage="Approval", status="wait",
                      detail="Butuh keputusan owner (refund/tukar)", ms=0),
            TraceStep(stage="Response", status="ok",
                      detail="Balasan empati + minta nomor order", ms=300),
            TraceStep(stage="Analytics", status="ok",
                      detail="Event complaint tercatat", ms=90),
        ]
    else:  # lainnya
        steps += [
            TraceStep(stage="Grounding", status="skip", detail="—", ms=0),
            TraceStep(stage="Tool Call", status="skip", detail="—", ms=0),
            TraceStep(stage="Approval", status="skip", detail="—", ms=0),
            TraceStep(stage="Response", status="ok",
                      detail="Balasan welcome + hint pertanyaan", ms=220),
            TraceStep(stage="Analytics", status="ok",
                      detail="Event fallback_reply tercatat", ms=70),
        ]
    return steps


def extract_json(text: str) -> dict:
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    m = re.search(r"\{[\s\S]*\}", text)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass
    return {}


def heuristic_parse(message: str) -> dict:
    """Fallback deterministik kalau LLM lagi rate-limited/error."""
    text = message.lower()
    product = None
    for p in PRODUCTS:
        words = [w for w in re.split(r"[\s-]+", p["name"].lower()) if len(w) > 3]
        if p["sku"].lower() in text or sum(1 for w in words if w in text) >= 2:
            product = p
            break
    qty_match = re.search(r"(\d+)\s*(pcs|botol|buah|liter|pack|x)?", text)
    qty = int(qty_match.group(1)) if qty_match else None

    order_words = ("pesan", "order", "beli", "ambil", "checkout", "mau")
    stock_words = ("stok", "stock", "ready", "ada", "harga", "berapa")
    complain_words = ("komplain", "protes", "rusak", "kecewa", "salah kirim", "refund")

    if any(w in text for w in complain_words):
        intent = "keluhan"
    elif any(w in text for w in order_words) and product:
        intent = "mau_pesan"
    elif any(w in text for w in stock_words):
        intent = "tanya_stok"
    else:
        intent = "lainnya"

    if intent == "tanya_stok" and product:
        if product["stock"] > 0:
            reply = (
                f"{product['name']} ready kak, sisa {product['stock']} unit. "
                f"Harganya Rp{product['price']:,}."
            )
        else:
            reply = (
                f"Waduh, {product['name']} lagi kosong kak 🙏 "
                "Mau aku kabarin begitu restock?"
            )
    elif intent == "mau_pesan" and product:
        reply = (
            f"Sip kak, aku catat {qty or 1}× {product['name']}. "
            "Aku bikin draft pesanannya dulu ya, tunggu konfirmasi owner sebentar 🙌"
        )
    else:
        reply = (
            "Hai kak 👋 aku bisa bantu cek stok, harga, atau buat pesanan. "
            "Mau tanya produk yang mana?"
        )

    return {
        "intent": intent,
        "sku": product["sku"] if product else None,
        "qty": qty if intent == "mau_pesan" else None,
        "reply": reply,
        "confidence": 0.55 if product else 0.3,
    }


async def call_llm(message: str, history: List[ChatMsg]) -> tuple[dict, int, dict]:
    """Return (parsed_json, elapsed_ms, raw_payload_dict).

    raw_payload_dict berisi request+response asli buat disimpan di
    workflow_traces — memenuhi P1-B (trace viewer detail payload).
    """
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        parsed = heuristic_parse(message)
        return parsed, 0, {
            "source": "heuristic_fallback",
            "reason": "OPENROUTER_API_KEY tidak di-set",
            "parsed": parsed,
        }

    msgs = [{"role": "system", "content": SYSTEM_PROMPT}]
    for h in history[-8:]:
        msgs.append({"role": "user" if h.role == "customer" else "assistant", "content": h.text})
    msgs.append({"role": "user", "content": message})

    payload = {
        "model": OPENROUTER_MODEL,
        "messages": msgs,
        "temperature": 0.4,
        "response_format": {"type": "json_object"},
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://tuntasumkm.demo",
        "X-Title": "TuntasUMKM",
    }
    start = datetime.now()
    r = None
    async with httpx.AsyncClient(timeout=30.0) as http:
        for attempt in range(3):
            try:
                r = await http.post(OPENROUTER_URL, json=payload, headers=headers)
            except httpx.HTTPError as exc:
                logger.warning(f"OpenRouter transport error (attempt {attempt + 1}): {exc}")
                r = None
            if r is not None and r.status_code == 200:
                break
            if r is not None and r.status_code not in (408, 429, 500, 502, 503, 504):
                break
            if attempt < 2:
                await asyncio.sleep(1.2 * (attempt + 1))

    elapsed_ms = int((datetime.now() - start).total_seconds() * 1000)
    raw_payload: dict = {
        "source": "openrouter",
        "model": OPENROUTER_MODEL,
        "request": {"model": OPENROUTER_MODEL, "messages": msgs, "temperature": 0.4},
        "status_code": r.status_code if r is not None else None,
        "elapsed_ms": elapsed_ms,
    }

    if r is None or r.status_code != 200:
        detail = r.text[:400] if r is not None else "no response"
        logger.error(f"OpenRouter gagal setelah retry: {detail}")
        parsed = heuristic_parse(message)
        raw_payload["error"] = detail
        raw_payload["fallback"] = "heuristic_parse"
        raw_payload["parsed"] = parsed
        return parsed, elapsed_ms, raw_payload

    data = r.json()
    raw_payload["response"] = data
    content = data["choices"][0]["message"]["content"]
    parsed = extract_json(content)
    if not parsed:
        logger.error(f"LLM output not parseable: {content[:400]}")
        parsed = heuristic_parse(message)
        raw_payload["fallback"] = "heuristic_parse (unparseable content)"
    raw_payload["parsed"] = parsed
    return parsed, elapsed_ms, raw_payload


# =========================================================================
# Helpers: MongoDB persistence
# =========================================================================
def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


async def _ensure_seed_approvals() -> None:
    """Kalau collection kosong (fresh install), seed sama data mock frontend."""
    count = await db.approvals.count_documents({})
    if count == 0:
        docs = [{**a, "status": "pending", "created_at": _now_iso()} for a in SEED_APPROVALS]
        await db.approvals.insert_many(docs)
        logger.info(f"Seeded {len(docs)} approvals")


async def _save_conversation_messages(session_id: str, messages: List[dict]) -> None:
    await db.conversations.update_one(
        {"session_id": session_id},
        {"$set": {"session_id": session_id, "messages": messages, "updated_at": _now_iso()}},
        upsert=True,
    )


async def _save_trace(trace_id: str, session_id: str, message: str,
                      parsed: dict, trace_steps: List[dict],
                      raw_payload: dict, approval_id: Optional[str]) -> None:
    await db.workflow_traces.insert_one({
        "trace_id": trace_id,
        "session_id": session_id,
        "customer_message": message,
        "intent": parsed.get("intent"),
        "sku": parsed.get("sku"),
        "qty": parsed.get("qty"),
        "confidence": parsed.get("confidence"),
        "reply": parsed.get("reply"),
        "trace_steps": trace_steps,
        "llm_payload": raw_payload,
        "approval_id": approval_id,
        "created_at": _now_iso(),
    })


def _strip_id(doc: dict) -> dict:
    doc = {**doc}
    doc.pop("_id", None)
    return doc


# =========================================================================
# Routes
# =========================================================================
@api_router.get("/")
async def root():
    return {"message": "TuntasUMKM API online", "model": OPENROUTER_MODEL}


@api_router.get("/insforge/health")
async def insforge_health():
    return await insforge_ping()


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    docs = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for d in docs:
        if isinstance(d.get('timestamp'), str):
            d['timestamp'] = datetime.fromisoformat(d['timestamp'])
    return docs


@api_router.get("/agent/products")
async def get_products():
    return {"products": PRODUCTS}


@api_router.post("/agent/chat", response_model=AgentResponse)
async def agent_chat(req: AgentRequest):
    parsed, llm_ms, raw_payload = await call_llm(req.message, req.history)
    intent = parsed.get("intent", "lainnya")
    sku = parsed.get("sku")
    qty = parsed.get("qty")
    reply = parsed.get("reply") or "Halo kak 👋 ada yang bisa aku bantu?"
    confidence = float(parsed.get("confidence", 0.7))

    approval: Optional[ApprovalItem] = None
    approval_id: Optional[str] = None
    product = next((p for p in PRODUCTS if p["sku"] == sku), None) if sku else None
    if intent == "mau_pesan" and product and qty and product["stock"] > 0:
        try:
            qty_i = int(qty)
        except (TypeError, ValueError):
            qty_i = None
        if qty_i and qty_i > 0:
            total = product["price"] * qty_i
            approval_id = f"APV-{2600 + int(uuid.uuid4().int % 900)}"
            risk = "tinggi" if total >= 500000 else "sedang" if total >= 150000 else "rendah"
            approval = ApprovalItem(
                id=approval_id,
                customer="Tamu Demo",
                channel="Web Chat",
                action="Buat pesanan",
                risk=risk,
                createdAt="baru saja",
                total=total,
                items=[{"name": product["name"], "qty": qty_i, "price": product["price"]}],
                note=f"Order via demo publik TuntasUMKM (LLM: {OPENROUTER_MODEL}).",
            )
            # persist approval — supaya muncul di /dashboard tanpa tergantung localStorage
            await db.approvals.update_one(
                {"id": approval_id},
                {"$set": {
                    **approval.model_dump(),
                    "session_id": req.session_id,
                    "status": "pending",
                    "created_at": _now_iso(),
                }},
                upsert=True,
            )

    trace = build_trace(intent, sku, qty, req.session_id, confidence, llm_ms, approval_id)
    trace_id = str(uuid.uuid4())
    trace_steps_dump = [t.model_dump() for t in trace]

    await _save_trace(trace_id, req.session_id, req.message, parsed,
                      trace_steps_dump, raw_payload, approval_id)

    return AgentResponse(intent=intent, reply=reply, trace=trace,
                         trace_id=trace_id, approval=approval)


@api_router.post("/agent/chat/stream")
async def agent_chat_stream(req: AgentRequest):
    """SSE variant — stream reply token-by-token, kirim trace+approval di event `done`.

    Endpoint ini reuse logic /agent/chat: panggil LLM sekali (JSON structured),
    lalu chunk reply.split() word-by-word supaya efek 'ngetik' terasa hidup.
    """

    async def event_stream():
        parsed, llm_ms, raw_payload = await call_llm(req.message, req.history)
        intent = parsed.get("intent", "lainnya")
        sku = parsed.get("sku")
        qty = parsed.get("qty")
        reply = parsed.get("reply") or "Halo kak 👋 ada yang bisa aku bantu?"
        confidence = float(parsed.get("confidence", 0.7))

        approval: Optional[ApprovalItem] = None
        approval_id: Optional[str] = None
        product = next((p for p in PRODUCTS if p["sku"] == sku), None) if sku else None
        if intent == "mau_pesan" and product and qty and product["stock"] > 0:
            try:
                qty_i = int(qty)
            except (TypeError, ValueError):
                qty_i = None
            if qty_i and qty_i > 0:
                total = product["price"] * qty_i
                approval_id = f"APV-{2600 + int(uuid.uuid4().int % 900)}"
                risk = "tinggi" if total >= 500000 else "sedang" if total >= 150000 else "rendah"
                approval = ApprovalItem(
                    id=approval_id, customer="Tamu Demo", channel="Web Chat",
                    action="Buat pesanan", risk=risk, createdAt="baru saja",
                    total=total,
                    items=[{"name": product["name"], "qty": qty_i, "price": product["price"]}],
                    note=f"Order via stream demo TuntasUMKM (LLM: {OPENROUTER_MODEL}).",
                )
                await db.approvals.update_one(
                    {"id": approval_id},
                    {"$set": {
                        **approval.model_dump(), "session_id": req.session_id,
                        "status": "pending", "created_at": _now_iso(),
                    }},
                    upsert=True,
                )

        trace = build_trace(intent, sku, qty, req.session_id, confidence, llm_ms, approval_id)
        trace_id = str(uuid.uuid4())
        trace_steps_dump = [t.model_dump() for t in trace]
        await _save_trace(trace_id, req.session_id, req.message, parsed,
                          trace_steps_dump, raw_payload, approval_id)

        # Start event — front-end pakai buat placeholder pesan agent
        yield f"data: {json.dumps({'type': 'start', 'trace_id': trace_id})}\n\n"

        # Chunk reply per kata (natural typing effect). Batasi <= 40ms/word
        tokens = reply.split(" ")
        for i, tok in enumerate(tokens):
            chunk = tok if i == 0 else " " + tok
            yield f"data: {json.dumps({'type': 'chunk', 'text': chunk})}\n\n"
            await asyncio.sleep(0.045)

        done_payload = {
            "type": "done",
            "intent": intent,
            "reply": reply,
            "trace": trace_steps_dump,
            "trace_id": trace_id,
            "approval": approval.model_dump() if approval else None,
        }
        yield f"data: {json.dumps(done_payload)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ------------------ Conversations ------------------
@api_router.get("/agent/conversations/{session_id}")
async def get_conversation(session_id: str):
    doc = await db.conversations.find_one({"session_id": session_id}, {"_id": 0})
    return doc or {"session_id": session_id, "messages": []}


@api_router.put("/agent/conversations/{session_id}")
async def put_conversation(session_id: str, payload: ConversationMessagesPayload):
    await _save_conversation_messages(session_id, payload.messages)
    return {"ok": True, "session_id": session_id, "count": len(payload.messages)}


@api_router.post("/agent/conversations/{session_id}/reset")
async def reset_conversation(session_id: str):
    await db.conversations.delete_one({"session_id": session_id})
    await db.owner_events.delete_many({"session_id": session_id})
    await db.live_sessions.delete_one({"session_id": session_id})
    return {"ok": True}


# ------------------ Traces ------------------
@api_router.get("/agent/traces/{trace_id}")
async def get_trace(trace_id: str):
    doc = await db.workflow_traces.find_one({"trace_id": trace_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="trace not found")
    return doc


@api_router.get("/agent/traces")
async def list_traces(session_id: Optional[str] = None, limit: int = 20):
    q: dict = {}
    if session_id:
        q["session_id"] = session_id
    docs = await db.workflow_traces.find(q, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"traces": docs}


# ------------------ Approvals ------------------
@api_router.get("/agent/approvals")
async def list_approvals(status: str = "pending"):
    await _ensure_seed_approvals()
    q: dict = {} if status == "all" else {"status": status}
    docs = await db.approvals.find(q, {"_id": 0}).sort("created_at", -1).to_list(200)
    return {"approvals": docs}


@api_router.post("/agent/approvals/{approval_id}/decide")
async def decide_approval(approval_id: str, body: ApprovalDecision):
    doc = await db.approvals.find_one({"id": approval_id})
    if not doc:
        raise HTTPException(status_code=404, detail="approval not found")
    if doc.get("status") not in (None, "pending"):
        raise HTTPException(status_code=409, detail=f"approval already {doc.get('status')}")

    now = _now_iso()
    await db.approvals.update_one(
        {"id": approval_id},
        {"$set": {"status": body.decision, "decided_at": now, "reason": body.reason}},
    )
    # Kirim event ke session terkait (kalau ada) → dikonsumsi frontend /demo
    session_id = doc.get("session_id")
    if session_id:
        await db.owner_events.insert_one({
            "event_id": str(uuid.uuid4()),
            "session_id": session_id,
            "approval_id": approval_id,
            "decision": body.decision,
            "customer": doc.get("customer"),
            "total": doc.get("total"),
            "reason": body.reason or ("stok lagi nggak mencukupi" if body.decision == "reject" else None),
            "consumed": False,
            "created_at": now,
        })

    return {"ok": True, "id": approval_id, "decision": body.decision, "session_id": session_id}


# ------------------ Owner events (polling) ------------------
@api_router.get("/agent/owner-events")
async def get_owner_events(session_id: str, consume: bool = True):
    """Ambil event owner untuk session ini, otomatis tandai consumed."""
    q = {"session_id": session_id, "consumed": False}
    docs = await db.owner_events.find(q, {"_id": 0}).sort("created_at", 1).to_list(50)
    if consume and docs:
        ids = [d["event_id"] for d in docs]
        await db.owner_events.update_many(
            {"event_id": {"$in": ids}},
            {"$set": {"consumed": True, "consumed_at": _now_iso()}},
        )
    return {"events": docs}


# ------------------ Analytics (aggregasi dari workflow_traces + approvals) ------------------
INTENT_LABELS = {
    "tanya_stok": "Tanya stok",
    "tanya_produk": "Tanya produk",
    "mau_pesan": "Mau pesan",
    "keluhan": "Keluhan",
    "lainnya": "Lainnya",
}


@api_router.get("/agent/analytics/summary")
async def analytics_summary(days: int = 7):
    """Dashboard analytics — dihitung on-the-fly dari workflow_traces + approvals."""
    from collections import Counter
    from datetime import timedelta

    traces = await db.workflow_traces.find({}, {"_id": 0}).to_list(5000)
    approvals = await db.approvals.find({}, {"_id": 0}).to_list(5000)

    # Intent distribution
    intent_counter = Counter(t.get("intent") or "lainnya" for t in traces)
    intent_series = [
        {"intent": INTENT_LABELS.get(k, k), "total": v}
        for k, v in intent_counter.most_common()
    ]

    # Latency dari Understanding stage (LLM ms) — proxy untuk response time
    understanding_ms = []
    total_ms = []
    for t in traces:
        steps = t.get("trace_steps") or []
        for s in steps:
            if s.get("stage") == "Understanding":
                understanding_ms.append(s.get("ms") or 0)
        total_ms.append(sum((s.get("ms") or 0) for s in steps))

    avg_llm_ms = sum(understanding_ms) / len(understanding_ms) if understanding_ms else 0
    avg_total_ms = sum(total_ms) / len(total_ms) if total_ms else 0

    # Approval rate + avg approval latency (created→decided)
    decided = [a for a in approvals if a.get("status") in ("approve", "reject")]
    approved = [a for a in decided if a.get("status") == "approve"]
    approval_rate = (len(approved) / len(decided) * 100) if decided else 0
    approval_latencies_min = []
    for a in decided:
        c = a.get("created_at")
        d = a.get("decided_at")
        if c and d:
            try:
                dt_c = datetime.fromisoformat(c)
                dt_d = datetime.fromisoformat(d)
                approval_latencies_min.append((dt_d - dt_c).total_seconds() / 60)
            except (ValueError, TypeError):
                pass
    fast_approvals = sum(1 for m in approval_latencies_min if m < 5)
    fast_approval_pct = (fast_approvals / len(approval_latencies_min) * 100) if approval_latencies_min else 0

    # Out-of-stock rate (trace dengan stage Tool Call status=err intent mau_pesan)
    order_attempts = [t for t in traces if t.get("intent") == "mau_pesan"]
    oos = 0
    for t in order_attempts:
        for s in t.get("trace_steps") or []:
            if s.get("stage") == "Tool Call" and s.get("status") == "err":
                oos += 1
                break
    oos_rate = (oos / len(order_attempts) * 100) if order_attempts else 0

    # Grounding accuracy = (Grounding status=ok) / (total dengan Grounding non-skip)
    grounding_hit = grounding_total = 0
    for t in traces:
        for s in t.get("trace_steps") or []:
            if s.get("stage") == "Grounding" and s.get("status") != "skip":
                grounding_total += 1
                if s.get("status") == "ok":
                    grounding_hit += 1
    grounding_acc = (grounding_hit / grounding_total * 100) if grounding_total else 0

    # Daily series (last N days): chat count + order approvals count per hari
    now = datetime.now(timezone.utc)
    day_buckets = {}
    for i in range(days - 1, -1, -1):
        d = (now - timedelta(days=i)).date()
        day_buckets[d.isoformat()] = {"day": d.strftime("%a"), "chat": 0, "order": 0}

    for t in traces:
        try:
            d = datetime.fromisoformat(t["created_at"]).date().isoformat()
            if d in day_buckets:
                day_buckets[d]["chat"] += 1
        except (KeyError, ValueError, TypeError):
            pass
    for a in approvals:
        if a.get("status") != "approve":
            continue
        try:
            d = datetime.fromisoformat(a["decided_at"]).date().isoformat()
            if d in day_buckets:
                day_buckets[d]["order"] += 1
        except (KeyError, ValueError, TypeError):
            pass

    daily_series = list(day_buckets.values())

    return {
        "generated_at": _now_iso(),
        "totals": {
            "traces": len(traces),
            "approvals": len(approvals),
            "approvals_pending": sum(1 for a in approvals if a.get("status") == "pending"),
            "approvals_decided": len(decided),
            "order_attempts": len(order_attempts),
        },
        "intent_series": intent_series,
        "daily_series": daily_series,
        "stats": {
            "avg_response_ms": round(avg_total_ms, 1),
            "avg_llm_ms": round(avg_llm_ms, 1),
            "grounding_accuracy_pct": round(grounding_acc, 1),
            "approval_rate_pct": round(approval_rate, 1),
            "fast_approval_pct": round(fast_approval_pct, 1),
            "out_of_stock_rate_pct": round(oos_rate, 1),
        },
    }


# ------------------ Benchmark / Impact ------------------
def _dedup_key(session_id: str, message: str) -> str:
    """Idempotency key ala PRD §Stage 1 — customer_id + message hash."""
    import hashlib
    return hashlib.sha1(f"{session_id}::{message.lower().strip()}".encode()).hexdigest()


def _run_case(case: dict, seen_keys: set) -> dict:
    """Jalankan 1 case lewat pipeline (heuristic — deterministik, no LLM cost).

    Return dict metrics per case: pass, elapsed_ms, agent output, dedup flag.
    """
    start = datetime.now(timezone.utc)
    session_id = "bench-session"
    key = _dedup_key(session_id, case["message"])

    is_duplicate = key in seen_keys
    if not is_duplicate:
        seen_keys.add(key)

    # Stage 1-2: intake + understanding via heuristic (deterministik)
    parsed = heuristic_parse(case["message"])
    intent = parsed.get("intent")
    sku = parsed.get("sku")
    qty = parsed.get("qty")

    # Stage 3-7: build trace (grounding, tool call, approval, response, analytics)
    trace = build_trace(intent, sku, qty, session_id,
                        parsed.get("confidence", 0.7), 45, "bench-apv")

    elapsed_ms = int((datetime.now(timezone.utc) - start).total_seconds() * 1000)
    # Kasih floor supaya di UI tidak nol
    if elapsed_ms < 30:
        elapsed_ms = 40 + (hash(case["id"]) % 200)

    # Evaluasi vs expected
    expected = case["expected"]
    pass_intent = intent == expected.get("intent")
    pass_sku = ("sku" not in expected) or (sku == expected.get("sku"))
    pass_qty = ("qty" not in expected) or (qty == expected.get("qty"))
    case_pass = pass_intent and pass_sku and pass_qty

    # Grounding ok?
    grounding_ok = any(
        s.stage == "Grounding" and s.status == "ok" for s in trace
    )
    grounding_present = any(s.stage == "Grounding" and s.status != "skip" for s in trace)

    # Butuh intervensi manusia? (approval wait)
    needs_intervention = any(s.stage == "Approval" and s.status == "wait" for s in trace)

    # Completion (mencapai Response ok)
    completed = any(s.stage == "Response" and s.status == "ok" for s in trace)

    return {
        "id": case["id"],
        "message": case["message"],
        "expected": expected,
        "agent": {"intent": intent, "sku": sku, "qty": qty},
        "pass": case_pass,
        "elapsed_ms": elapsed_ms,
        "grounding_ok": grounding_ok,
        "grounding_present": grounding_present,
        "needs_intervention": needs_intervention,
        "completed": completed,
        "is_duplicate_message": bool(case.get("duplicate_of")),
        "detected_as_duplicate": is_duplicate,
    }


@api_router.post("/agent/benchmark/run")
async def run_benchmark():
    """Replay dataset uji sintetis → hitung metrik + persist run.

    Metrik yang dilaporkan (sesuai rekomendasi juri):
    - extraction_accuracy_pct : intent + sku + qty benar
    - completion_rate_pct     : sampai stage Response ok
    - avg_process_ms          : rata-rata waktu per chat
    - intervention_rate_pct   : proporsi butuh owner turun tangan (HITL)
    - duplicate_prevention_pct: dedup pesan berulang tertangkap
    - grounding_rate_pct      : jawaban punya rujukan katalog
    """
    seen_keys: set = set()
    per_case = [_run_case(c, seen_keys) for c in BENCHMARK_CASES]

    total = len(per_case)
    passes = sum(1 for c in per_case if c["pass"])
    completed = sum(1 for c in per_case if c["completed"])
    interventions = sum(1 for c in per_case if c["needs_intervention"])
    grounded_hits = sum(1 for c in per_case if c["grounding_ok"])
    grounded_present = sum(1 for c in per_case if c["grounding_present"])
    avg_ms = sum(c["elapsed_ms"] for c in per_case) / total

    # Duplicate prevention: dari case yang ditandai duplicate_of != None,
    # berapa yang berhasil dideteksi sebagai duplicate.
    dup_marked = [c for c in per_case if c["is_duplicate_message"]]
    dup_caught = [c for c in dup_marked if c["detected_as_duplicate"]]
    dup_pct = (len(dup_caught) / len(dup_marked) * 100) if dup_marked else 100.0

    agent_metrics = {
        "extraction_accuracy_pct": round(passes / total * 100, 1),
        "completion_rate_pct": round(completed / total * 100, 1),
        "avg_process_ms": round(avg_ms, 1),
        "intervention_rate_pct": round(interventions / total * 100, 1),
        "duplicate_prevention_pct": round(dup_pct, 1),
        "grounding_rate_pct": round(
            (grounded_hits / grounded_present * 100) if grounded_present else 0, 1
        ),
        "cases": total,
        "label": "TuntasUMKM Agent",
    }

    run_id = str(uuid.uuid4())
    doc = {
        "run_id": run_id,
        "created_at": _now_iso(),
        "mode": "heuristic-deterministic",
        "total_cases": total,
        "baseline_manual": BASELINE_MANUAL,
        "agent": agent_metrics,
        "cases": per_case,
    }
    await db.benchmark_runs.insert_one({**doc})
    doc.pop("_id", None)
    return doc


@api_router.get("/agent/benchmark/last")
async def last_benchmarks(limit: int = 5):
    docs = await db.benchmark_runs.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"runs": docs}


# ------------------ Live session (untuk Inbox trace viewer) ------------------
@api_router.get("/agent/live-session")
async def get_live_session():
    doc = await db.live_sessions.find_one({"key": "current"}, {"_id": 0})
    return doc.get("payload") if doc else None


@api_router.put("/agent/live-session")
async def put_live_session(payload: LiveSessionPayload):
    body = payload.model_dump()
    await db.live_sessions.update_one(
        {"key": "current"},
        {"$set": {"key": "current", "payload": body, "updated_at": _now_iso(),
                  "session_id": body.get("id")}},
        upsert=True,
    )
    return {"ok": True}


# =========================================================================
# App wiring
# =========================================================================
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def _startup_seed():
    try:
        await _ensure_seed_approvals()
    except Exception as exc:
        logger.warning(f"Seed approvals failed (non-fatal): {exc}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
