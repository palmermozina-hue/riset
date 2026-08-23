import {
  Bell,
  Boxes,
  Brain,
  ClipboardCheck,
  Inbox,
  LineChart,
  MessageSquare,
  ShieldQuestion,
  Terminal,
  Wrench,
} from "lucide-react";

export const ACTION_META = {
  intake: { label: "Pesan masuk", icon: Inbox, dot: "bg-stone-500" },
  understanding: { label: "Klasifikasi intent", icon: Brain, dot: "bg-indigo-600" },
  grounding: { label: "Grounding katalog", icon: Terminal, dot: "bg-sky-600" },
  tool_call: { label: "Tool call", icon: Wrench, dot: "bg-emerald-700" },
  approval_request: { label: "Minta approval", icon: ShieldQuestion, dot: "bg-orange-500" },
  approval_decision: { label: "Keputusan owner", icon: ClipboardCheck, dot: "bg-emerald-900" },
  stock_change: { label: "Perubahan stok", icon: Boxes, dot: "bg-amber-600" },
  response: { label: "Balasan terkirim", icon: MessageSquare, dot: "bg-teal-600" },
  analytics: { label: "Event analytics", icon: LineChart, dot: "bg-stone-400" },
  notification: { label: "Notifikasi pelanggan", icon: Bell, dot: "bg-rose-500" },
};

export const STATUS_META = {
  ok: { label: "OK", chip: "bg-emerald-100 text-emerald-800" },
  warn: { label: "Warning", chip: "bg-amber-100 text-amber-800" },
  err: { label: "Error", chip: "bg-red-100 text-red-800" },
  wait: { label: "Menunggu", chip: "bg-orange-100 text-orange-800" },
  skip: { label: "Dilewati", chip: "bg-stone-200 text-stone-700" },
  approve: { label: "Disetujui", chip: "bg-emerald-100 text-emerald-800" },
  reject: { label: "Ditolak", chip: "bg-red-100 text-red-800" },
};

export const ACTOR_META = {
  agent: { label: "Agent" },
  owner: { label: "Owner" },
  system: { label: "System" },
};
