import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, PartyPopper, X } from "lucide-react";
import { DASHBOARD } from "@/constants/testIds";
import { rupiah } from "@/data/mockDashboard";

const riskStyle = {
  rendah: "bg-emerald-50 text-emerald-700",
  sedang: "bg-orange-50 text-orange-700",
  tinggi: "bg-red-50 text-red-600",
};

export const ApprovalQueue = ({ items, onDecide, history }) => (
  <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
    <div className="space-y-5 xl:col-span-8">
      <AnimatePresence initial={false}>
        {items.map((a) => (
          <motion.div
            key={a.id}
            layout
            exit={{ opacity: 0, x: -24 }}
            data-testid={DASHBOARD.approvalCard(a.id)}
            className="rounded-3xl border border-stone-200 bg-white p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-600">
                    {a.id}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${riskStyle[a.risk]}`}>
                    risiko {a.risk}
                  </span>
                  <span className="rounded-full border border-stone-200 px-2.5 py-1 text-[11px] font-semibold text-stone-500">
                    {a.channel}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold text-stone-900">
                  {a.action} — {a.customer}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
                <Clock size={13} /> {a.createdAt}
              </span>
            </div>

            <div className="mt-5 divide-y divide-stone-100 rounded-2xl bg-stone-50 px-5">
              {a.items.map((it) => (
                <div key={it.name} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-stone-700">
                    {it.name} <span className="text-stone-400">×{it.qty}</span>
                  </span>
                  <span className="font-semibold text-stone-900">
                    {it.price ? rupiah(it.price * Math.abs(it.qty)) : "—"}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm italic text-stone-500">“{a.note}”</p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-stone-400">Total</p>
                <p className="font-display text-2xl font-bold text-stone-900">
                  {a.total ? rupiah(a.total) : "Tanpa nilai transaksi"}
                </p>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => onDecide(a, "reject")}
                  data-testid={DASHBOARD.rejectButton(a.id)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-red-300 hover:text-red-600 active:scale-95"
                >
                  <X size={15} /> Tolak
                </button>
                <button
                  onClick={() => onDecide(a, "approve")}
                  data-testid={DASHBOARD.approveButton(a.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-950 active:scale-95"
                >
                  <Check size={15} /> Setujui
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <div
          data-testid={DASHBOARD.approvalEmpty}
          className="rounded-3xl border border-dashed border-stone-300 bg-white p-14 text-center"
        >
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
            <PartyPopper size={24} />
          </span>
          <h3 className="mt-5 font-display text-xl font-semibold text-stone-900">
            Antrean kosong, kerjaan kamu kelar
          </h3>
          <p className="mt-2 text-sm text-stone-500">
            Semua aksi udah diputuskan. Agent bakal lanjut jalan sendiri.
          </p>
        </div>
      )}
    </div>

    <div className="xl:col-span-4">
      <div className="rounded-3xl border border-stone-200 bg-white p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          Riwayat keputusan
        </p>
        {history.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            Belum ada keputusan di sesi ini. Coba setujui satu pesanan.
          </p>
        ) : (
          <ul className="mt-4 space-y-3.5">
            {history.map((h) => (
              <li key={h.id} className="flex items-start gap-3" data-testid={`approval-history-${h.id}`}>
                <span
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg text-white ${
                    h.decision === "approve" ? "bg-emerald-800" : "bg-stone-400"
                  }`}
                >
                  {h.decision === "approve" ? <Check size={13} /> : <X size={13} />}
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    {h.decision === "approve" ? "Disetujui" : "Ditolak"} · {h.id}
                  </p>
                  <p className="text-xs text-stone-500">
                    {h.customer} — {h.action}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);
