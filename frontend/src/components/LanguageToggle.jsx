import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Toggle switch dwi-bahasa ID ↔ EN.
 * `compact` versi kecil buat mobile drawer / topbar tight.
 */
export const LanguageToggle = ({ compact = false }) => {
  const { lang, setLang } = useI18n();
  const isEn = lang === "en";
  const flip = () => setLang(isEn ? "id" : "en");

  if (compact) {
    return (
      <button
        onClick={flip}
        data-testid="language-toggle-compact"
        aria-label="Toggle language"
        className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 transition-colors hover:border-emerald-800 hover:text-emerald-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
      >
        <Languages size={13} />
        {lang.toUpperCase()}
      </button>
    );
  }

  return (
    <button
      onClick={flip}
      data-testid="language-toggle-switch"
      role="switch"
      aria-checked={isEn}
      aria-label={isEn ? "Switch to Indonesian" : "Ganti ke Bahasa Inggris"}
      className="relative inline-flex h-8 w-[74px] items-center rounded-full border border-stone-200 bg-white p-0.5 shadow-sm transition-colors duration-200 hover:border-emerald-800 dark:border-stone-700 dark:bg-stone-800"
    >
      <span
        className={`absolute inset-y-0.5 left-0.5 grid h-7 w-9 place-items-center rounded-full bg-emerald-900 text-[11px] font-bold text-white transition-transform duration-300 ${
          isEn ? "translate-x-[32px]" : "translate-x-0"
        }`}
      >
        {isEn ? "EN" : "ID"}
      </span>
      <span
        className={`ml-auto pr-2 text-[10px] font-bold uppercase tracking-widest transition-opacity duration-200 ${
          isEn ? "opacity-0" : "opacity-70 text-stone-500 dark:text-stone-400"
        }`}
      >
        EN
      </span>
      <span
        className={`absolute left-2 text-[10px] font-bold uppercase tracking-widest transition-opacity duration-200 ${
          isEn ? "opacity-70 text-stone-500 dark:text-stone-400" : "opacity-0"
        }`}
      >
        ID
      </span>
    </button>
  );
};
