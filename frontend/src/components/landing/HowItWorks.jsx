import { useState } from "react";
import { PIPELINE } from "@/data/content";
import { Reveal, SectionLabel } from "@/components/landing/Reveal";

export const HowItWorks = () => {
  const [active, setActive] = useState(4);

  return (
    <section id="cara-kerja" className="py-24 lg:py-32" data-testid="section-how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <SectionLabel>Cara kerja</SectionLabel>
          <h2 className="mt-6 max-w-2xl font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Tujuh tahap dari chat masuk sampai jadi insight.
          </h2>
          <p className="mt-5 max-w-xl text-base text-stone-600 sm:text-lg">
            Klik tiap tahap buat lihat apa yang dilakukan agent di baliknya.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-16 -mx-6 overflow-x-auto px-6 pb-4 lg:mx-0 lg:px-0">
            <div className="flex min-w-max items-stretch gap-3">
              {PIPELINE.map((s, i) => {
                const on = active === i;
                return (
                  <div key={s.n} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      data-testid={`pipeline-stage-${i}`}
                      className={`w-[190px] rounded-3xl border p-6 text-left transition-colors ${
                        on
                          ? "border-emerald-900 bg-emerald-900 text-white"
                          : "border-stone-200 bg-white text-stone-900 hover:border-emerald-300"
                      }`}
                    >
                      <span
                        className={`font-mono text-xs font-bold ${
                          on ? "text-orange-300" : "text-orange-600"
                        }`}
                      >
                        {s.n}
                      </span>
                      <p className="mt-3 font-display text-lg font-semibold">{s.title}</p>
                      <p
                        className={`mt-2 text-xs leading-relaxed ${
                          on ? "text-emerald-100" : "text-stone-500"
                        }`}
                      >
                        {s.desc}
                      </p>
                    </button>
                    {i < PIPELINE.length - 1 && (
                      <span className="h-px w-6 border-t-2 border-dashed border-stone-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
