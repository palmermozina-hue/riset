// Scripted mock agent — mensimulasikan 7-stage pipeline TuntasUMKM.
// Return: { trace: [ { stage, status, detail, ms } ], reply, intent, approval? }
import { PRODUCTS, rupiah } from "@/data/mockDashboard";

const STAGE_NAMES = [
  "Intake",
  "Understanding",
  "Grounding",
  "Tool Call",
  "Approval",
  "Response",
  "Analytics",
];

const findProduct = (text) => {
  const t = text.toLowerCase();
  const map = [
    { keys: ["kopi susu", "gula aren", "ksa"], sku: "KSA-1L" },
    { keys: ["americano", "amr"], sku: "AMR-500" },
    { keys: ["croissant", "crb"], sku: "CRB-01" },
    { keys: ["matcha", "mtc"], sku: "MTC-1L" },
    { keys: ["cold brew", "cks"], sku: "CKS-250" },
    { keys: ["banana", "cake", "bns"], sku: "BNS-06" },
  ];
  const hit = map.find((m) => m.keys.some((k) => t.includes(k)));
  if (!hit) return null;
  return PRODUCTS.find((p) => p.sku === hit.sku) || null;
};

const parseQty = (text) => {
  const m = text.match(/(\d+)\s*(pcs|botol|liter|pack|slice|kotak|item|biji|buah)?/i);
  const q = m ? parseInt(m[1], 10) : 1;
  return Math.max(1, Math.min(q, 99));
};

const detectIntent = (text) => {
  const t = text.toLowerCase();
  if (/(komplain|kurang|salah|rusak|refund|belum sampai|belum dateng)/.test(t)) return "keluhan";
  if (/(pesan|order|ambil|beli|checkout|mau .* dong|bayar)/.test(t)) return "mau_pesan";
  if (/(stok|ready|ada gak|ada ga|masih|tersedia)/.test(t)) return "tanya_stok";
  if (/(harga|berapa|price|rp)/.test(t)) return "tanya_produk";
  return "lainnya";
};

const conf = (base) => (base + Math.random() * 0.08).toFixed(2);
const nowShort = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const buildStages = (steps) => STAGE_NAMES.map((s) => steps[s] || { status: "idle", detail: "—", ms: 0 });

