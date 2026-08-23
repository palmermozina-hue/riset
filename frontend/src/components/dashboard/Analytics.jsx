import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DAILY_SERIES, INTENT_SERIES } from "@/data/mockDashboard";
import { DASHBOARD } from "@/constants/testIds";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BAR_COLORS = ["#064E3B", "#EA580C", "#047857", "#F97316", "#A8A29E"];

const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid #E7E5E4",
  fontSize: 12,
  fontFamily: "Plus Jakarta Sans, sans-serif",
};

const fmtMs = (n) => (n >= 1000 ? `${(n / 1000).toFixed(2)} detik` : `${Math.round(n)} ms`);
const fmtPct = (n) => `${n.toFixed(1)}%`;

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    setRefreshing(true);
    try {
      const res = await axios.get(`${API}/agent/analytics/summary?days=7`);
      setData(res.data);
    } catch (e) {
      // fallback ke seed kalau backend belum siap
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(() => load(true), 15000); // auto-refresh 15s
    return () => clearInterval(t);
  }, []);

  const hasLiveData = data && data.totals && data.totals.traces > 0;
  const dailyData = hasLiveData ? data.daily_series : DAILY_SERIES;
  const intentData =
    hasLiveData && data.intent_series.length > 0 ? data.intent_series : INTENT_SERIES;

  const stats = hasLiveData
    ? [
        {
          label: "Waktu respons rata-rata",
          value: fmtMs(data.stats.avg_response_ms),
          hint: `LLM ${fmtMs(data.stats.avg_llm_ms)}`,
        },
        {
          label: "Akurasi grounding",
          value: fmtPct(data.stats.grounding_accuracy_pct),
          hint: `${data.totals.traces} percakapan`,
        },
        {
          label: "Approval < 5 menit",
          value: fmtPct(data.stats.fast_approval_pct),
          hint: `${data.totals.approvals_decided} keputusan`,
        },
        {
          label: "Order gagal (stok)",
          value: fmtPct(data.stats.out_of_stock_rate_pct),
          hint: `${data.totals.order_attempts} order dicoba`,
        },
      ]
    : [
        { label: "Waktu respons rata-rata", value: "1.9 detik", hint: "data seed" },
        { label: "Akurasi grounding", value: "94.2%", hint: "data seed" },
        { label: "Approval < 5 menit", value: "78%", hint: "data seed" },
        { label: "Order gagal (stok)", value: "1.4%", hint: "data seed" },
      ];

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12" data-testid="analytics-panel">
      <div
        className="rounded-3xl border border-stone-200 bg-white p-7 dark:border-stone-800 dark:bg-stone-900 xl:col-span-7"
        data-testid={DASHBOARD.chartDaily}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              7 hari terakhir
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
              Chat masuk vs pesanan jadi
            </h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              {hasLiveData ? (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" /> Live
                  </span>{" "}
                  Dari {data.totals.traces} trace + {data.totals.approvals} approval.
                </>
              ) : (
                "Data seed (belum ada percakapan tercatat)."
              )}
            </p>
          </div>
          <button
            onClick={() => load()}
            disabled={refreshing}
            data-testid="analytics-refresh"
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:border-emerald-800 hover:text-emerald-900 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          >
            {refreshing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RefreshCcw size={12} />
            )}
            Refresh
          </button>
        </div>
        <div className="mt-6 h-72 min-h-[288px] w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">
              <Loader2 size={16} className="mr-2 animate-spin" /> Memuat data hidup...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gChat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#064E3B" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#064E3B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOrder" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="#78716C" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#78716C" allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="chat"
                  stroke="#064E3B"
                  strokeWidth={2.5}
                  fill="url(#gChat)"
                  name="Chat"
                />
                <Area
                  type="monotone"
                  dataKey="order"
                  stroke="#EA580C"
                  strokeWidth={2.5}
                  fill="url(#gOrder)"
                  name="Pesanan"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 flex gap-6 text-sm">
          <span className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-900" /> Chat masuk
          </span>
          <span className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-600" /> Pesanan disetujui
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 xl:col-span-5">
        <div
          className="rounded-3xl border border-stone-200 bg-white p-7 dark:border-stone-800 dark:bg-stone-900"
          data-testid={DASHBOARD.chartIntent}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Intent teratas</p>
          <h3 className="mt-2 font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
            Yang paling sering ditanya
          </h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            {hasLiveData
              ? `Dihitung dari ${data.totals.traces} trace.`
              : "Data seed."}
          </p>
          <div className="mt-6 h-60 min-h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intentData} layout="vertical" margin={{ left: 24, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="#78716C"
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="intent"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  width={92}
                  stroke="#57534E"
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={18}>
                  {intentData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {stats.map((s) => (
            <div
              key={s.label}
              data-testid={`analytics-stat-${s.label.replace(/\s+/g, "-").toLowerCase()}`}
              className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
            >
              <p className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
                {s.value}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                {s.label}
              </p>
              {s.hint && (
                <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500">
                  {s.hint}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
