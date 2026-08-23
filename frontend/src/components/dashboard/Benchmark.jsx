import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, PlayCircle, Sparkles, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BENCHMARK } from "@/constants/testIds";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmtPct = (n) => `${Number(n || 0).toFixed(1)}%`;
const fmtMs = (n) => (n >= 1000 ? `${(n / 1000).toFixed(2)} dtk` : `${Math.round(n)} ms`);

const METRICS = [
  { key: "extraction_accuracy_pct", label: "Akurasi ekstraksi", hint: "Intent + SKU + qty benar", fmt: fmtPct, higher: true },
  { key: "completion_rate_pct", label: "Completion rate", hint: "Sampai tahap Response", fmt: fmtPct, higher: true },
  { key: "avg_process_ms", label: "Waktu proses", hint: "Rata-rata per chat", fmt: fmtMs, higher: false },
  { key: "intervention_rate_pct", label: "Intervention rate", hint: "Butuh owner turun tangan", fmt: fmtPct, higher: false },
  { key: "duplicate_prevention_pct", label: "Duplicate prevention", hint: "Dedup pesan berulang", fmt: fmtPct, higher: true },
  { key: "grounding_rate_pct", label: "Grounding rate", hint: "Jawaban punya rujukan", fmt: fmtPct, higher: true },
];

const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid #E7E5E4",
  fontSize: 12,
  fontFamily: "Plus Jakarta Sans, sans-serif",
};

const delta = (baseline, agent, higherIsBetter) => {
  const diff = agent - baseline;
  const better = higherIsBetter ? diff > 0 : diff < 0;
  return { diff, better };
};

const chartRow = (m, baseline, agent) => {
  // Untuk waktu proses, ubah ke detik biar bar bisa dibaca
  if (m.key === "avg_process_ms") {
    return { name: m.label, baseline: +(baseline / 1000).toFixed(2), agent: +(agent / 1000).toFixed(2) };
  }
  return { name: m.label, baseline: +baseline.toFixed(1), agent: +agent.toFixed(1) };
};

