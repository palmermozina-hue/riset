import * as Icons from "lucide-react";
import { PAIN_POINTS } from "@/data/content";
import { Reveal, SectionLabel } from "@/components/landing/Reveal";

export const Problem = () => (
  <section id="masalah" className="border-y border-stone-200 bg-white py-24 lg:py-32" data-testid="section-problem">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel>Masalahnya</SectionLabel>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Kamu jualan, bukan jadi operator chat 24 jam.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-12 rounded-3xl border border-stone-200 bg-stone-50 p-8">
              <p className="font-display text-6xl font-light tracking-tighter text-emerald-900 sm:text-7xl">
                64%
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                owner UMKM ngaku waktunya kebuang buat balesin chat repetitif yang
                jawabannya selalu sama.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pt-16">
          <div className="grid grid-cols-1 gap-8 sm:gap-10">
            {PAIN_POINTS.map((p, i) => {
              const Icon = Icons[p.icon] ?? Icons.CircleAlert;
              return (
                <Reveal key={p.title} delay={i * 0.1}>
                  <div
                    className="group flex gap-6 border-b border-stone-100 pb-8"
                    data-testid={`pain-point-${i}`}
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-stone-900">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
);
