import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ChatPanel } from "@/components/demo/ChatPanel";
import { PipelinePanel } from "@/components/demo/PipelinePanel";
import { DEMO } from "@/constants/testIds";
import { runAgent, STAGE_NAMES, IDLE_TRACE } from "@/lib/mockAgent";
import {
  addApproval,
  clearOwnerEvents,
  consumeOwnerEvents,
  getConversation,
  saveConversation,
  saveLiveSession,
  subscribeStore,
} from "@/lib/mockStore";
import { useT } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

const initialMessages = [
  {
    from: "agent",
    text: "Hai kak 👋 aku agent Warung Kopi Senja. Coba tanyain stok kopi, harga, atau langsung pesan — semua diproses lewat 7-stage pipeline di kanan ya.",
    at: "sekarang",
  },
];

const clock = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

/** Balasan agent setelah owner memutuskan approval di /dashboard. */
const ownerEventToMessage = (evt) => {
  if (evt.decision === "approve") {
    return {
      from: "agent",
      text: `Kabar baik kak! Pesanan ${evt.id} udah disetujui owner ✅ ${
        evt.total ? `Totalnya Rp ${Number(evt.total).toLocaleString("id-ID")}. ` : ""
      }Aku lanjut siapin pesanannya sekarang, nanti aku kabarin lagi pas siap kirim ya 🙌`,
      at: clock(),
      system: true,
    };
  }
  return {
    from: "agent",
    text: `Mohon maaf kak 🙏 pesanan ${evt.id} belum bisa kami proses kali ini${
      evt.reason ? ` (${evt.reason})` : ""
    }. Kalau mau, aku bantu carikan produk lain yang stoknya siap kirim hari ini?`,
    at: clock(),
    system: true,
  };
};

