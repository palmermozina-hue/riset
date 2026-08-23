import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { AUTOMATION, METRICS, PRODUCTS } from "@/data/mockDashboard";
import { DASHBOARD } from "@/constants/testIds";

const toneMap = {
  emerald: "bg-emerald-800",
  orange: "bg-orange-600",
  stone: "bg-stone-400",
};

export const Overview = ({ pendingCount, onGoApproval }) => {
  const lowStock = PRODUCTS.filter((p) => p.stock <= 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((m) => {
          const Icon = Icons[m.icon] || Icons.Activity;
          return (
            <div
              key={m.id}
              data-testid={DASHBOARD.metricCard(m.id)}
              className="rounded-3xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-900">
                  <Icon size={19} strokeWidth={2} />
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    m.trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {m.delta}
                </span>
              </div>
              <p className="mt-6 font-display text-3xl font-bold tracking-tight text-stone-900">
                {m.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-700">{m.label}</p>
              <p className="mt-2 text-xs text-stone-500">{m.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 lg:col-span-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Beban kerja agent
          </p>
          <h3 className="mt-3 font-display text-xl font-semibold text-stone-800">
            Dari 142 chat hari ini, cuma 20 yang perlu kamu sentuh
          </h3>
          <div className="mt-7 space-y-5">
            {AUTOMATION.map((a) => (
              <div key={a.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-700">{a.label}</span>
                  <span className="font-bold text-stone-900">{a.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full rounded-full ${toneMap[a.tone]}`}
                    style={{ width: `${a.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-5">
          <div className="rounded-3xl bg-emerald-950 p-8 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Butuh keputusan kamu
            </p>
            <p className="mt-4 font-display text-5xl font-bold tracking-tight">{pendingCount}</p>
            <p className="mt-2 text-sm text-emerald-100/80">
              aksi berisiko ditahan di approval gate sampai kamu setujui.
            </p>
            <button
              onClick={onGoApproval}
              data-testid="overview-go-approval"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:scale-95"
            >
              Buka approval queue <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Stok mulai kritis
            </p>
            <ul className="mt-4 space-y-3">
              {lowStock.map((p) => (
                <li key={p.sku} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-700">{p.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      p.stock === 0 ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    {p.stock === 0 ? "habis" : `${p.stock} pcs`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
