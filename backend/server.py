from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB (template — belum dipakai untuk agent)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

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
    approval: Optional[ApprovalItem] = None

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
    """Coba parse JSON dari balasan LLM (kadang di-wrap markdown fence)."""
    text = text.strip()
    # Coba direct
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Coba dari fence
    m = re.search(r"\{[\s\S]*\}", text)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass
    return {}


async def call_llm(message: str, history: List[ChatMsg]) -> tuple[dict, int]:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(500, "OPENROUTER_API_KEY belum di-set")

    msgs = [{"role": "system", "content": SYSTEM_PROMPT}]
    for h in history[-8:]:  # cap history
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
    async with httpx.AsyncClient(timeout=30.0) as http:
        r = await http.post(OPENROUTER_URL, json=payload, headers=headers)
    elapsed_ms = int((datetime.now() - start).total_seconds() * 1000)
    if r.status_code != 200:
        logger.error(f"OpenRouter {r.status_code}: {r.text[:400]}")
        raise HTTPException(502, f"LLM error: {r.status_code}")
    data = r.json()
    content = data["choices"][0]["message"]["content"]
    parsed = extract_json(content)
    if not parsed:
        logger.error(f"LLM output not parseable: {content[:400]}")
        parsed = {"intent": "lainnya", "sku": None, "qty": None,
                  "reply": "Maaf kak, aku belum nangkep maksudmu. Coba tulis ulang ya?",
                  "confidence": 0.3}
    return parsed, elapsed_ms


# =========================================================================
# Routes
# =========================================================================
@api_router.get("/")
async def root():
    return {"message": "TuntasUMKM API online", "model": OPENROUTER_MODEL}

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
    parsed, llm_ms = await call_llm(req.message, req.history)
    intent = parsed.get("intent", "lainnya")
    sku = parsed.get("sku")
    qty = parsed.get("qty")
    reply = parsed.get("reply") or "Halo kak 👋 ada yang bisa aku bantu?"
    confidence = float(parsed.get("confidence", 0.7))

    approval = None
    approval_id = None
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

    trace = build_trace(intent, sku, qty, req.session_id, confidence, llm_ms, approval_id)
    return AgentResponse(intent=intent, reply=reply, trace=trace, approval=approval)


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
