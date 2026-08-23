import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { SETTINGS } from "@/constants/testIds";
import { ROLES } from "@/data/mockTeam";

export const InviteMemberDialog = ({ onClose, onInvite }) => {
  const [form, setForm] = useState({ name: "", email: "", role: "staff" });
  const [error, setError] = useState("");

  const submit = (ev) => {
    ev.preventDefault();
    if (form.name.trim().length < 3) return setError("Nama minimal 3 karakter.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Format email belum benar.");
    setError("");
    onInvite(form);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/60 px-5 backdrop-blur-sm">
      <form
        onSubmit={submit}
        data-testid={SETTINGS.inviteDialog}
        className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 dark:border-stone-800 dark:bg-stone-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-900 text-white">
              <UserPlus size={18} strokeWidth={2.2} />
            </span>
            <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
              Undang anggota tim
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid={SETTINGS.inviteCancelButton}
            aria-label="Tutup"
            className="text-stone-400 transition-colors hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200">
              Nama
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Sari Meliana"
              data-testid={SETTINGS.inviteNameInput}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm focus-visible:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200">
              Email
            </label>
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="tim@tokokamu.id"
              data-testid={SETTINGS.inviteEmailInput}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm focus-visible:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200">
              Peran
            </label>
            <div className="grid gap-2">
              {ROLES.filter((r) => r.id !== "owner").map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r.id }))}
                  data-testid={SETTINGS.inviteRoleOption(r.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                    form.role === r.id
                      ? "border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40"
                      : "border-stone-200 hover:border-stone-300 dark:border-stone-800"
                  }`}
                >
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {r.label}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-xs font-medium text-red-600" data-testid={SETTINGS.inviteError}>
            {error}
          </p>
        )}

        <div className="mt-7 flex gap-3">
          <button
            type="submit"
            data-testid={SETTINGS.inviteSubmitButton}
            className="flex-1 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:scale-[0.98]"
          >
            Kirim undangan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};
