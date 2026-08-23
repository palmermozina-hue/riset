import { useState } from "react";
import { Loader2, Save, Store } from "lucide-react";
import { toast } from "sonner";
import { SETTINGS } from "@/constants/testIds";
import { getUser, updateUser } from "@/lib/mockAuth";

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition-colors focus-visible:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100";

export const StoreProfile = () => {
  const user = getUser() || {};
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    storeName: user.storeName || "Warung Kopi Senja",
    phone: user.phone || "0812-3456-7890",
    address: user.address || "Jl. Kaliurang Km 5, Sleman, DIY",
  });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = (ev) => {
    ev.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateUser(form);
      setSaving(false);
      toast.success("Profil toko disimpan.");
    }, 600);
  };

  return (
    <form
      onSubmit={save}
      data-testid={SETTINGS.profileForm}
      className="rounded-3xl border border-stone-200 bg-white p-7 dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-900 text-white">
          <Store size={19} strokeWidth={2.2} />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
            Profil toko
          </h3>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Data ini dipakai agent buat memperkenalkan toko kamu ke pelanggan.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Nama pemilik">
          <input
            value={form.name}
            onChange={set("name")}
            data-testid={SETTINGS.profileNameInput}
            className={inputClass}
          />
        </Field>
        <Field label="Nama toko">
          <input
            value={form.storeName}
            onChange={set("storeName")}
            data-testid={SETTINGS.profileStoreInput}
            className={inputClass}
          />
        </Field>
        <Field label="Email">
          <input
            value={form.email}
            onChange={set("email")}
            data-testid={SETTINGS.profileEmailInput}
            className={inputClass}
          />
        </Field>
        <Field label="Nomor WhatsApp">
          <input
            value={form.phone}
            onChange={set("phone")}
            data-testid={SETTINGS.profilePhoneInput}
            className={inputClass}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Alamat pengambilan / gudang">
            <input
              value={form.address}
              onChange={set("address")}
              data-testid={SETTINGS.profileAddressInput}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        data-testid={SETTINGS.profileSaveButton}
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:scale-[0.98] disabled:opacity-70"
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        Simpan perubahan
      </button>
    </form>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-stone-800 dark:text-stone-200">
      {label}
    </label>
    {children}
  </div>
);
