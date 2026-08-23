import { useCallback, useEffect, useRef, useState } from "react";
import { PlayCircle, StopCircle, RotateCcw, ClipboardList } from "lucide-react";
import { DEMO } from "@/constants/testIds";

export const SCENARIOS = [
  {
    id: "order",
    label: "Order baru",
    hint: "Pelanggan pesan 2 kopi susu gula aren → memicu approval gate.",
    color: "emerald",
    steps: [
      "Halo kak, warungnya masih buka?",
      "Mau pesan 2 kopi susu gula aren 1 liter dong",
      "Yang ready ya, jangan yang habis 🙏",
    ],
  },
  {
    id: "stok",
    label: "Tanya stok",
    hint: "Cek stok cepat — jawab langsung tanpa approval.",
    color: "orange",
    steps: [
      "kak croissant butter ready ga?",
      "harganya berapa?",
      "americano botol 500 masih ada juga?",
    ],
  },
  {
    id: "keluhan",
    label: "Keluhan",
    hint: "Empati + eskalasi ke owner (approval wait).",
    color: "stone",
    steps: [
      "kak kopinya asem banget, kecewa",
      "no order aku KSA-2841",
      "mau refund bisa?",
    ],
  },
];

const AGENT_REPLY_DELAY_MS = 1800; // pipeline animate ~1600ms + buffer

/** Panel kontrol skenario demo. Auto-kirim pesan pelanggan terskrip, satu per satu. */
export const ScenarioPanel = ({ onSend, thinking, onReset }) => {
  const [activeId, setActiveId] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);

  const activeScenario = SCENARIOS.find((s) => s.id === activeId);

  const stop = useCallback(() => {
    stopRef.current = true;
    setRunning(false);
    setActiveId(null);
    setStepIdx(0);
  }, []);

  const play = useCallback(
    async (scenario) => {
      if (running) return;
      stopRef.current = false;
      setActiveId(scenario.id);
      setRunning(true);
      for (let i = 0; i < scenario.steps.length; i += 1) {
        if (stopRef.current) break;
        setStepIdx(i);
        await onSend(scenario.steps[i]);
        await new Promise((r) => setTimeout(r, AGENT_REPLY_DELAY_MS));
      }
      setRunning(false);
      setActiveId(null);
      setStepIdx(0);
    },
    [onSend, running],
  );

  useEffect(() => {
    // Kalau user reset chat di tengah scenario, hentikan.
    if (!thinking && running && stopRef.current) {
      setRunning(false);
    }
  }, [thinking, running]);

  return (
    <div
      className="rounded-3xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
      data-testid={DEMO.scenarioPanel}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            <ClipboardList size={13} /> Skenario demo
          </p>
          <h3 className="mt-1.5 font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
            Auto-play percakapan terskrip
          </h3>
          <p className="mt-1 max-w-lg text-xs text-stone-500 dark:text-stone-400">
            Buat rekaman video 5–10 menit stabil — bebas flakiness LLM live, konsisten setiap take.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {running && (
            <button
              onClick={stop}
              data-testid={DEMO.scenarioStop}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
            >
              <StopCircle size={13} /> Stop
            </button>
          )}
          <button
            onClick={() => {
              stop();
              onReset?.();
            }}
            disabled={running}
            data-testid={DEMO.scenarioReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-emerald-800 hover:text-emerald-900 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          >
            <RotateCcw size={13} /> Reset state
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SCENARIOS.map((s) => {
          const isActive = activeId === s.id;
          const disabled = running && !isActive;
          return (
            <button
              key={s.id}
              onClick={() => play(s)}
              disabled={disabled}
              data-testid={DEMO.scenarioPlay(s.id)}
              className={`group flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all ${
                isActive
                  ? "border-emerald-700 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40"
                  : "border-stone-200 bg-white hover:border-emerald-700 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-emerald-500"
              } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                  {s.label}
                </span>
                <PlayCircle
                  size={18}
                  className={
                    isActive
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                  }
                />
              </div>
              <p className="text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
                {s.hint}
              </p>
              <span className="mt-1 text-[10px] font-mono uppercase tracking-widest text-stone-400">
                {s.steps.length} pesan
              </span>
            </button>
          );
        })}
      </div>

      {activeScenario && (
        <div
          className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/30"
          data-testid={DEMO.scenarioProgress}
        >
          <p className="font-bold text-emerald-800 dark:text-emerald-300">
            ▶ {activeScenario.label} — pesan {stepIdx + 1}/{activeScenario.steps.length}
          </p>
          <p className="mt-1 font-mono text-emerald-900/80 dark:text-emerald-200/80">
            &ldquo;{activeScenario.steps[stepIdx]}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
};
