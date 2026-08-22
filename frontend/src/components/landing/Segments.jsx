import { SEGMENTS } from "@/data/content";
import { Reveal, SectionLabel } from "@/components/landing/Reveal";

export const Segments = () => (
  <section className="py-24 lg:py-32" data-testid="section-segments">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <Reveal>
        <SectionLabel>Cocok buat siapa</SectionLabel>
        <h2 className="mt-6 max-w-2xl font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
          Dipakai UMKM yang chatnya paling rame.
        </h2>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {SEGMENTS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.1}>
            <div
              className="group relative h-[420px] overflow-hidden rounded-3xl border border-stone-200"
              data-testid={`segment-card-${i}`}
            >
              <img
                src={s.image}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  {s.stat}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-200">{s.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
