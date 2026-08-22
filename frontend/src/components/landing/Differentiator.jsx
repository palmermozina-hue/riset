import { Check, X } from "lucide-react";
import { COMPARISON } from "@/data/content";
import { Reveal, SectionLabel } from "@/components/landing/Reveal";

const Mark = ({ ok }) =>
  ok ? (
    <Check size={18} className="mx-auto text-emerald-700" strokeWidth={2.5} />
  ) : (
    <X size={18} className="mx-auto text-stone-300" strokeWidth={2.5} />
  );

export const Differentiator = () => (
  <section className="py-24 lg:py-32" data-testid="section-differentiator">
    <div className="mx-auto max-w-5xl px-6 lg:px-10">
      <Reveal>
        <SectionLabel>Bedanya di mana</SectionLabel>
        <h2 className="mt-6 max-w-2xl font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
          Chatbot biasa vs TuntasUMKM Agent.
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-14 overflow-hidden rounded-3xl border border-stone-200 bg-white">
          <div className="grid grid-cols-[1fr_88px_120px] border-b border-stone-200 bg-stone-50 sm:grid-cols-[1fr_160px_200px]">
            <div className="p-5 text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
              Kemampuan
            </div>
            <div className="p-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-stone-500">
              Chatbot
            </div>
            <div className="bg-emerald-50 p-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-emerald-800">
              TuntasUMKM
            </div>
          </div>
          {COMPARISON.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_88px_120px] border-b border-stone-100 last:border-0 sm:grid-cols-[1fr_160px_200px]"
              data-testid={`comparison-row-${i}`}
            >
              <div className="p-5 text-sm font-medium text-stone-700">{row.label}</div>
              <div className="grid place-items-center p-5">
                <Mark ok={row.chatbot} />
              </div>
              <div className="grid place-items-center bg-emerald-50/60 p-5">
                <Mark ok={row.agent} />
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);
