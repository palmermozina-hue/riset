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

const BAR_COLORS = ["#064E3B", "#EA580C", "#047857", "#F97316", "#A8A29E"];

const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid #E7E5E4",
  fontSize: 12,
  fontFamily: "Plus Jakarta Sans, sans-serif",
};

export const Analytics = () => (
  <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
    <div className="rounded-3xl border border-stone-200 bg-white p-7 xl:col-span-7" data-testid={DASHBOARD.chartDaily}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">7 hari terakhir</p>
      <h3 className="mt-2 font-display text-xl font-semibold text-stone-900">
        Chat masuk vs pesanan jadi
      </h3>
      <div className="mt-7 h-72 min-h-[288px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DAILY_SERIES} margin={{ left: -18, right: 8, top: 8 }}>
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
            <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#78716C" />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="chat" stroke="#064E3B" strokeWidth={2.5} fill="url(#gChat)" name="Chat" />
            <Area type="monotone" dataKey="order" stroke="#EA580C" strokeWidth={2.5} fill="url(#gOrder)" name="Pesanan" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-6 text-sm">
        <span className="inline-flex items-center gap-2 text-stone-600">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-900" /> Chat masuk
        </span>
        <span className="inline-flex items-center gap-2 text-stone-600">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-600" /> Pesanan jadi
        </span>
      </div>
    </div>

    <div className="flex flex-col gap-5 xl:col-span-5">
      <div className="rounded-3xl border border-stone-200 bg-white p-7" data-testid={DASHBOARD.chartIntent}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Intent teratas</p>
        <h3 className="mt-2 font-display text-xl font-semibold text-stone-900">
          Yang paling sering ditanya
        </h3>
        <div className="mt-6 h-60 min-h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INTENT_SERIES} layout="vertical" margin={{ left: 24, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} stroke="#78716C" />
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
                {INTENT_SERIES.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {[
          { label: "Waktu respons rata-rata", value: "1.9 detik" },
          { label: "Akurasi grounding", value: "94.2%" },
          { label: "Approval < 5 menit", value: "78%" },
          { label: "Order gagal (stok)", value: "1.4%" },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl border border-stone-200 bg-white p-6">
            <p className="font-display text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