export const runAgent = (text, sessionId) => {
  const intent = detectIntent(text);
  const product = findProduct(text);
  const qty = parseQty(text);

  const base = {
    Intake: { status: "ok", detail: `Dedup key baru · session ${sessionId}`, ms: 120 },
    Understanding: {
      status: "ok",
      detail: `intent=${intent} (${conf(0.86)})${product ? ` · produk=${product.sku}` : ""}`,
      ms: 380,
    },
  };

  if (intent === "tanya_stok" || intent === "tanya_produk") {
    if (!product) {
      return {
        intent,
        reply:
          "Produk mana yang mau kamu tanyain kak? Kami ada Kopi Susu Gula Aren, Americano, Cold Brew, Matcha, sama pastry 🧁",
        trace: buildStages({
          ...base,
          Grounding: { status: "warn", detail: "Nggak ada match — minta klarifikasi", ms: 240 },
          Response: { status: "ok", detail: "Balasan klarifikasi terkirim", ms: 220 },
          Analytics: { status: "ok", detail: "Event low_confidence tercatat", ms: 90 },
        }),
      };
    }
    const stockNote =
      product.stock === 0
        ? `Yah, ${product.name} lagi habis kak. Aku catet ya kalau restok bakal kabarin duluan 🙏`
        : `${product.name} ready ${product.stock} ${product.stock > 12 ? "banyak" : "unit tersisa"}, harganya ${rupiah(
            product.price
          )}. Mau pesan berapa kak?`;
    return {
      intent,
      reply: stockNote,
      trace: buildStages({
        ...base,
        Grounding: {
          status: "ok",
          detail: `Hybrid RAG hit: ${product.sku} · stok DB ${product.stock}`,
          ms: 420,
        },
        "Tool Call": { status: "ok", detail: `cek_stok(${product.sku}) → ${product.stock}`, ms: 210 },
        Approval: { status: "skip", detail: "Read-only, bypass gate", ms: 0 },
        Response: { status: "ok", detail: `Balasan terkirim (${nowShort()})`, ms: 260 },
        Analytics: { status: "ok", detail: "Event stock_query tercatat", ms: 90 },
      }),
    };
  }

  if (intent === "mau_pesan") {
    if (!product) {
      return {
        intent,
        reply:
          "Siap kak! Kamu mau pesan yang mana ya? Aku bisa bantu bikin draft-nya begitu produk sama jumlahnya jelas.",
        trace: buildStages({
          ...base,
          Grounding: { status: "warn", detail: "Belum lengkap — butuh produk", ms: 230 },
          Response: { status: "ok", detail: "Klarifikasi terkirim", ms: 240 },
          Analytics: { status: "ok", detail: "Event partial_order", ms: 90 },
        }),
      };
    }
    if (product.stock === 0) {
      return {
        intent,
        reply: `Duh maaf kak, ${product.name} lagi kosong. Mau aku catetin waiting list?`,
        trace: buildStages({
          ...base,
          Grounding: { status: "ok", detail: `${product.sku} · stok DB 0`, ms: 380 },
          "Tool Call": { status: "err", detail: "buat_draft_pesanan → stok tidak cukup", ms: 180 },
          Response: { status: "ok", detail: "Balasan penenang + waitlist", ms: 260 },
          Analytics: { status: "ok", detail: "Event out_of_stock", ms: 90 },
        }),
      };
    }
    const total = product.price * qty;
    const approvalId = `APV-${Math.floor(2000 + Math.random() * 999)}`;
    const approval = {
      id: approvalId,
      customer: "Tamu Demo",
      channel: "Web Chat",
      action: "Buat pesanan",
      risk: total >= 500000 ? "tinggi" : total >= 150000 ? "sedang" : "rendah",
      createdAt: "baru saja",
      total,
      items: [{ name: product.name, qty, price: product.price }],
      note: "Order via demo publik TuntasUMKM.",
    };
    return {
      intent,
      approval,
      reply: `Sip kak! Aku udah bikin draft pesanan ${qty}× ${product.name} = ${rupiah(
        total
      )}. Nunggu owner klik setuju sebentar ya — biasanya < 2 menit 🙌`,
      trace: buildStages({
        ...base,
        Grounding: {
          status: "ok",
          detail: `RAG+BM25: ${product.sku} · stok cukup (${product.stock})`,
          ms: 430,
        },
        "Tool Call": {
          status: "ok",
          detail: `buat_draft_pesanan(${qty}× ${product.sku}) → ${rupiah(total)}`,
          ms: 320,
        },
        Approval: { status: "wait", detail: `Digantung di dashboard owner (${approvalId})`, ms: 0 },
        Response: { status: "ok", detail: "Draft konfirmasi terkirim", ms: 280 },
        Analytics: { status: "ok", detail: "Event order_pending tercatat", ms: 90 },
      }),
    };
  }

  if (intent === "keluhan") {
    return {
      intent,
      reply:
        "Waduh maaf banget kak. Aku forward ke owner buat penggantian ya. Boleh dikirim nomor pesanannya biar aku cari?",
      trace: buildStages({
        ...base,
        Grounding: { status: "ok", detail: "Cari order history · nomor pesanan?", ms: 340 },
        "Tool Call": { status: "ok", detail: "kirim_notifikasi(owner) · prioritas tinggi", ms: 240 },
        Approval: { status: "wait", detail: "Butuh keputusan owner untuk refund/tukar", ms: 0 },
        Response: { status: "ok", detail: "Balasan empati + minta nomor order", ms: 300 },
        Analytics: { status: "ok", detail: "Event complaint tercatat", ms: 90 },
      }),
    };
  }

  return {
    intent: "lainnya",
    reply:
      "Halo kak 👋 Aku agent-nya TuntasUMKM. Bisa bantu kamu cek stok, tanya harga, atau bikin pesanan. Coba tanyain produk yang kamu mau ya!",
    trace: buildStages({
      ...base,
      Understanding: { status: "warn", detail: "intent=lainnya (confidence rendah)", ms: 320 },
      Response: { status: "ok", detail: "Balasan welcome + hint pertanyaan", ms: 240 },
      Analytics: { status: "ok", detail: "Event fallback_reply", ms: 80 },
    }),
  };
};

export { STAGE_NAMES };
