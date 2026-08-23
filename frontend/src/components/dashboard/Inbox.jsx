import { useEffect, useMemo, useState } from "react";
import { Bot, Radio, Send, User } from "lucide-react";
import { toast } from "sonner";
import { CONVERSATIONS } from "@/data/mockDashboard";
import { DASHBOARD } from "@/constants/testIds";
import { TraceViewer } from "@/components/dashboard/TraceViewer";
import { getLiveSession, subscribeStore } from "@/lib/mockStore";

const statusStyle = {
  "menunggu approval": "bg-orange-50 text-orange-700",
  "selesai otomatis": "bg-emerald-50 text-emerald-700",
  "perlu perhatian": "bg-red-50 text-red-600",
};

export const Inbox = () => {
  const [live, setLive] = useState(() => getLiveSession());
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState("");

  // Percakapan /demo yang sedang berjalan ikut nongol di Inbox, lengkap
  // dengan trace 7-tahap yang asli dari backend.
  useEffect(() => subscribeStore(() => setLive(getLiveSession())), []);

  const conversations = useMemo(
    () => (live ? [live, ...CONVERSATIONS] : CONVERSATIONS),
    [live]
  );

  const active =
    conversations.find((c) => c.id === activeId) || conversations[0];

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    toast.info("Mode demo: balasan manual belum tersambung ke kanal chat.");
    setDraft("");
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      {/* Daftar percakapan */}
      <div className="rounded-3xl border border-stone-200 bg-white p-3 xl:col-span-3">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            data-testid={DASHBOARD.conversationItem(c.id)}
            className={`w-full rounded-2xl p-4 text-left transition-colors duration-200 ${
              c.id === active.id ? "bg-emerald-50" : "hover:bg-stone-50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-stone-900">
                {c.id === "live" && (
                  <Radio size={13} className="animate-pulse text-orange-600" />
                )}
                {c.customer}
              </span>
              <span className="text-xs text-stone-400">{c.lastAt}</span>
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-stone-500">
              {c.messages[c.messages.length - 1]?.text}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-stone-500">
                {c.channel}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  statusStyle[c.status] || "bg-stone-100 text-stone-600"
                }`}
              >
                {c.status}
              </span>
              {c.unread > 0 && (
                <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                  {c.unread}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Thread */}
      <div
        className="flex flex-col rounded-3xl border border-stone-200 bg-white xl:col-span-5"
        data-testid={DASHBOARD.conversationThread}
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div>
            <p className="font-display text-lg font-semibold text-stone-900">{active.customer}</p>
            <p className="text-xs text-stone-500">
              {active.channel} · intent terakhir{" "}
              <code className="text-emerald-700">{active.intent}</code>
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 bg-stone-50/60 px-6 py-6">
          {active.messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.from === "agent" ? "flex-row-reverse" : ""}`}>
              <span
                className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                  m.from === "agent"
                    ? "bg-emerald-900 text-white"
                    : "border border-stone-200 bg-white text-stone-500"
                }`}
              >
                {m.from === "agent" ? <Bot size={14} /> : <User size={14} />}
              </span>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "agent"
                    ? "bg-emerald-900 text-white"
                    : "border border-stone-200 bg-white text-stone-700"
                }`}
              >
                {m.text}
                <span
                  className={`mt-1.5 block text-[10px] ${
                    m.from === "agent" ? "text-emerald-200/70" : "text-stone-400"
                  }`}
                >
                  {m.at}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-stone-100 p-4">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ambil alih percakapan..."
            data-testid="inbox-reply-input"
            className="flex-1 rounded-full border border-stone-300 px-4 py-2.5 text-sm focus-visible:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/25"
          />
          <button
            type="submit"
            data-testid="inbox-reply-send"
            className="grid h-11 w-11 place-items-center rounded-full bg-orange-600 text-white transition-colors duration-200 hover:bg-orange-700 active:scale-95"
            aria-label="Kirim balasan"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Trace pipeline — sekarang bisa diklik per tahap */}
      <div className="xl:col-span-4">
        <TraceViewer
          trace={active.trace}
          subtitle={
            active.id === "live"
              ? "Jejak asli dari sesi /demo yang barusan jalan. Klik tiap tahap."
              : "7 tahap pipeline percakapan ini. Klik tiap tahap."
          }
        />
      </div>
    </div>
  );
};
