import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

const ITEMS = [
  {
    name: "Rina Setiawati",
    role: "Owner, Warung Kopi Senja · Yogyakarta",
    quote:
      "Dulu tiap malam aku masih bales chat sampe jam 1. Sekarang agent-nya yang jawab stok sama harga, aku tinggal klik setuju pas ada pesanan gede. Balik tidur normal lagi.",
    metric: "Waktu bales chat turun dari 42 menit → 40 detik",
    initials: "RS",
  },
  {
    name: "Bagas Herlambang",
    role: "Owner, Toko Herbal Sehat · Bandung",
    quote:
      "Yang bikin aku percaya itu approval-nya. Agent nggak bisa asal janjiin diskon atau stok kosong — semua yang berisiko nunggu aku pencet dulu. Jadi berani ditinggal.",
    metric: "0 pesanan salah sejak pakai approval gate",
    initials: "BH",
  },
  {
    name: "Maya Kusuma",
    role: "Owner, Maya Florist · Surabaya",
    quote:
      "Pas musim wisuda chat masuk bisa 200-an sehari. Biasanya banyak yang kelewat terus batal beli. Kemarin nggak ada satupun yang nggak kebales.",
    metric: "Chat kelewat 31% → 0%",
    initials: "MK",
  },
];

export const Testimonials = () => (
  <section
    id="testimoni"
    className="border-t border-stone-200 bg-white py-24 dark:border-stone-800 lg:py-32"
    data-testid="testimonials-section"
  >
    <div className="mx-auto max-w-7xl px-5 lg:px-10">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Kata pemilik toko
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Bukan cuma cepat — mereka akhirnya bisa lepas dari HP.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Tiga pemilik UMKM yang ikut uji coba awal TuntasUMKM, dari kedai kopi sampai toko bunga.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {ITEMS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <figure
              data-testid={`testimonial-card-${i}`}
              className="flex h-full flex-col rounded-3xl border border-stone-200 bg-stone-50 p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-emerald-800/40 hover:shadow-xl hover:shadow-emerald-900/5"
            >
              <Quote className="text-orange-500" size={26} />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-stone-700">
                "{t.quote}"
              </blockquote>
              <p className="mt-5 rounded-xl bg-emerald-900/5 px-3 py-2 text-xs font-bold text-emerald-900">
                {t.metric}
              </p>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-stone-200 pt-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-900 font-display text-sm font-bold text-white">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-stone-900">{t.name}</span>
                  <span className="block text-xs text-stone-500">{t.role}</span>
                </span>
                <span className="ml-auto flex gap-0.5 text-orange-500">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={11} fill="currentColor" />
                  ))}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