export default function CustomerDemo() {
  const t = useT();
  const [messages, setMessages] = useState(() => {
    const saved = getConversation();
    return saved && saved.length ? saved : initialMessages;
  });
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [trace, setTrace] = useState(IDLE_TRACE);
  const [intent, setIntent] = useState("belum_ada");
  const sessionId = useRef(`#${Math.floor(4800 + Math.random() * 400)}`).current;

  const stats = useMemo(() => {
    const cust = messages.filter((m) => m.from === "customer").length;
    const bot = messages.filter((m) => m.from === "agent").length - 1; // minus greeting
    return { cust, bot: Math.max(0, bot) };
  }, [messages]);

  // Persist chat + kirim sesi berjalan ke Inbox dashboard (Trace Viewer).
  useEffect(() => {
    saveConversation(messages);
    saveLiveSession({
      id: "live",
      customer: "Sesi demo kamu",
      channel: "Web Demo",
      lastAt: messages[messages.length - 1]?.at || clock(),
      unread: 0,
      status: trace.some((t) => t.status === "wait") ? "menunggu approval" : "selesai otomatis",
      intent,
      messages,
      trace,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, trace, intent]);

  // Owner reply loop: keputusan owner di /dashboard masuk balik ke chat ini.
  const drainOwnerEvents = useCallback(() => {
    const pending = consumeOwnerEvents();
    if (!pending.length) return;
    setMessages((m) => [...m, ...pending.map(ownerEventToMessage)]);
    pending.forEach((evt) => {
      if (evt.decision === "approve") {
        toast.success(`Owner menyetujui ${evt.id}`, {
          description: "Konfirmasinya langsung dikirim ke pelanggan.",
        });
      } else {
        toast.info(`Owner menolak ${evt.id}`, {
          description: "Agent kirim penjelasan sopan ke pelanggan.",
        });
      }
    });
  }, []);

  useEffect(() => {
    drainOwnerEvents();
    return subscribeStore(drainOwnerEvents);
  }, [drainOwnerEvents]);

  const handleSend = async (text) => {
    const userMsg = { from: "customer", text, at: clock() };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setThinking(true);
    setTrace(IDLE_TRACE);

    try {
      const result = await runAgent(text, messages, sessionId);
      setIntent(result.intent || "belum_ada");
      // Animasi progresif per-stage untuk kesan pipeline "hidup"
      result.trace.forEach((step, idx) => {
        setTimeout(() => {
          setTrace((prev) => {
            const next = [...prev];
            next[idx] = step;
            return next;
          });
        }, 200 * (idx + 1));
      });

      setTimeout(() => {
        setMessages((m) => [...m, { from: "agent", text: result.reply, at: clock() }]);
        setThinking(false);
        if (result.approval) {
          addApproval(result.approval);
          toast.success(`Approval ${result.approval.id} dikirim ke dashboard owner`, {
            description: "Buka /dashboard buat setujui — balasannya balik ke chat ini.",
          });
        }
      }, 200 * (STAGE_NAMES.length + 1));
    } catch (err) {
      setThinking(false);
      toast.error("Agent gagal merespons", {
        description: err?.response?.data?.detail || "Coba beberapa saat lagi ya.",
      });
    }
  };

  const reset = () => {
    setMessages(initialMessages);
    saveConversation(initialMessages);
    clearOwnerEvents();
    setTrace(IDLE_TRACE);
    setIntent("belum_ada");
    setInput("");
    toast.info("Chat direset. Coba percakapan baru!");
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950" data-testid={DEMO.page}>
      {/* Header slim */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/80 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3.5 lg:px-10">
          <Link
            to="/"
            data-testid={DEMO.backHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 transition-colors duration-200 hover:text-emerald-900 dark:text-stone-200 dark:hover:text-emerald-300"
          >
            <ArrowLeft size={16} /> {t("demo.back")}
          </Link>
          <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-800 md:inline-flex">
            <Sparkles size={12} /> {t("demo.live")}
          </span>
          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <ThemeToggle inline />
            <button
              onClick={reset}
              data-testid={DEMO.resetButton}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition-colors duration-200 hover:border-emerald-800 hover:text-emerald-900 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            >
              <RotateCcw size={13} /> {t("demo.reset")}
            </button>
            <Link
              to="/dashboard"
              data-testid={DEMO.openDashboard}
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-orange-700 active:scale-95"
            >
              {t("demo.dashboard")} <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero mini */}
      <section className="mx-auto max-w-7xl px-5 pt-10 lg:px-10 lg:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            {t("demo.eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-100">
            {t("demo.h1")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 dark:text-stone-400">
            {t("demo.desc.a")}{" "}
            <Link
              to="/dashboard"
              className="font-semibold text-emerald-800 underline decoration-orange-500 decoration-2 underline-offset-4 transition-colors duration-200 hover:text-orange-600 dark:text-emerald-300"
            >
              {t("demo.desc.link")}
            </Link>{" "}
            {t("demo.desc.b")}
          </p>

          <div className="mt-8 flex flex-wrap gap-8 border-t border-stone-200 pt-6 dark:border-stone-800">
            <Stat label={t("demo.stat.cust")} value={stats.cust} />
            <Stat label={t("demo.stat.bot")} value={stats.bot} />
            <Stat label={t("demo.stat.session")} value={sessionId} mono />
          </div>
        </motion.div>
      </section>

      {/* Split view */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-12 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:py-16">
        <div className="lg:col-span-7">
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            input={input}
            setInput={setInput}
            thinking={thinking}
          />
        </div>
        <div className="lg:col-span-5">
          <PipelinePanel trace={trace} running={thinking} />
        </div>
      </section>
    </div>
  );
}

const Stat = ({ label, value, mono }) => (
  <div>
    <p
      className={`font-display text-2xl font-bold text-stone-900 dark:text-stone-100 ${mono ? "font-mono text-xl" : ""}`}
    >
      {value}
    </p>
    <p className="mt-0.5 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">{label}</p>
  </div>
);
