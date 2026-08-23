import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getTheme, toggleTheme } from "@/lib/theme";
import { useT } from "@/lib/i18n";

/**
 * Tombol ganti tema. `inline` buat dipakai di navbar/topbar; tanpa flag = floating
 * (dipertahankan buat backward compat kalau ada halaman lain yg masih pakai).
 */
export const ThemeToggle = ({ inline = false }) => {
  const [theme, setTheme] = useState("light");
  const t = useT();

  useEffect(() => {
    const saved = getTheme();
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const onClick = () => setTheme(toggleTheme());
  const ariaLabel = theme === "dark" ? t("nav.themeLight") : t("nav.themeDark");

  if (inline) {
    return (
      <button
        onClick={onClick}
        data-testid="theme-toggle-inline"
        aria-label={ariaLabel}
        className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 transition-colors duration-200 hover:border-emerald-800 hover:text-emerald-900 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-amber-300 dark:hover:text-amber-200"
      >
        {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      data-testid="theme-toggle-button"
      aria-label={ariaLabel}
      className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-lg shadow-stone-900/10 transition-[transform,color,background-color] duration-200 hover:scale-105 hover:text-emerald-800 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-amber-300"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
