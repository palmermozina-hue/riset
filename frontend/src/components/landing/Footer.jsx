import { Github, FileText, Trophy } from "lucide-react";
import { Logo } from "@/components/landing/Navbar";

const LINKS = [
  {
    title: "Produk",
    items: [
      { label: "Masalah", href: "#masalah" },
      { label: "Cara Kerja", href: "#cara-kerja" },
      { label: "Fitur", href: "#fitur" },
      { label: "Demo", href: "#demo" },
    ],
  },
  {
    title: "Dokumen",
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

export const Footer = () => (
  <footer className="border-t border-stone-200 bg-stone-50 py-16" data-testid="footer">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone-600">
            AI Operational Agent buat UMKM Indonesia. Dibangun untuk AI Hackfest 2026.
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
        <p className="text-xs text-stone-500">
          © 2026 TuntasUMKM · Tim Riset · Prototype hackathon
        </p>
        <p className="text-xs text-stone-400">Dibikin di Indonesia 🇮🇩</p>
      </div>
    </div>
  </footer>
);
