import { useState } from "react";
import { Bot, Check, CircleDashed, Loader2, MinusCircle, Send, User } from "lucide-react";
import { toast } from "sonner";
import { CONVERSATIONS } from "@/data/mockDashboard";
import { DASHBOARD } from "@/constants/testIds";

const statusStyle = {
  "menunggu approval": "bg-orange-50 text-orange-700",
  "selesai otomatis": "bg-emerald-50 text-emerald-700",
  "perlu perhatian": "bg-red-50 text-red-600",
};

const traceIcon = {
  ok: <Check size={12} />,
  wait: <Loader2 size={12} className="animate-spin" />,
  skip: <MinusCircle size={12} />,
  idle: <CircleDashed size={12} />,
};

const traceColor = {
  ok: "bg-emerald-800 text-white",
  wait: "bg-orange-600 text-white",
  skip: "bg-stone-300 text-stone-700",
  idle: "bg-stone-100 text-stone-400",
};

export const Inbox = () => {
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState("");
  const active = CONVERSATIONS.find((c) => c.id === activeId);

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    toast.info("Mode demo: balasan manual belum tersambung ke kanal chat.");
    setDraft("");
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      {/* Daftar percakapan */}
      <div className="rounded-3xl border border-stone-200 bg-white p-3 xl:col-span-4">
        {CONVERSATIONS.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            data-testid={DASHBOARD.conversationItem(c.id)}
            className={`w-full rounded-2xl p-4 text-left transition-colors ${
              c.id === activeId ? "bg-emerald-50" : "hover:bg-stone-50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-stone-900">{c.customer}</span>
              <span className="text-xs text-stone-400">{c.lastAt}</span>
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-stone-500">
              {c.messages[c.messages.length - 1].text}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-stone-500">
                {c.channel}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${statusStyle[c.status]}`}>
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
      <div className="flex flex-col rounded-3xl border border-stone-200 bg-white xl:col-span-5" data-testid={DASHBOARD.conversationThread}>
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div>
            <p className="font-display text-lg font-semibold text-stone-900">{active.customer}</p>
            <p className="text-xs text-stone-500">
              {active.channel} · intent terakhir <code className="text-emerald-700">{active.intent}</code>
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 bg-stone-50/60 px-6 py-6">
          {active.messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${m.from === "agent" ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                  m.from === "agent" ? "bg-emerald-900 text-white" : "bg-white text-stone-500 border border-stone-200"
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
            className="grid h-11 w-11 place-items-center rounded-full bg-orange-600 text-white transition-colors hover:bg-orange-700 active:scale-95"
            aria-label="Kirim balasan"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Trace pipeline */}
      <div className="rounded-3xl border border-stone-200 bg-white p-7 xl:col-span-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          Jejak workflow
        </p>
        <p className="mt-2 text-xs text-stone-500">7 tahap pipeline percakapan ini.</p>
        <ol className="mt-6 space-y-4">
          {active.trace.map((t, i) => (
            <li key={t.stage} className="flex gap-3" data-testid={DASHBOARD.traceStage(i)}>
              <div className="flex flex-col items-center">
                <span className={`grid h-6 w-6 place-items-center rounded-full ${traceColor[t.status]}`}>
                  {traceIcon[t.status]}
                </span>
                {i < active.trace.length - 1 && <span className="mt-1 h-6 w-px bg-stone-200" />}
              </div>
              <div className="pb-1">
                <p className="text-sm font-semibold text-stone-800">{t.stage}</p>
                <p className="text-xs leading-relaxed text-stone-500">{t.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
