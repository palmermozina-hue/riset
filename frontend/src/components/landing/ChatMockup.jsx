import { motion } from "framer-motion";
import { CheckCircle2, Terminal, Store } from "lucide-react";
import { CHAT_SCRIPT } from "@/data/content";

export const ChatMockup = () => (
  <div
    className="relative rounded-3xl border border-stone-200 bg-white p-4 shadow-2xl shadow-emerald-900/10 sm:p-5"
    data-testid="chat-mockup"
  >
    <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-900 text-white">
        <Store size={17} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-semibold text-stone-900">
          Keripik Bu Yani — WhatsApp
        </p>
        <p className="flex items-center gap-1.5 text-xs text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Agent aktif
        </p>
      </div>
    </div>

    <div className="space-y-3 pt-4">
      {CHAT_SCRIPT.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.35, duration: 0.45 }}
          className={m.from === "user" ? "flex justify-start" : "flex justify-end"}
        >
          {m.from === "tool" ? (
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 px-3 py-2 font-mono text-[11px] text-emerald-800">
              <Terminal size={13} />
              {m.text}
            </div>
          ) : (
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.from === "user"
                  ? "rounded-tl-sm bg-stone-100 text-stone-700"
                  : "rounded-tr-sm bg-emerald-900 text-emerald-50"
              }`}
            >
              {m.text}
            </div>
          )}
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.1, duration: 0.5 }}
      className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-orange-700">
            Butuh approval
          </p>
          <p className="mt-1 font-display text-sm font-semibold text-stone-900">
            Draft order #1042 · Rp 78.000
          </p>
        </div>
        <button
          type="button"
          data-testid="mock-approve-btn"
          onClick={() => {}}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-orange-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-700 active:scale-95"
        >
          <CheckCircle2 size={14} /> Setujui
        </button>
      </div>
    </motion.div>
  </div>
);
