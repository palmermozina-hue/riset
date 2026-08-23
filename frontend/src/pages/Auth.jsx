import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { LOGIN, REGISTER } from "@/constants/testIds";
import { signIn } from "@/lib/mockAuth";

const HIGHLIGHTS = [
  { title: "Human-in-the-loop", desc: "Setiap aksi berisiko nunggu ketukan jempol kamu dulu." },
  { title: "Jejak workflow lengkap", desc: "Lihat 7 tahap pipeline per percakapan, bukan kotak hitam." },
  { title: "Nyambung ke katalog", desc: "Stok dan harga diambil live, jadi agent nggak ngasal jawab." },
];

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition-colors focus-visible:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30";

export default function Auth() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get("mode") === "register" ? "register" : "login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const isRegister = mode === "register";
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (isRegister && form.name.trim().length < 3) e.name = "Nama minimal 3 karakter.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Format email belum benar.";
    if (form.password.length < 6) e.password = "Password minimal 6 karakter.";
    if (isRegister && form.confirm !== form.password) e.confirm = "Konfirmasi password nggak sama.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      signIn({ name: isRegister ? form.name : "", email: form.email });
      toast.success(isRegister ? "Akun dibuat! Selamat datang 👋" : "Berhasil masuk, selamat kerja!");
      setLoading(false);
      navigate("/dashboard");
    }, 700);
  };

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-stone-50 lg:grid lg:grid-cols-12" data-testid="auth-page">
      {/* Panel kiri: brand story */}
      <aside className="relative hidden overflow-hidden bg-emerald-950 p-12 lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.55) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-orange-600/25 blur-3xl" />

        <Link
          to="/"
          data-testid="auth-back-home"
          className="relative z-10 inline-flex items-center gap-2 text-sm font-medium text-emerald-200 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} /> Balik ke beranda
        </Link>

        <div className="relative z-10 max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-100">
            <Sparkles size={12} /> Operational Agent
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Chat pelanggan masuk, kerjaan kamu ikut kelar.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-emerald-100/80">
            Masuk ke dashboard buat lihat pesanan yang nunggu persetujuan, stok yang mulai tipis, dan
            berapa jam yang berhasil kamu hemat hari ini.
          </p>

          <ul className="mt-10 space-y-5">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-orange-600 text-white">
                  <ShieldCheck size={14} strokeWidth={2.5} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{h.title}</p>
                  <p className="text-sm text-emerald-100/70">{h.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-emerald-200/60">
          TuntasUMKM — IDwebhost AI HackFest 2026
        </p>
      </aside>

      {/* Panel kanan: form */}
      <main className="flex min-h-screen items-center justify-center px-6 py-14 lg:col-span-7">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-10 inline-flex items-center gap-2.5 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-900 text-white">
              <Zap size={18} strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-stone-900">
              Tuntas<span className="text-orange-600">UMKM</span>
            </span>
          </Link>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            {isRegister ? "Daftar akun" : "Masuk dashboard"}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {isRegister ? "Bikin akun tokomu" : "Selamat datang balik"}
          </h2>
          <p className="mt-3 text-sm text-stone-600">
            {isRegister
              ? "Isi data toko sebentar, agent-nya langsung siap kerja."
              : "Masukin email dan password kamu. Semua data di demo ini masih mock."}
          </p>

          {/* Segmented switch */}
          <div className="mt-8 inline-flex rounded-full border border-stone-200 bg-white p-1">
            {[
              { id: "login", label: "Masuk" },
              { id: "register", label: "Daftar" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => switchMode(t.id)}
                data-testid={`auth-tab-${t.id}`}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
                  mode === t.id
                    ? "bg-emerald-900 text-white"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} noValidate className="mt-7 space-y-5" data-testid="auth-form">
            {isRegister && (
              <Field label="Nama pemilik / toko" error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Rina Pratiwi"
                  data-testid={REGISTER.nameInput}
                  className={inputClass}
                />
              </Field>
            )}

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="kamu@tokokamu.id"
                data-testid={isRegister ? REGISTER.emailInput : LOGIN.emailInput}
                className={inputClass}
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Minimal 6 karakter"
                  data-testid={isRegister ? REGISTER.passwordInput : LOGIN.passwordInput}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  data-testid="auth-toggle-password"
                  aria-label="Tampilkan password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-700"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </Field>

            {isRegister && (
              <Field label="Ulangi password" error={errors.confirm}>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Samain ya"
                  data-testid={REGISTER.passwordConfirmInput}
                  className={inputClass}
                />
              </Field>
            )}

            {!isRegister && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-stone-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-stone-300 accent-emerald-800" />
                  Ingat saya
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Fitur reset password belum aktif di demo ini.")}
                  data-testid={LOGIN.forgotPasswordLink}
                  className="text-sm font-semibold text-emerald-800 hover:text-orange-600"
                >
                  Lupa password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              data-testid={isRegister ? REGISTER.submitButton : LOGIN.submitButton}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:scale-[0.98] disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isRegister ? "Daftar & buka dashboard" : "Masuk ke dashboard"}
            </button>
          </form>

          <p className="mt-6 text-sm text-stone-600">
            {isRegister ? "Udah punya akun? " : "Belum punya akun? "}
            <button
              type="button"
              onClick={() => switchMode(isRegister ? "login" : "register")}
              data-testid={isRegister ? REGISTER.loginLink : LOGIN.registerLink}
              className="font-semibold text-emerald-800 underline decoration-orange-500 decoration-2 underline-offset-4 hover:text-orange-600"
            >
              {isRegister ? "Masuk di sini" : "Daftar gratis"}
            </button>
          </p>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 text-xs leading-relaxed text-stone-500">
            <strong className="text-stone-700">Mode demo:</strong> autentikasi masih mock — email &
            password apa pun yang valid formatnya bakal langsung masuk ke dashboard.
          </div>
        </motion.div>
      </main>
    </div>
  );
}

const Field = ({ label, error, children }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-stone-800">{label}</label>
    {children}
    {error && (
      <p className="mt-1.5 text-xs font-medium text-red-600" data-testid="auth-field-error">
        {error}
      </p>
    )}
  </div>
);
