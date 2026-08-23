// Mock data untuk Owner Dashboard TuntasUMKM (belum ada backend).

export const OWNER = {
  storeName: "Warung Kopi Senja",
  ownerName: "Rina Pratiwi",
  plan: "Pilot Hackfest",
};

export const METRICS = [
  {
    id: "chat",
    label: "Chat masuk hari ini",
    value: "142",
    delta: "+18%",
    trend: "up",
    icon: "MessagesSquare",
    hint: "128 dijawab otomatis oleh agent",
  },
  {
    id: "order",
    label: "Pesanan terbentuk",
    value: "37",
    delta: "+9%",
    trend: "up",
    icon: "ShoppingBag",
    hint: "31 lewat approval otomatis kamu",
  },
  {
    id: "omzet",
    label: "Omzet hari ini",
    value: "Rp 4.86jt",
    delta: "+23%",
    trend: "up",
    icon: "Wallet",
    hint: "Rata-rata Rp 131rb / pesanan",
  },
  {
    id: "hemat",
    label: "Waktu terhemat",
    value: "3j 40m",
    delta: "hari ini",
    trend: "flat",
    icon: "Timer",
    hint: "Setara 220 balasan manual",
  },
];

export const APPROVALS = [
  {
    id: "APV-1042",
    customer: "Dewi Ananta",
    channel: "WhatsApp",
    action: "Buat pesanan",
    risk: "sedang",
    createdAt: "2 menit lalu",
    total: 148000,
    items: [
      { name: "Kopi Susu Gula Aren 1L", qty: 2, price: 59000 },
      { name: "Croissant Butter", qty: 2, price: 15000 },
    ],
    note: "Minta dikirim hari ini sebelum jam 5, alamat Bekasi Timur.",
  },
  {
    id: "APV-1041",
    customer: "Bagas Herlambang",
    channel: "Instagram DM",
    action: "Buat pesanan",
    risk: "rendah",
    createdAt: "9 menit lalu",
    total: 87000,
    items: [
      { name: "Americano Botol 500ml", qty: 3, price: 29000 },
    ],
    note: "Pembayaran transfer BCA, sudah kirim bukti.",
  },
  {
    id: "APV-1040",
    customer: "Sinta Maharani",
    channel: "WhatsApp",
    action: "Update stok",
    risk: "tinggi",
    createdAt: "14 menit lalu",
    total: 0,
    items: [
      { name: "Kopi Susu Gula Aren 1L", qty: -6, price: 0 },
    ],
    note: "Agent deteksi selisih stok setelah 6 pesanan offline dari kasir.",
  },
  {
    id: "APV-1039",
    customer: "Toko Rejeki (Reseller)",
    channel: "Marketplace",
    action: "Buat pesanan",
    risk: "sedang",
    createdAt: "26 menit lalu",
    total: 1240000,
    items: [
      { name: "Kopi Susu Gula Aren 1L", qty: 20, price: 55000 },
      { name: "Americano Botol 500ml", qty: 5, price: 28000 },
    ],
    note: "Order grosir, minta harga reseller. Agent pakai price tier B.",
  },
];

