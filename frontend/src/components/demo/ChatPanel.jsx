import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Store } from "lucide-react";
import { DEMO } from "@/constants/testIds";

const QUICK = [
  { key: "stok", label: "Cek stok kopi susu", text: "kak kopi susu gula aren masih ready?" },
  { key: "harga", label: "Tanya harga americano", text: "americano botol harganya berapa?" },
  { key: "pesan", label: "Pesan 3 croissant", text: "mau pesan 3 croissant butter dong" },
  { key: "keluhan", label: "Komplain pesanan", text: "pesanan kemarin kurang 1 botol kak :(" },
];

export const ChatPanel = ({ messages, onSend, input, setInput, thinking }) => {
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const submit = (e) => {
    e.preventDefault();
    if (!input.trim() || thinking) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex h-full min-h-[560px] flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white">
      {/* Header — mimic phone chat */}
      <div className="flex items-center gap-3 border-b border-stone-100 bg-stone-50 px-6 py-4">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-900 text-white">
          <Store size={19} strokeWidth={2.5} />
        </span>
        <div>
          <p className="font-display text-sm font-bold text-stone-900">Warung Kopi Senja</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Agent aktif · biasanya balas &lt; 5 detik
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-stone-50/60 px-6 py-6">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              data-testid={DEMO.message(i)}
              className={`flex ${m.from === "customer" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  m.from === "customer"
                    ? "rounded-br-md bg-emerald-900 text-white"
                    : "rounded-bl-md bg-white text-stone-800 ring-1 ring-stone-200"
                }`}
              >
                {m.text}
                <p
                  className={`mt-1 text-[10px] ${
                    m.from === "customer" ? "text-emerald-200/80" : "text-stone-400"
                  }`}
                >
                  {m.at}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {thinking && (
          <div className="flex justify-start" data-testid="demo-thinking">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm ring-1 ring-stone-200">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-stone-400"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.15 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div className="flex flex-wrap gap-2 border-t border-stone-100 px-6 py-3">
        {QUICK.map((q) => (
          <button
            key={q.key}
            type="button"
            onClick={() => !thinking && onSend(q.text)}
            data-testid={DEMO.quickReply(q.key)}
            disabled={thinking}
            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-emerald-800 hover:text-emerald-900 disabled:opacity-50"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-stone-100 bg-white px-4 py-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={thinking}
          placeholder="Tulis pesan kayak pelanggan asli…"
          data-testid={DEMO.chatInput}
          className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:border-emerald-700 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/25"
        />
        <button
          type="submit"
          disabled={thinking || !input.trim()}
          data-testid={DEMO.sendButton}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-600 text-white transition-colors hover:bg-orange-700 active:scale-95 disabled:opacity-50"
          aria-label="Kirim pesan"
        >
          <Send size={17} strokeWidth={2.3} />
        </button>
      </form>
    </div>
  );
};
