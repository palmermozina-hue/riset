export const PAIN_POINTS = [
  {
    icon: "MessageSquareDashed",
    title: "Chat masuk nggak ada habisnya",
    desc: "\"Ready kak?\", \"Ada size L?\", \"Ongkir ke Bekasi berapa?\" — pertanyaan sama, diulang ratusan kali tiap hari.",
  },
  {
    icon: "PackageX",
    title: "Stok sering nggak sinkron",
    desc: "Kamu bilang ready, ternyata habis. Ujung-ujungnya batal order dan rating toko ikut kena.",
  },
  {
    icon: "MoonStar",
    title: "Pembeli kabur pas kamu tidur",
    desc: "Jam 11 malam ada yang nanya, dibales besok pagi. Calon pembeli udah checkout di toko sebelah.",
  },
];

export const PIPELINE = [
  { n: "01", title: "Intake", desc: "Chat dari WhatsApp, IG, atau marketplace masuk ke satu inbox." },
  { n: "02", title: "Understanding", desc: "Agent baca maksud pembeli: tanya stok, mau order, atau komplain." },
  { n: "03", title: "Grounding", desc: "Jawaban ditarik dari katalog & SOP toko kamu, bukan halusinasi." },
  { n: "04", title: "Tool Call", desc: "Agent cek stok, hitung ongkir, dan susun draft order otomatis." },
  { n: "05", title: "Approval", desc: "Aksi berisiko nunggu kamu klik setuju dulu. Kamu tetap bos." },
  { n: "06", title: "Response", desc: "Balasan dikirim dengan gaya bahasa toko kamu, dalam hitungan detik." },
  { n: "07", title: "Analytics", desc: "Tiap percakapan jadi data: produk paling dicari sampai jam ramai." },
];

export const FEATURES = [
  {
    icon: "Sparkles",
    title: "Auto-reply yang ngerti konteks",
    desc: "Bukan template kaku. Agent nyambung sama riwayat chat dan gaya bahasa toko kamu.",
    span: "md:col-span-7",
    tone: "emerald",
  },
  {
    icon: "Boxes",
    title: "Cek stok real-time",
    desc: "Terhubung langsung ke data stok, jadi nggak pernah janji barang yang udah habis.",
    span: "md:col-span-5",
    tone: "plain",
  },
  {
    icon: "ReceiptText",
    title: "Draft order otomatis",
    desc: "Nama, alamat, item, dan total dirangkum jadi draft order. Kamu cuma konfirmasi.",
    span: "md:col-span-5",
    tone: "plain",
  },
  {
    icon: "ShieldCheck",
    title: "Human-in-the-loop approval",
    desc: "Diskon, refund, atau perubahan harga selalu minta izin kamu sebelum dieksekusi.",
    span: "md:col-span-7",
    tone: "orange",
  },
  {
    icon: "BarChart3",
    title: "Analytics operasional",
    desc: "Lihat produk paling dicari, jam paling ramai, dan chat yang gagal closing.",
    span: "md:col-span-4",
    tone: "plain",
  },
  {
    icon: "BookOpenText",
    title: "RAG knowledge produk",
    desc: "Upload katalog, SOP, dan FAQ. Agent jawab persis sesuai isi dokumen kamu.",
    span: "md:col-span-4",
    tone: "plain",
  },
  {
    icon: "Workflow",
    title: "Satu inbox multi-channel",
    desc: "WhatsApp, Instagram, dan marketplace ngumpul rapi di satu tempat.",
    span: "md:col-span-4",
    tone: "plain",
  },
];

export const COMPARISON = [
  { label: "Jawab pertanyaan umum", chatbot: true, agent: true },
  { label: "Nyambung sama data stok asli", chatbot: false, agent: true },
  { label: "Bikin draft order sendiri", chatbot: false, agent: true },
  { label: "Minta approval sebelum aksi berisiko", chatbot: false, agent: true },
  { label: "Ngerti katalog & SOP toko kamu", chatbot: false, agent: true },
  { label: "Kasih insight operasional", chatbot: false, agent: true },
  { label: "Kabur kalau ditanya di luar skrip", chatbot: true, agent: false },
];

export const SEGMENTS = [
  {
    title: "Warung & F&B Online",
    desc: "Pesanan makan siang numpuk barengan. Agent susun order sambil kamu masak.",
    image: "https://images.pexels.com/photos/3906984/pexels-photo-3906984.jpeg",
    stat: "±180 chat/hari",
  },
  {
    title: "Fashion Boutique",
    desc: "Tanya size, warna, dan ready stock kejawab otomatis dari katalog kamu.",
    image: "https://images.pexels.com/photos/32549955/pexels-photo-32549955.jpeg",
    stat: "3x lebih cepat closing",
  },
  {
    title: "Toko Elektronik",
    desc: "Spek teknis, garansi, dan perbandingan produk dijelasin akurat, bukan ngarang.",
    image: "https://images.pexels.com/photos/33357410/pexels-photo-33357410.png",
    stat: "Jawaban berbasis dokumen",
  },
];

export const CHAT_SCRIPT = [
  { from: "user", text: "Kak, keripik pedas level 3 masih ready? Mau 2 pack ke Bandung" },
  { from: "agent", text: "Ready kak! Level 3 sisa 14 pack. 2 pack + ongkir Bandung Rp 12.000 = Rp 78.000 🌶" },
  { from: "tool", text: "cek_stok(sku: KRP-L3) → 14 tersedia" },
  { from: "agent", text: "Aku udah siapin draft ordernya, tinggal kakak konfirmasi alamat ya" },
];
