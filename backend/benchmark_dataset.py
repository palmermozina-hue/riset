"""Dataset uji sintetis untuk Benchmark / Impact page.

32 percakapan realistis untuk UMKM Warung Kopi Senja — mencakup:
- typo & bahasa informal (kak, aja, blm, dong)
- produk ambigu, produk tidak tersedia
- pertanyaan stok/harga
- niat pesan lengkap & tidak lengkap
- keluhan
- pesan duplikat (untuk dedup test)

Setiap case punya `expected` — ground truth yang dibandingkan dengan output
pipeline (intent, sku, qty). Angka baseline_manual di endpoint /benchmark/run
berasal dari studi lapangan UMKM (rata-rata handle 60-120 detik per chat,
intervensi manusia 100% karena semua manual).
"""

BENCHMARK_CASES = [
    # ---------- tanya_stok / tanya_produk ----------
    {"id": "T01", "message": "kak kopi susu gula aren ready ga?",
     "expected": {"intent": "tanya_stok", "sku": "KSA-1L"}},
    {"id": "T02", "message": "americano 500 masih ada?",
     "expected": {"intent": "tanya_stok", "sku": "AMR-500"}},
    {"id": "T03", "message": "harga croissant butter berapa ya?",
     "expected": {"intent": "tanya_stok", "sku": "CRB-01"}},
    {"id": "T04", "message": "matcha latte ada ga sis?",
     "expected": {"intent": "tanya_stok", "sku": "MTC-1L"}},
    {"id": "T05", "message": "cold brew sachet 250 stoknya berapa?",
     "expected": {"intent": "tanya_stok", "sku": "CKS-250"}},
    {"id": "T06", "message": "banana cake ready?",
     "expected": {"intent": "tanya_stok", "sku": "BNS-06"}},
    {"id": "T07", "message": "kopi susu aren harganya piro min",
     "expected": {"intent": "tanya_stok", "sku": "KSA-1L"}},
    {"id": "T08", "message": "americano botolan gede berapa?",
     "expected": {"intent": "tanya_stok", "sku": "AMR-500"}},

    # ---------- mau_pesan (produk & qty jelas) ----------
    {"id": "P01", "message": "mau pesan 2 kopi susu gula aren 1 liter dong",
     "expected": {"intent": "mau_pesan", "sku": "KSA-1L", "qty": 2}},
    {"id": "P02", "message": "order 3 americano botol 500ml ya kak",
     "expected": {"intent": "mau_pesan", "sku": "AMR-500", "qty": 3}},
    {"id": "P03", "message": "beli 5 croissant butter",
     "expected": {"intent": "mau_pesan", "sku": "CRB-01", "qty": 5}},
    {"id": "P04", "message": "aku ambil 4 cold brew sachet 250ml",
     "expected": {"intent": "mau_pesan", "sku": "CKS-250", "qty": 4}},
    {"id": "P05", "message": "checkout 2 banana cake slice ya",
     "expected": {"intent": "mau_pesan", "sku": "BNS-06", "qty": 2}},
    {"id": "P06", "message": "pesan 1 kopi susu gula aren aja",
     "expected": {"intent": "mau_pesan", "sku": "KSA-1L", "qty": 1}},
    {"id": "P07", "message": "gue mau order 6 croissant butter",
     "expected": {"intent": "mau_pesan", "sku": "CRB-01", "qty": 6}},
    {"id": "P08", "message": "mau beli americano botol 500 3 biji",
     "expected": {"intent": "mau_pesan", "sku": "AMR-500", "qty": 3}},

    # ---------- mau_pesan stok kosong (matcha) ----------
    {"id": "S01", "message": "mau order 2 matcha latte 1 liter",
     "expected": {"intent": "mau_pesan", "sku": "MTC-1L", "qty": 2, "out_of_stock": True}},
    {"id": "S02", "message": "beli 1 matcha latte ya",
     "expected": {"intent": "mau_pesan", "sku": "MTC-1L", "qty": 1, "out_of_stock": True}},

    # ---------- mau_pesan ambigu (produk atau qty hilang) ----------
    {"id": "A01", "message": "mau pesan dong",
     "expected": {"intent": "mau_pesan", "sku": None, "qty": None}},
    {"id": "A02", "message": "aku ambil kopi ya",
     "expected": {"intent": "mau_pesan", "sku": None}},
    {"id": "A03", "message": "beli croissant beberapa",
     "expected": {"intent": "mau_pesan", "sku": "CRB-01", "qty": None}},

    # ---------- keluhan ----------
    {"id": "K01", "message": "pesanan aku belum sampai kak, komplain nih",
     "expected": {"intent": "keluhan"}},
    {"id": "K02", "message": "kopinya asem banget, kecewa",
     "expected": {"intent": "keluhan"}},
    {"id": "K03", "message": "salah kirim produk, mau refund",
     "expected": {"intent": "keluhan"}},
    {"id": "K04", "message": "botolnya rusak pas dateng",
     "expected": {"intent": "keluhan"}},

    # ---------- lainnya (small talk / open-ended) ----------
    {"id": "L01", "message": "halo kak",
     "expected": {"intent": "lainnya"}},
    {"id": "L02", "message": "buka jam berapa?",
     "expected": {"intent": "lainnya"}},
    {"id": "L03", "message": "makasih ya",
     "expected": {"intent": "lainnya"}},

    # ---------- typo + bahasa gaul ----------
    {"id": "G01", "message": "sist kpi susu aren ada g",
     "expected": {"intent": "tanya_stok", "sku": "KSA-1L"}},
    {"id": "G02", "message": "gw mau psn 2 amrcno 500ml",
     "expected": {"intent": "mau_pesan", "sku": "AMR-500", "qty": 2}},

    # ---------- Duplicate case (dipakai untuk dedup test) ----------
    {"id": "D01", "message": "mau pesan 1 kopi susu gula aren",
     "expected": {"intent": "mau_pesan", "sku": "KSA-1L", "qty": 1},
     "duplicate_of": None},
    {"id": "D02", "message": "mau pesan 1 kopi susu gula aren",
     "expected": {"intent": "mau_pesan", "sku": "KSA-1L", "qty": 1},
     "duplicate_of": "D01"},
]

# Baseline manual handling — riset lapangan UMKM (PRD §2 & §8.1)
BASELINE_MANUAL = {
    "extraction_accuracy_pct": 68.0,   # Owner sering salah baca produk/qty saat sibuk
    "completion_rate_pct": 71.0,       # Chat sering ketinggalan
    "avg_process_ms": 92000.0,         # ~90 detik owner buka HP → cek stok → balas
    "intervention_rate_pct": 100.0,    # Semua manual, no automation
    "duplicate_prevention_pct": 12.0,  # Owner jarang notice dupe → double order
    "grounding_rate_pct": 74.0,        # Owner sering salah info harga/stok
    "cases": len(BENCHMARK_CASES),
    "label": "Manual (baseline UMKM)",
}
