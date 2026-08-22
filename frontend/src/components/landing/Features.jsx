import * as Icons from "lucide-react";
import { FEATURES } from "@/data/content";
import { Reveal, SectionLabel } from "@/components/landing/Reveal";

const TONE = {
  emerald: "bg-emerald-900 text-white border-emerald-900",
  orange: "bg-orange-50 border-orange-200 text-stone-900",
  plain: "bg-white border-stone-200 text-stone-900",
};

export const Features = () => (
  <section
    id="fitur"
    className="border-y border-stone-200 bg-white py-24 lg:py-32"
    data-testid="section-features"
  >
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <Reveal>
        <SectionLabel>Fitur inti</SectionLabel>
        <h2 className="mt-6 max-w-2xl font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
          Semua yang bikin agent ini beneran kerja.
        </h2>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12">
        {FEATURES.map((f, i) => {
          const Icon = Icons[f.icon] ?? Icons.Sparkles;
          const dark = f.tone === "emerald";
          return (
            <Reveal key={f.title} delay={i * 0.07} className={`col-span-1 ${f.span}`}>
              <div
                className={`group h-full rounded-3xl border p-8 transition-transform duration-300 hover:-translate-y-1 ${TONE[f.tone]}`}
                data-testid={`feature-card-${i}`}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl ${
                    dark ? "bg-white/10 text-orange-300" : "bg-emerald-50 text-emerald-800"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                </span>
                <h3
                  className={`mt-6 font-display text-xl font-semibold ${
                    dark ? "text-white" : "text-stone-900"
                  }`}
                >
                  {f.title}
                </h3>
                <p
                  className={`mt-3 max-w-md text-sm leading-relaxed ${
                    dark ? "text-emerald-100" : "text-stone-600"
                  }`}
                >
                  {f.desc}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
