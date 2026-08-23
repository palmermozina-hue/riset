// Simple i18n — Indonesian (default) + English. Persistent via localStorage.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KEY = "tuntas.lang.v1";

const dict = {
  id: {
    // Navbar
    "nav.problem": "Masalah",
    "nav.how": "Cara Kerja",
    "nav.features": "Fitur",
    "nav.demoPreview": "Demo Preview",
    "nav.login": "Masuk",
    "nav.tryDemo": "Coba Demo Live",
    "nav.joinWaitlist": "Gabung Waitlist",
    "nav.langLabel": "Bahasa",
    "nav.themeLight": "Aktifkan mode terang",
    "nav.themeDark": "Aktifkan mode gelap",

    // Hero
    "hero.badge": "AI Hackfest 2026 · Operational Agent",
    "hero.h1.a": "Agen AI yang nggak cuma",
    "hero.h1.strike": "jawab",
    "hero.h1.b": ", tapi",
    "hero.h1.emph": "bertindak",
    "hero.desc":
      "TuntasUMKM balesin chat pembeli, cek stok, dan susun draft order buat toko kamu — otomatis. Aksi pentingnya tetap nunggu kamu klik setuju.",
    "hero.ctaPrimary": "Coba Demo Interaktif",
    "hero.ctaSecondary": "Lihat cara kerja",
    "hero.stat.time": "rata-rata balasan",
    "hero.stat.pipeline": "pipeline agent",
    "hero.stat.approve": "aksi berisiko diapprove",

    // Footer
    "footer.tagline": "AI Operational Agent buat UMKM Indonesia. Dibangun untuk AI Hackfest 2026.",
    "footer.col.product": "Produk",
    "footer.col.docs": "Dokumen",
    "footer.copy": "© 2026 TuntasUMKM · Tim Riset · Prototype hackathon",
    "footer.madeIn": "Dibikin di Indonesia 🇮🇩",

    // Dashboard headings
    "dash.ringkasan.title": "Ringkasan operasional",
    "dash.ringkasan.sub": "Kondisi toko kamu hari ini, dirangkum agent.",
    "dash.approval.title": "Approval queue",
    "dash.approval.sub": "Aksi berisiko yang ditahan sampai kamu putuskan.",
    "dash.inbox.title": "Inbox chat",
    "dash.inbox.sub": "Semua kanal dalam satu tempat, lengkap dengan jejak workflow.",
    "dash.katalog.title": "Katalog & stok",
    "dash.katalog.sub": "Data yang jadi sumber jawaban agent.",
    "dash.analitik.title": "Analitik",
    "dash.analitik.sub": "Tren percakapan, pesanan, dan performa agent.",
    "dash.benchmark.title": "Benchmark & Impact",
    "dash.benchmark.sub": "Bukti dampak terukur — manual vs agent, 32 percakapan uji.",
    "dash.pengaturan.title": "Pengaturan",
    "dash.pengaturan.sub": "Profil toko, siapa saja yang punya akses, dan aturan main agent.",

    // Demo page
    "demo.back": "Balik ke beranda",
    "demo.live": "Live · powered by stealth/ox-alpha",
    "demo.reset": "Reset",
    "demo.dashboard": "Dashboard owner",
    "demo.eyebrow": "Coba jadi pelanggan",
    "demo.h1": "Chat pelanggan di kiri, pipeline agent di kanan.",
    "demo.desc.a":
      "Setiap pesan yang kamu kirim langsung diproses via 7 tahap deterministik: intake → understanding → grounding → tool call → approval → response → analytics. Pesanan bakal muncul di",
    "demo.desc.link": "dashboard owner",
    "demo.desc.b":
      "buat kamu setujui — begitu disetujui, konfirmasinya balik lagi ke chat ini otomatis.",
    "demo.stat.cust": "Pesan kamu",
    "demo.stat.bot": "Balasan agent",
    "demo.stat.session": "Session id",
  },
  en: {
    "nav.problem": "Problem",
    "nav.how": "How it works",
    "nav.features": "Features",
    "nav.demoPreview": "Demo Preview",
    "nav.login": "Sign in",
    "nav.tryDemo": "Try Live Demo",
    "nav.joinWaitlist": "Join Waitlist",
    "nav.langLabel": "Language",
    "nav.themeLight": "Switch to light mode",
    "nav.themeDark": "Switch to dark mode",

    "hero.badge": "AI Hackfest 2026 · Operational Agent",
    "hero.h1.a": "An AI agent that doesn't just",
    "hero.h1.strike": "reply",
    "hero.h1.b": ", but",
    "hero.h1.emph": "acts",
    "hero.desc":
      "TuntasUMKM replies to customer chats, checks stock, and drafts orders for your shop — automatically. Risky actions still wait for your one-tap approval.",
    "hero.ctaPrimary": "Try Interactive Demo",
    "hero.ctaSecondary": "See how it works",
    "hero.stat.time": "average reply",
    "hero.stat.pipeline": "agent pipeline",
    "hero.stat.approve": "risky actions approved",

    "footer.tagline": "AI Operational Agent for Indonesian SMEs. Built for AI Hackfest 2026.",
    "footer.col.product": "Product",
    "footer.col.docs": "Documents",
    "footer.copy": "© 2026 TuntasUMKM · Research team · Hackathon prototype",
    "footer.madeIn": "Made in Indonesia 🇮🇩",

    "dash.ringkasan.title": "Operational summary",
    "dash.ringkasan.sub": "Your shop's condition today, summarised by the agent.",
    "dash.approval.title": "Approval queue",
    "dash.approval.sub": "Risky actions on hold until you decide.",
    "dash.inbox.title": "Chat inbox",
    "dash.inbox.sub": "All channels in one place, with full workflow traces.",
    "dash.katalog.title": "Catalog & stock",
    "dash.katalog.sub": "The data that grounds the agent's answers.",
    "dash.analitik.title": "Analytics",
    "dash.analitik.sub": "Conversation, order, and agent performance trends.",
    "dash.benchmark.title": "Benchmark & Impact",
    "dash.benchmark.sub": "Measurable proof — manual vs agent across 32 synthetic conversations.",
    "dash.pengaturan.title": "Settings",
    "dash.pengaturan.sub": "Store profile, who has access, and the agent's ground rules.",

    "demo.back": "Back to home",
    "demo.live": "Live · powered by stealth/ox-alpha",
    "demo.reset": "Reset",
    "demo.dashboard": "Owner dashboard",
    "demo.eyebrow": "Play the customer",
    "demo.h1": "Customer chat on the left, agent pipeline on the right.",
    "demo.desc.a":
      "Every message runs through 7 deterministic stages: intake → understanding → grounding → tool call → approval → response → analytics. Orders show up in the",
    "demo.desc.link": "owner dashboard",
    "demo.desc.b":
      "for you to approve — once approved, the confirmation is sent back to this chat automatically.",
    "demo.stat.cust": "Your messages",
    "demo.stat.bot": "Agent replies",
    "demo.stat.session": "Session id",
  },
};

export const LANGS = [
  { code: "id", label: "ID", full: "Bahasa Indonesia" },
  { code: "en", label: "EN", full: "English" },
];

const readLang = () => {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "id" || v === "en") return v;
  } catch {
    // ignore
  }
  return "id";
};

const I18nContext = createContext({ lang: "id", setLang: () => {}, t: (k) => k });

export const I18nProvider = ({ children }) => {
  const [lang, setLangState] = useState("id");

  useEffect(() => {
    setLangState(readLang());
  }, []);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem(KEY, next);
      document.documentElement.setAttribute("lang", next);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key) => {
      const table = dict[lang] || dict.id;
      return table[key] ?? dict.id[key] ?? key;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
export const useT = () => useContext(I18nContext).t;
