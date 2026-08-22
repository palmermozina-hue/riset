import { ArrowUpRight, Clock, MessageSquare, ShoppingBag, TrendingUp } from "lucide-react";
import { ChatMockup } from "@/components/landing/ChatMockup";
import { Reveal, SectionLabel } from "@/components/landing/Reveal";

const KPIS = [
  { icon: MessageSquare, label: "Chat hari ini", value: "184", delta: "+12%" },
  { icon: ShoppingBag, label: "Draft order", value: "37", delta: "+8%" },
  { icon: Clock, label: "Rata-rata balas", value: "4,2s", delta: "-31%" },
  { icon: TrendingUp, label: "Closing rate", value: "62%", delta: "+9%" },
];

const BARS = [
  ["Keripik Pedas L3", 92],
  ["Keripik Original", 71],
  ["Sambal Roa", 54],
  ["Paket Hampers", 38],
  ["Kopi Bubuk", 22],
];

const QUEUE = [
  ["#1042", "Diskon 10% — Rina", "Nunggu"],
  ["#1041", "Refund ongkir — Bagas", "Nunggu"],
  ["#1039", "Draft order — Sari", "Disetujui"],
];

export const DemoPreview = () => (
  <section
    id="demo"
    className="relative overflow-hidden border-y border-stone-200 bg-stone-100 py-24 lg:py-32"
    data-testid="section-demo"
  >
    <div className="pointer-events-none absolute inset-0 dotted-grid opacity-50" />
    <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
      <Reveal>
        <SectionLabel>Preview produk</SectionLabel>
        <h2 className="mt-6 max-w-2xl font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
          Begini tampilannya waktu agent kerja.
        </h2>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ChatMockup />
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl shadow-stone-300/40 sm:p-8" data-testid="dashboard-mockup">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-stone-900">
                  Dashboard Operasional
                </p>
                <p className="mt-1 text-xs text-stone-500">Keripik Bu Yani · 7 hari terakhir</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                Live
              </span>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {KPIS.map((k) => (
                <div
                  key={k.label}
                  className="rounded-2xl border border-stone-200 p-4 transition-colors hover:border-emerald-300"
                >
                  <k.icon size={15} className="text-emerald-700" />
                  <p className="mt-3 font-display text-2xl font-bold text-stone-900">{k.value}</p>
                  <p className="mt-0.5 text-[11px] text-stone-500">{k.label}</p>
                  <p className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-orange-600">
                    <ArrowUpRight size={11} /> {k.delta}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
                  Produk paling dicari
                </p>
                <div className="mt-4 space-y-3">
                  {BARS.map(([name, pct]) => (
                    <div key={name}>
                      <div className="flex justify-between text-xs text-stone-600">
                        <span className="font-medium">{name}</span>
                        <span className="font-mono">{pct}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-emerald-800"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
                  Antrean approval
                </p>
                <div className="mt-4 space-y-3">
                  {QUEUE.map(([id, desc, status]) => (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] text-stone-400">{id}</p>
                        <p className="truncate text-xs font-medium text-stone-700">{desc}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          status === "Nunggu"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