export const CONVERSATIONS = [
  {
    id: "c1",
    customer: "Dewi Ananta",
    channel: "WhatsApp",
    lastAt: "10:24",
    unread: 2,
    status: "menunggu approval",
    intent: "mau_pesan",
    messages: [
      { from: "customer", text: "Kak kopi gula aren yg 1 liter ready gak?", at: "10:19" },
      { from: "agent", text: "Ready kak! Sisa 12 botol. Harganya Rp 59.000 per liter 😊", at: "10:19" },
      { from: "customer", text: "ambil 2 ya, plus croissant 2. total brp?", at: "10:22" },
      { from: "agent", text: "Totalnya Rp 148.000 (belum ongkir). Aku bikin draft pesanannya dulu ya, tunggu konfirmasi owner sebentar.", at: "10:24" },
    ],
    trace: [
      { stage: "Intake", status: "ok", detail: "Dedup key baru, session #4821" },
      { stage: "Understanding", status: "ok", detail: "intent=mau_pesan (0.94), qty=2" },
      { stage: "Grounding", status: "ok", detail: "RAG hit: SKU KSA-1L, stok DB 12" },
      { stage: "Tool Call", status: "ok", detail: "buat_draft_pesanan → Rp 148.000" },
      { stage: "Approval", status: "wait", detail: "Menunggu owner (APV-1042)" },
      { stage: "Response", status: "idle", detail: "Belum dikirim" },
      { stage: "Analytics", status: "idle", detail: "Menunggu penutupan workflow" },
    ],
  },
  {
    id: "c2",
    customer: "Bagas Herlambang",
    channel: "Instagram DM",
    lastAt: "10:15",
    unread: 0,
    status: "selesai otomatis",
    intent: "tanya_stok",
    messages: [
      { from: "customer", text: "americano botol masih ada gak bang", at: "10:12" },
      { from: "agent", text: "Masih ada kak, stok 24 botol. Rp 29.000 aja per botol.", at: "10:12" },
      { from: "customer", text: "oke gw ambil 3", at: "10:14" },
      { from: "agent", text: "Sip, draft pesanan Rp 87.000 udah aku buat. Konfirmasi owner keluar bentar lagi ya 🙌", at: "10:15" },
    ],
    trace: [
      { stage: "Intake", status: "ok", detail: "Session #4818" },
      { stage: "Understanding", status: "ok", detail: "intent=tanya_stok (0.91)" },
      { stage: "Grounding", status: "ok", detail: "BM25 exact: AMR-500" },
      { stage: "Tool Call", status: "ok", detail: "cek_stok → 24" },
      { stage: "Approval", status: "skip", detail: "Read-only, bypass gate" },
      { stage: "Response", status: "ok", detail: "Balasan terkirim 1.8s" },
      { stage: "Analytics", status: "ok", detail: "Event tercatat" },
    ],
  },
  {
    id: "c3",
    customer: "Sinta Maharani",
    channel: "WhatsApp",
    lastAt: "09:58",
    unread: 1,
    status: "perlu perhatian",
    intent: "keluhan",
    messages: [
      { from: "customer", text: "pesanan kemarin kurang 1 botol kak :(", at: "09:55" },
      { from: "agent", text: "Waduh maaf banget kak. Aku cek pesanan #ORD-2291 dulu ya, nanti owner yang konfirmasi penggantiannya.", at: "09:58" },
    ],
    trace: [
      { stage: "Intake", status: "ok", detail: "Session #4801" },
      { stage: "Understanding", status: "ok", detail: "intent=keluhan (0.88)" },
      { stage: "Grounding", status: "ok", detail: "Order history #ORD-2291" },
      { stage: "Tool Call", status: "ok", detail: "kirim_notifikasi(owner)" },
      { stage: "Approval", status: "wait", detail: "Butuh keputusan owner" },
      { stage: "Response", status: "ok", detail: "Balasan penenang terkirim" },
      { stage: "Analytics", status: "idle", detail: "Workflow masih terbuka" },
    ],
  },
  {
    id: "c4",
    customer: "Toko Rejeki",
    channel: "Marketplace",
    lastAt: "09:31",
    unread: 0,
    status: "menunggu approval",
    intent: "mau_pesan",
    messages: [
      { from: "customer", text: "Bisa harga reseller untuk 20 liter gula aren?", at: "09:28" },
      { from: "agent", text: "Bisa kak, tier B: Rp 55.000/liter. Aku hitung total Rp 1.240.000 termasuk 5 americano ya.", at: "09:31" },
    ],
    trace: [
      { stage: "Intake", status: "ok", detail: "Session #4795" },
      { stage: "Understanding", status: "ok", detail: "intent=mau_pesan (0.96)" },
      { stage: "Grounding", status: "ok", detail: "Price tier reseller B" },
      { stage: "Tool Call", status: "ok", detail: "hitung_harga → 1.240.000" },
      { stage: "Approval", status: "wait", detail: "Nominal > Rp 1jt (APV-1039)" },
      { stage: "Response", status: "idle", detail: "Belum dikirim" },
      { stage: "Analytics", status: "idle", detail: "Menunggu" },
    ],
  },
];

export const PRODUCTS = [
  { sku: "KSA-1L", name: "Kopi Susu Gula Aren 1L", price: 59000, stock: 12, sold: 88, status: "aktif" },
  { sku: "AMR-500", name: "Americano Botol 500ml", price: 29000, stock: 24, sold: 61, status: "aktif" },
  { sku: "CRB-01", name: "Croissant Butter", price: 15000, stock: 6, sold: 44, status: "stok tipis" },
  { sku: "MTC-1L", name: "Matcha Latte 1L", price: 65000, stock: 0, sold: 39, status: "habis" },
  { sku: "CKS-250", name: "Cold Brew Sachet 250ml", price: 22000, stock: 48, sold: 27, status: "aktif" },
  { sku: "BNS-06", name: "Banana Cake Slice", price: 18000, stock: 15, sold: 21, status: "aktif" },
];

export const DAILY_SERIES = [
  { day: "Sen", chat: 96, order: 21 },
  { day: "Sel", chat: 118, order: 26 },
  { day: "Rab", chat: 104, order: 24 },
  { day: "Kam", chat: 131, order: 30 },
  { day: "Jum", chat: 158, order: 41 },
  { day: "Sab", chat: 176, order: 48 },
  { day: "Min", chat: 142, order: 37 },
];

export const INTENT_SERIES = [
  { intent: "tanya_stok", total: 312 },
  { intent: "mau_pesan", total: 248 },
  { intent: "tanya_produk", total: 187 },
  { intent: "keluhan", total: 46 },
  { intent: "lainnya", total: 29 },
];

export const AUTOMATION = [
  { label: "Dijawab otomatis", value: 82, tone: "emerald" },
  { label: "Butuh approval owner", value: 14, tone: "orange" },
  { label: "Eskalasi manual", value: 4, tone: "stone" },
];

export const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
