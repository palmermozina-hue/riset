import { useState } from "react";
import { Check, ChevronDown, CircleDashed, Clock, Loader2, MinusCircle } from "lucide-react";
import { DASHBOARD } from "@/constants/testIds";

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

const statusLabel = {
  ok: "Selesai",
  wait: "Menunggu",
  skip: "Dilewati",
  idle: "Belum jalan",
};

const STAGE_NOTE = {
  Intake: "Pesan masuk dinormalisasi, dicek duplikat, lalu dikaitkan ke session pelanggan.",
  Understanding: "LLM stealth/ox-alpha mengklasifikasi intent, SKU, dan jumlah, plus skor keyakinan.",
  Grounding: "Jawaban dikunci ke katalog & stok asli lewat pencarian hybrid — bukan karangan model.",
  "Tool Call": "Fungsi deterministik dijalankan: cek_stok, buat_draft_pesanan, kirim_notifikasi.",
  Approval: "Aksi berisiko ditahan di sini sampai owner memutuskan setuju atau tolak.",
  Response: "Balasan final disusun dengan gaya bahasa toko lalu dikirim ke kanal pelanggan.",
  Analytics: "Event workflow dicatat buat tren intent, konversi, dan performa agent.",
};

/**
 * Panel jejak 7-tahap yang bisa diklik. Tiap tahap membuka detail: apa yang
 * terjadi, status, dan latensi — supaya alur agent bisa diaudit, bukan kotak hitam.
 */
export const TraceViewer = ({ trace, title = "Jejak workflow", subtitle }) => {
  const [open, setOpen] = useState(0);
  const totalMs = trace.reduce((s, t) => s + (t.ms || 0), 0);

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6" data-testid="trace-viewer">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">{title}</p>
          <p className="mt-2 text-xs text-stone-500">
            {subtitle || "Klik tiap tahap buat lihat detailnya."}
          </p>
        </div>
        {totalMs > 0 && (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[11px] font-bold text-stone-600"
            data-testid="trace-total-latency"
          >
            <Clock size={11} /> {totalMs}ms
          </span>
        )}
      </div>

      <ol className="mt-6 space-y-1.5">
        {trace.map((t, i) => {
          const expanded = open === i;
          return (
            <li key={`${t.stage}-${i}`} data-testid={DASHBOARD.traceStage(i)}>
              <button
                onClick={() => setOpen(expanded ? -1 : i)}
                aria-expanded={expanded}
                data-testid={`trace-stage-toggle-${i}`}
                className={`flex w-full items-start gap-3 rounded-2xl p-2.5 text-left transition-colors duration-200 ${
                  expanded ? "bg-emerald-50" : "hover:bg-stone-50"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${traceColor[t.status]}`}
                >
                  {traceIcon[t.status]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-800">
                      {i + 1}. {t.stage}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`ml-auto shrink-0 text-stone-400 transition-transform duration-200 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-stone-500">{t.detail}</span>
                </span>
              </button>

              <div
                data-testid={`trace-stage-detail-${i}`}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="ml-9 mr-1 mt-1 space-y-2.5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs leading-relaxed text-stone-600">
                      {STAGE_NOTE[t.stage] || "Tahap pipeline."}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-stone-600 ring-1 ring-stone-200">
                        Status: {statusLabel[t.status] || t.status}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-stone-600 ring-1 ring-stone-200">
                        {t.ms ? `${t.ms}ms` : "—"}
                      </span>
                    </div>
                    <pre className="overflow-x-auto rounded-xl bg-stone-900 p-3 font-mono text-[11px] leading-relaxed text-emerald-200">
{JSON.stringify({ stage: t.stage, status: t.status, detail: t.detail, ms: t.ms || 0 }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
