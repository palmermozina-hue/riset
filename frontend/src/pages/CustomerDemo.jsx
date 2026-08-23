import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ChatPanel } from "@/components/demo/ChatPanel";
import { PipelinePanel } from "@/components/demo/PipelinePanel";
import { DEMO } from "@/constants/testIds";
import { runAgent, STAGE_NAMES } from "@/lib/mockAgent";
import { addApproval } from "@/lib/mockStore";

const initialMessages = [
  {
    from: "agent",
    text: "Hai kak 👋 aku agent Warung Kopi Senja. Coba tanyain stok kopi, harga, atau langsung pesan — semua diproses lewat 7-stage pipeline di kanan ya.",
    at: "sekarang",
  },
];

const IDLE_TRACE = STAGE_NAMES.map(() => ({ status: "idle", detail: "—", ms: 0 }));

export default function CustomerDemo() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [trace, setTrace] = useState(IDLE_TRACE);
  const sessionId = useRef(`#${Math.floor(4800 + Math.random() * 400)}`).current;

  const stats = useMemo(() => {
    const cust = messages.filter((m) => m.from === "customer").length;
    const bot = messages.filter((m) => m.from === "agent").length - 1; // minus initial greeting
    return { cust, bot: Math.max(0, bot) };
  }, [messages]);

  const now = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleSend = (text) => {
    const userMsg = { from: "customer", text, at: now() };
    setMessages((m) => [...m, userMsg]);
    setThinking(true);
    setTrace(IDLE_TRACE);

    const result = runAgent(text, sessionId);

    // Animasi progresif per-stage untuk kesan pipeline "hidup"
    result.trace.forEach((step, idx) => {
      setTimeout(() => {
        setTrace((prev) => {
          const next = [...prev];
          next[idx] = step;
          return next;
        });
      }, 220 * (idx + 1));
    });

    setTimeout(() => {
      setMessages((m) => [...m, { from: "agent", text: result.reply, at: now() }]);
      setThinking(false);
      if (result.approval) {
        addApproval(result.approval);
        toast.success(
          `Approval ${result.approval.id} dikirim ke dashboard owner`,
          { description: "Buka /dashboard buat setujui pesanannya." }
        );
      }
    }, 220 * (STAGE_NAMES.length + 1));
  };

  const reset = () => {
    setMessages(initialMessages);
    setTrace(IDLE_TRACE);
    setInput("");
    toast.info("Chat direset. Coba percakapan baru!");
  };

  return (
    <div className="min-h-screen bg-stone-50" data-testid={DEMO.page}>
      {/* Header slim */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3.5 lg:px-10">
          <Link
            to="/"
            data-testid={DEMO.backHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 transition-colors hover:text-emerald-900"
          >
            <ArrowLeft size={16} /> Balik ke beranda
          </Link>
          <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-800 md:inline-flex">
            <Sparkles size={12} /> Live demo · mock agent
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              data-testid={DEMO.resetButton}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition-colors hover:border-emerald-800 hover:text-emerald-900 active:scale-95"
            >
              <RotateCcw size={13} /> Reset
            </button>
            <Link
              to="/dashboard"
              data-testid={DEMO.openDashboard}
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-700 active:scale-95"
            >
              Dashboard owner <ExternalLink size={12} />
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
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Coba jadi pelanggan
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Chat pelanggan di kiri, pipeline agent di kanan.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600">
            Setiap pesan yang kamu kirim langsung diproses via 7 tahap deterministik: intake → understanding → grounding → tool call → approval → response → analytics. Pesanan bakal muncul di{" "}
            <Link to="/dashboard" className="font-semibold text-emerald-800 underline decoration-orange-500 decoration-2 underline-offset-4 hover:text-orange-600">
              dashboard owner
            </Link>{" "}
            buat kamu setujui.
          </p>

          <div className="mt-8 flex flex-wrap gap-8 border-t border-stone-200 pt-6">
            <Stat label="Pesan kamu" value={stats.cust} />
            <Stat label="Balasan agent" value={stats.bot} />
            <Stat label="Session id" value={sessionId} mono />
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
    <p className={`font-display text-2xl font-bold text-stone-900 ${mono ? "font-mono text-xl" : ""}`}>
      {value}
    </p>
    <p className="mt-0.5 text-xs uppercase tracking-widest text-stone-500">{label}</p>
  </div>
);