export const Benchmark = () => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [lastRuns, setLastRuns] = useState([]);
  const [error, setError] = useState(null);

  const loadLast = async () => {
    try {
      const res = await axios.get(`${API}/agent/benchmark/last?limit=5`);
      setLastRuns(res.data?.runs || []);
      if (!result && res.data?.runs?.length > 0) setResult(res.data.runs[0]);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    loadLast();
  }, []);

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await axios.post(`${API}/agent/benchmark/run`);
      setResult(res.data);
      await loadLast();
    } catch (e) {
      setError(e?.response?.data?.detail || "Gagal menjalankan benchmark. Coba lagi.");
    } finally {
      setRunning(false);
    }
  };

  const baseline = result?.baseline_manual;
  const agent = result?.agent;
  const chartData = baseline && agent
    ? METRICS.map((m) => chartRow(m, baseline[m.key], agent[m.key]))
    : [];

  return (
    <div className="space-y-6" data-testid={BENCHMARK.page}>
      {/* Header + Run */}
      <div
        className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900"
        data-testid={BENCHMARK.headerCard}
      >
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            <Sparkles size={13} /> Impact benchmark
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
            Manual vs Agent — sebelum & sesudah TuntasUMKM
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
            Replay 32 percakapan uji sintetis melewati pipeline 7-stage. Hasilnya dibandingkan
            dengan baseline UMKM manual (riset lapangan). Ini bukti dampak terukur, bukan cerita.
          </p>
        </div>
        <button
          onClick={run}
          disabled={running}
          data-testid={BENCHMARK.runButton}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Menjalankan…
            </>
          ) : (
            <>
              <PlayCircle size={16} /> Jalankan benchmark
            </>
          )}
        </button>
      </div>

      {error && (
        <div
          className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
          data-testid={BENCHMARK.errorBox}
        >
          {error}
        </div>
      )}

      {!result && !running && (
        <div
          className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center dark:border-stone-700 dark:bg-stone-900"
          data-testid={BENCHMARK.emptyState}
        >
          <TrendingUp className="mx-auto mb-3 text-stone-400" size={28} />
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Belum ada benchmark yang dijalankan. Klik <b>Jalankan benchmark</b> di atas untuk mulai.
          </p>
        </div>
      )}

      {running && !result && (
        <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
          <Loader2 className="mx-auto mb-3 animate-spin text-emerald-800" size={28} />
          <p className="text-sm text-stone-500">Menjalankan 32 percakapan uji…</p>
        </div>
      )}

      {result && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3" data-testid={BENCHMARK.kpiGrid}>
            {METRICS.map((m) => {
              const b = baseline?.[m.key] ?? 0;
              const a = agent?.[m.key] ?? 0;
              const d = delta(b, a, m.higher);
              return (
                <div
                  key={m.key}
                  data-testid={`${BENCHMARK.kpiCard}-${m.key}`}
                  className="rounded-3xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">
                    {m.label}
                  </p>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <p className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
                        {m.fmt(a)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-stone-500">
                        Manual: <span className="font-mono">{m.fmt(b)}</span>
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        d.better
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
                      }`}
                    >
                      {m.key === "avg_process_ms"
                        ? `${d.better ? "-" : "+"}${Math.abs((d.diff / 1000)).toFixed(1)}s`
                        : `${d.diff > 0 ? "+" : ""}${d.diff.toFixed(1)}pt`}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">{m.hint}</p>
                </div>
              );
            })}
          </div>

          {/* Chart before/after */}
          <div
            className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
            data-testid={BENCHMARK.chart}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Before / After</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Perbandingan metrik manual vs agent
                </h3>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Waktu proses dalam detik. Metrik lain dalam persen.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                {result.total_cases} kasus · {result.mode}
              </span>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -8, right: 16, top: 8, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="#78716C"
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#78716C" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="baseline" name="Manual (baseline)" fill="#A8A29E" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="#A8A29E" />
                    ))}
                  </Bar>
                  <Bar dataKey="agent" name="TuntasUMKM Agent" fill="#065F46" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="#065F46" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-case detail */}
          <div
            className="overflow-hidden rounded-3xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
            data-testid={BENCHMARK.caseTable}
          >
            <div className="border-b border-stone-200 px-6 py-4 dark:border-stone-800">
              <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
                Rincian per kasus ({result.total_cases})
              </h3>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                Transparan — juga menampilkan kegagalan agent, sesuai anjuran juri hackathon.
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-stone-50 text-left text-xs font-bold uppercase tracking-widest text-stone-500 dark:bg-stone-800/70">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Pesan pelanggan</th>
                    <th className="px-6 py-3">Expected</th>
                    <th className="px-6 py-3">Agent</th>
                    <th className="px-6 py-3">Waktu</th>
                    <th className="px-6 py-3">Hasil</th>
                  </tr>
                </thead>
                <tbody>
                  {(result.cases || []).map((c) => (
                    <tr
                      key={c.id}
                      data-testid={`${BENCHMARK.caseRow}-${c.id}`}
                      className="border-t border-stone-100 dark:border-stone-800"
                    >
                      <td className="px-6 py-3 font-mono text-xs text-stone-500">{c.id}</td>
                      <td className="px-6 py-3 text-stone-700 dark:text-stone-300">{c.message}</td>
                      <td className="px-6 py-3 font-mono text-xs text-stone-500">
                        {c.expected.intent}
                        {c.expected.sku ? ` / ${c.expected.sku}` : ""}
                        {c.expected.qty ? ` × ${c.expected.qty}` : ""}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-stone-700 dark:text-stone-300">
                        {c.agent.intent || "—"}
                        {c.agent.sku ? ` / ${c.agent.sku}` : ""}
                        {c.agent.qty ? ` × ${c.agent.qty}` : ""}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-stone-500">{fmtMs(c.elapsed_ms)}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            c.pass
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
                          }`}
                        >
                          {c.pass ? "PASS" : "MISS"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {lastRuns.length > 1 && (
        <div
          className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
          data-testid={BENCHMARK.history}
        >
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-stone-500">
            Riwayat run terakhir
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {lastRuns.slice(0, 5).map((r) => (
              <li
                key={r.run_id}
                className="flex items-center justify-between rounded-xl border border-stone-100 px-4 py-2 dark:border-stone-800"
              >
                <span className="font-mono text-xs text-stone-500">{r.run_id.slice(0, 8)}</span>
                <span className="text-stone-600 dark:text-stone-300">
                  {r.agent.extraction_accuracy_pct.toFixed(1)}% ekstraksi ·{" "}
                  {fmtMs(r.agent.avg_process_ms)}
                </span>
                <span className="text-xs text-stone-400">{new Date(r.created_at).toLocaleString("id-ID")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
