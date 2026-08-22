import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { ChatMockup } from "@/components/landing/ChatMockup";

const fade = (d) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] },
});

export const Hero = () => (
  <section id="top" className="relative overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-40">
    <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-emerald-200/40 blur-3xl" />
    <div className="pointer-events-none absolute inset-0 dotted-grid opacity-40" />
    <img
      src="https://images.pexels.com/photos/29355930/pexels-photo-29355930.jpeg"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-10 hidden h-[600px] w-[45%] object-cover opacity-10 lg:block"
    />

    <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
      <div className="lg:col-span-5">
        <motion.div {...fade(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-emerald-800">
            <Sparkles size={13} className="text-orange-600" />
            AI Hackfest 2026 · Operational Agent
          </span>
        </motion.div>

        <motion.h1
          {...fade(0.1)}
          className="mt-7 font-display text-5xl font-bold leading-[1.02] tracking-tighter text-stone-900 sm:text-6xl lg:text-[4.2rem]"
        >
          Agen AI yang nggak cuma{" "}
          <span className="text-stone-400 line-through decoration-orange-500/60 decoration-4">
            jawab
          </span>
          , tapi{" "}
          <span className="relative inline-block text-emerald-900">
            bertindak
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="10"
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
            >
              <path
                d="M2 7 C 50 1, 150 1, 198 6"
                stroke="#EA580C"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p {...fade(0.2)} className="mt-8 max-w-lg text-base leading-relaxed text-stone-600 sm:text-lg">
          TuntasUMKM balesin chat pembeli, cek stok, dan susun draft order buat toko
          kamu — otomatis. Aksi pentingnya tetap nunggu kamu klik setuju.
        </motion.p>

        <motion.div {...fade(0.3)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#demo"
            data-testid="hero-cta-primary"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:scale-95"
          >
            Coba Demo
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#cara-kerja"
            data-testid="hero-cta-secondary"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-stone-200 bg-white px-7 py-4 text-sm font-semibold text-stone-900 transition-colors hover:border-emerald-900 active:scale-95"
          >
            <PlayCircle size={16} /> Lihat cara kerja
          </a>
        </motion.div>

        <motion.div {...fade(0.45)} className="mt-14 flex flex-wrap gap-x-10 gap-y-6 border-t border-stone-200 pt-8">
          {[
            ["< 5 detik", "rata-rata balasan"],
            ["7 tahap", "pipeline agent"],
            ["100%", "aksi berisiko diapprove"],
          ].map(([a, b]) => (
            <div key={b}>
              <p className="font-display text-2xl font-bold text-emerald-900">{a}</p>
              <p className="mt-0.5 text-xs text-stone-500">{b}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -1.5 }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 lg:pl-10"
      >
        <div className="mx-auto max-w-xl">
          <ChatMockup />
        </div>
      </motion.div>
    </div>
  </section>
);
