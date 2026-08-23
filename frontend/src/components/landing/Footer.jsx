import { Github, FileText, Trophy } from "lucide-react";
import { Logo } from "@/components/landing/Navbar";
import { useT } from "@/lib/i18n";

export const Footer = () => {
  const t = useT();
  const LINKS = [
    {
      title: t("footer.col.product"),
      items: [
        { label: t("nav.problem"), href: "#masalah" },
        { label: t("nav.how"), href: "#cara-kerja" },
        { label: t("nav.features"), href: "#fitur" },
        { label: "Demo", href: "#demo" },
      ],
    },
    {
      title: t("footer.col.docs"),
      items: [
        {
          label: "PRD",
          href: "https://github.com/palmermozina-hue/riset/blob/main/PRD.md",
          icon: FileText,
          external: true,
        },
        {
          label: "GitHub Repo",
          href: "https://github.com/palmermozina-hue/riset",
          icon: Github,
          external: true,
        },
        {
          label: "AI Hackfest 2026",
          href: "https://github.com/palmermozina-hue/riset/blob/main/rekomendasi_ai_hackfest_2026.md",
          icon: Trophy,
          external: true,
        },
      ],
    },
  ];

  return (
    <footer className="border-t border-stone-200 bg-stone-50 py-16" data-testid="footer">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone-600">
              {t("footer.tagline")}
            </p>
          </div>

          {LINKS.map((col) => (
            <div key={col.title} className="md:col-span-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                {col.title}
              </p>
              <ul className="mt-5 space-y-3">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      target={it.external ? "_blank" : undefined}
                      rel={it.external ? "noopener noreferrer" : undefined}
                      data-testid={`footer-link-${it.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="inline-flex items-center gap-2 text-sm text-stone-600 transition-colors hover:text-emerald-900"
                    >
                      {it.icon && <it.icon size={14} />}
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1" />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-stone-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-stone-500">{t("footer.copy")}</p>
          <p className="text-xs text-stone-400">{t("footer.madeIn")}</p>
        </div>
      </div>
    </footer>
  );
};
