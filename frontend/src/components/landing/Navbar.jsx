import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import { useT } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Logo = ({ light = false }) => (
  <div className="flex items-center gap-2.5">
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-900 text-white">
      <Zap strokeWidth={2.5} size={18} />
    </span>
    <span
      className={`font-display text-lg font-bold tracking-tight ${
        light ? "text-white" : "text-stone-900"
      }`}
    >
      Tuntas<span className="text-orange-600">UMKM</span>
    </span>
  </div>
);

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useT();

  const LINKS = [
    { label: t("nav.problem"), href: "#masalah", id: "masalah" },
    { label: t("nav.how"), href: "#cara-kerja", id: "cara-kerja" },
    { label: t("nav.features"), href: "#fitur", id: "fitur" },
    { label: t("nav.demoPreview"), href: "#demo", id: "demo" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-white/75 backdrop-blur-xl border-b border-stone-200/70 dark:bg-stone-900/75 dark:border-stone-700/70"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" data-testid="nav-logo" aria-label="TuntasUMKM">
          <Logo />
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              data-testid={`nav-link-${l.id}`}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-emerald-900 dark:text-stone-300 dark:hover:text-emerald-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <LanguageToggle />
          <ThemeToggle inline />
          <Link
            to="/auth"
            data-testid="nav-login-link"
            className="ml-1 text-sm font-semibold text-stone-700 transition-colors hover:text-orange-600 dark:text-stone-200"
          >
            {t("nav.login")}
          </Link>
          <Link
            to="/demo"
            data-testid="nav-cta-demo"
            className="inline-flex items-center rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-950 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            {t("nav.tryDemo")}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle compact />
          <ThemeToggle inline />
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-800"
            onClick={() => setOpen((v) => !v)}
            data-testid="nav-mobile-toggle"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="border-t border-stone-200 bg-white px-6 pb-6 pt-2 md:hidden dark:border-stone-700 dark:bg-stone-900"
          data-testid="nav-mobile-menu"
        >
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              onClick={() => setOpen(false)}
              data-testid={`nav-mobile-link-${l.id}`}
              className="block border-b border-stone-100 py-3 text-sm font-medium text-stone-700 dark:border-stone-800 dark:text-stone-200"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            data-testid="nav-mobile-login-link"
            className="block border-b border-stone-100 py-3 text-sm font-medium text-stone-700 dark:border-stone-800 dark:text-stone-200"
          >
            {t("nav.login")}
          </Link>
          <a
            href="#waitlist"
            onClick={() => setOpen(false)}
            data-testid="nav-mobile-cta"
            className="mt-4 block rounded-full bg-orange-600 px-5 py-3 text-center text-sm font-semibold text-white"
          >
            {t("nav.joinWaitlist")}
          </a>
        </div>
      )}
    </header>
  );
};
