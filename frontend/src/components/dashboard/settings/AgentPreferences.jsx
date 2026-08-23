import { useState } from "react";
import { Bot } from "lucide-react";
import { toast } from "sonner";
import { SETTINGS } from "@/constants/testIds";
import { AGENT_PREFS } from "@/data/mockTeam";

const TOGGLES = [
  {
    id: "notif-approval",
    label: "Notifikasi approval real-time",
    desc: "Push notif tiap ada aksi berisiko yang nunggu keputusan kamu.",
    on: true,
  },
  {
    id: "notif-stock",
    label: "Peringatan stok tipis",
    desc: "Agent kabarin kalau stok produk turun di bawah 10 pcs.",
    on: true,
  },
  {
    id: "daily-summary",
    label: "Ringkasan harian",
    desc: "Rekap percakapan, pesanan, dan jam yang dihemat setiap jam 21.00.",
    on: false,
  },
  {
    id: "auto-approve",
    label: "Auto-approve pesanan kecil",
    desc: `Lewati approval untuk order di bawah Rp${AGENT_PREFS.autoApproveUnder.toLocaleString("id-ID")}. Default: mati (sesuai ADR-4).`,
    on: false,
  },
];

export const AgentPreferences = () => {
  const [state, setState] = useState(() =>
    TOGGLES.reduce((acc, t) => ({ ...acc, [t.id]: t.on }), {}),
  );

  const flip = (t) => {
    const next = !state[t.id];
    setState((s) => ({ ...s, [t.id]: next }));
    toast.success(`${t.label} ${next ? "diaktifkan" : "dimatikan"}.`);
  };

  return (
    <div
      className="rounded-3xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
      data-testid={SETTINGS.prefsPanel}
    >
      <div className="flex items-start gap-4 border-b border-stone-100 p-7 dark:border-stone-800">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-600 text-white">
          <Bot size={19} strokeWidth={2.2} />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
            Preferensi agent
          </h3>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Atur kapan agent boleh jalan sendiri dan kapan harus nunggu kamu.
          </p>
        </div>
      </div>

      <ul className="divide-y divide-stone-100 dark:divide-stone-800">
        {TOGGLES.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-6 px-7 py-5">
            <div>
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">{t.label}</p>
              <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{t.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={state[t.id]}
              onClick={() => flip(t)}
              data-testid={SETTINGS.prefToggle(t.id)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                state[t.id] ? "bg-emerald-800" : "bg-stone-300 dark:bg-stone-700"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  state[t.id] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="border-t border-stone-100 px-7 py-6 dark:border-stone-800">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          Kebijakan timeout approval
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { t: `${AGENT_PREFS.reminderMinutes} menit`, d: "Reminder ke owner" },
            { t: `${AGENT_PREFS.customerNoticeMinutes} menit`, d: "Pesan tunggu ke pelanggan" },
            { t: `${AGENT_PREFS.autoHoldMinutes} menit`, d: "Auto-hold + catat analitik" },
          ].map((s) => (
            <div
              key={s.d}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-950"
            >
              <p className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                {s.t}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
