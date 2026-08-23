// Mock data tim & akses untuk halaman Pengaturan → User Management.

export const ROLES = [
  {
    id: "owner",
    label: "Owner",
    desc: "Akses penuh: approval, katalog, billing, dan kelola tim.",
  },
  {
    id: "admin",
    label: "Admin",
    desc: "Bisa approve pesanan dan ubah katalog, tapi nggak bisa hapus akun.",
  },
  {
    id: "staff",
    label: "Staff CS",
    desc: "Balas chat dan ajukan draft pesanan. Approval tetap ke owner.",
  },
  {
    id: "viewer",
    label: "Viewer",
    desc: "Cuma lihat analitik dan jejak workflow. Read-only.",
  },
];

export const roleLabel = (id) => ROLES.find((r) => r.id === id)?.label || id;

export const TEAM = [
  {
    id: "usr-001",
    name: "Rina Pratiwi",
    email: "rina@warungkopisenja.id",
    role: "owner",
    status: "aktif",
    provider: "google",
    lastActive: "Baru saja",
  },
  {
    id: "usr-002",
    name: "Bagas Nugroho",
    email: "bagas@warungkopisenja.id",
    role: "admin",
    status: "aktif",
    provider: "email",
    lastActive: "12 menit lalu",
  },
  {
    id: "usr-003",
    name: "Sari Meliana",
    email: "sari.cs@warungkopisenja.id",
    role: "staff",
    status: "aktif",
    provider: "google",
    lastActive: "1 jam lalu",
  },
  {
    id: "usr-004",
    name: "Dimas Aryo",
    email: "dimas.magang@warungkopisenja.id",
    role: "staff",
    status: "diundang",
    provider: "email",
    lastActive: "Belum pernah",
  },
  {
    id: "usr-005",
    name: "Pak Hendra (Investor)",
    email: "hendra@angelfund.co",
    role: "viewer",
    status: "nonaktif",
    provider: "email",
    lastActive: "6 hari lalu",
  },
];

export const AGENT_PREFS = {
  autoApproveUnder: 100000,
  reminderMinutes: 15,
  customerNoticeMinutes: 30,
  autoHoldMinutes: 60,
};
