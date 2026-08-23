import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

const ITEMS = [
  {
    q: "Agent-nya bisa asal janjiin diskon atau stok yang nggak ada, nggak?",
    a: "Nggak. Semua aksi berisiko — bikin pesanan, kasih diskon, janji pengiriman — ditahan di approval gate dan nunggu kamu pencet Setujui di dashboard. Yang dijawab otomatis cuma pertanyaan read-only kayak stok dan harga, dan itupun dibaca langsung dari katalogmu.",
  },
  {
    q: "Kalau agent nggak yakin sama maksud pelanggan gimana?",
    a: "Kalau confidence-nya rendah, agent nggak nebak. Dia balik nanya buat klarifikasi, atau langsung eskalasi ke kamu lewat Inbox. Setiap keputusan itu kelihatan jejaknya di panel 7-tahap.",
  },
  {
    q: "Datanya diambil dari mana? Perlu upload manual?",
    a: "Dari katalog produk kamu di menu Katalog & Stok. Sekali diisi, agent pakai itu sebagai satu-satunya sumber jawaban. Jadi kalau stok berubah, jawaban agent ikut berubah — nggak ada karangan.",
  },
  {
    q: "Ini jalan di WhatsApp sama Instagram juga?",
    a: "Iya, semua kanal masuk ke satu Inbox yang sama. Di demo ini kamu bisa cobain lewat web chat dulu supaya nggak perlu setup nomor apa-apa.",
  },
  {
    q: "Kalau aku mau ambil alih chat sendiri bisa?",
    a: "Bisa kapan aja. Buka Inbox, klik percakapannya, ketik balasan kamu sendiri. Agent otomatis mundur dan cuma nyatet buat analitik.",
  },
  {
    q: "Berapa lama sampai bisa dipakai?",
    a: "Isi katalog produk dan sambungin kanal chat — biasanya di bawah 30 menit. Nggak perlu pindah aplikasi kasir atau ganti nomor.",
  },
];

export const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="border-t border-stone-200 bg-stone-50 py-24 dark:border-stone-800 lg:py-32"
      data-testid="faq-section"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <Reveal className="lg:col-span-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              Yang sering ditanyain
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Pertanyaan yang wajar banget kamu punya.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-stone-600">
              Nyerahin chat pelanggan ke AI itu keputusan besar. Ini jawaban jujurnya.
            </p>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <div className="divide-y divide-stone-200 overflow-hidden rounded-3xl border border-stone-200 bg-white">
            {ITEMS.map((item, i) => {
              const expanded = open === i;
              return (
                <div key={item.q}>
                  <button
                    onClick={() => setOpen(expanded ? -1 : i)}
                    aria-expanded={expanded}
                    data-testid={`faq-question-${i}`}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left transition-colors duration-200 hover:bg-stone-50"
                  >
                    <span className="font-display text-base font-semibold text-stone-900 sm:text-lg">
                      {item.q}
                    </span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors duration-200 ${
                        expanded ? "bg-emerald-900 text-white" : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {expanded ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                  <div
                    data-testid={`faq-answer-${i}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 pr-14 text-[15px] leading-relaxed text-stone-600">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
