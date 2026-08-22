import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

export const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      toast.error("Email-nya kayaknya belum bener, coba cek lagi ya");
      return;
    }
    console.log("[TuntasUMKM] waitlist signup (mock):", email.trim());
    setDone(true);
    toast.success("Sip! Kamu masuk waitlist. Kami kabari lewat email.");
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-emerald-950 py-24 lg:py-32"
      data-testid="section-waitlist"
    >
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-emerald-700/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full bg-orange-600/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Siap otomatiskan operasional toko kamu?
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-emerald-100 sm:text-lg">
            Gabung waitlist buat jadi pilot user pertama. Kami bantu setup katalog dan
            SOP toko kamu langsung.
          </p>
          <p className="mt-8 text-xs text-emerald-300/70">
            Form ini masih mock buat demo hackathon — belum kirim email.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur-xl sm:p-10">
            {done ? (
              <div className="py-6 text-center" data-testid="waitlist-success">
                <CheckCircle2 size={40} className="mx-auto text-orange-400" />
                <p className="mt-5 font-display text-xl font-semibold text-white">
                  Kamu udah masuk daftar!
                </p>
                <p className="mt-2 text-sm text-emerald-100">
                  Kami kabari ke <span className="font-semibold">{email}</span> begitu
                  pilot dibuka.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} data-testid="waitlist-form">
                <label
                  htmlFor="waitlist-email"
                  className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200"
                >
                  Email kamu
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@tokokamu.id"
                  data-testid="waitlist-email-input"
                  className="mt-3 w-full rounded-2xl border border-white/25 bg-white/95 px-5 py-4 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:border-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                />
                <button
                  type="submit"
                  data-testid="waitlist-submit-btn"
                  className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:scale-95"
                >
                  Gabung Waitlist
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-4 text-center text-xs text-emerald-200/80">
                  Gratis buat 50 UMKM pertama. Nggak ada spam.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
