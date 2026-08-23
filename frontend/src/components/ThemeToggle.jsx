import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getTheme, toggleTheme } from "@/lib/theme";

/** Tombol mengambang buat ganti terang/gelap. Dipakai di halaman landing. */
export const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = getTheme();
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const onClick = () => setTheme(toggleTheme());

  return (
    <button
      onClick={onClick}
      data-testid="theme-toggle-button"
      aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-lg shadow-stone-900/10 transition-[transform,color,background-color] duration-200 hover:scale-105 hover:text-emerald-800 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-amber-300"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
