import { motion } from "framer-motion";
import { AlertTriangle, Check, Circle, Clock, XCircle, MinusCircle } from "lucide-react";
import { DEMO } from "@/constants/testIds";
import { STAGE_NAMES, IDLE_TRACE } from "@/lib/mockAgent";

const STATUS_META = {
  ok: { icon: Check, bg: "bg-emerald-800", ring: "ring-emerald-200", label: "OK" },
  wait: { icon: Clock, bg: "bg-orange-500", ring: "ring-orange-200", label: "MENUNGGU" },
  skip: { icon: MinusCircle, bg: "bg-stone-400", ring: "ring-stone-200", label: "BYPASS" },
  warn: { icon: AlertTriangle, bg: "bg-amber-500", ring: "ring-amber-200", label: "WARN" },
  err: { icon: XCircle, bg: "bg-red-500", ring: "ring-red-200", label: "ERROR" },
  idle: { icon: Circle, bg: "bg-stone-200", ring: "ring-transparent", label: "IDLE" },
};

const emptyTrace = IDLE_TRACE;

export const PipelinePanel = ({ trace = emptyTrace, running }) => {
  const totalMs = trace.reduce((s, t) => s + (t.ms || 0), 0);

  return (
    <aside className="rounded-3xl border border-stone-200 bg-white p-6 lg:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
            Observable pipeline
          </p>
          <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-stone-900">
            7 tahap workflow
          </h3>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-stone-900">
            {running ? "…" : `${(totalMs / 1000).toFixed(2)}s`}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-stone-400">total durasi</p>
        </div>
      </div>

      <ol className="mt-6 space-y-2.5">
        {STAGE_NAMES.map((name, i) => {
          const step = trace[i] || { status: "idle", detail: "—", ms: 0 };
          const meta = STATUS_META[step.status] || STATUS_META.idle;
          const Icon = meta.icon;
          const active = step.status !== "idle";
          return (
            <motion.li
              key={name}
              layout
              data-testid={DEMO.pipelineStage(name)}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 transition-colors ${
                active ? "border-stone-200 bg-stone-50" : "border-dashed border-stone-200 bg-white"
              }`}
            >
              <span
                className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl text-white ring-4 ${meta.bg} ${meta.ring}`}
              >
                <Icon size={15} strokeWidth={2.5} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-display text-sm font-bold text-stone-900">
                    {i + 1}. {name}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active ? "bg-white text-stone-700 ring-1 ring-stone-200" : "text-stone-400"
                    }`}
                  >
                    {meta.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-600">{step.detail}</p>
                {step.ms > 0 && (
                  <p className="mt-1 font-mono text-[10px] text-stone-400">{step.ms}ms</p>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500">Kenapa 7 tahap?</p>
        <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
          Setiap chat lewat pipeline deterministik supaya kamu bisa audit: dari deteksi intent, tarik
          data katalog live, sampai gate approval sebelum aksi nyata dieksekusi.
        </p>
      </div>
    </aside>
  );
};
