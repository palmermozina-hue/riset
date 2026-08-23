import { useState } from "react";
import { SETTINGS } from "@/constants/testIds";
import { StoreProfile } from "./settings/StoreProfile";
import { UserManagement } from "./settings/UserManagement";
import { AgentPreferences } from "./settings/AgentPreferences";

const TABS = [
  { id: "profil", label: "Profil Toko" },
  { id: "tim", label: "Tim & Akses" },
  { id: "agent", label: "Preferensi Agent" },
];

export const Settings = () => {
  const [tab, setTab] = useState("tim");

  return (
    <div className="space-y-7" data-testid={SETTINGS.page}>
      <div className="inline-flex flex-wrap gap-1 rounded-full border border-stone-200 bg-white p-1 dark:border-stone-800 dark:bg-stone-900">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            data-testid={SETTINGS.tab(t.id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-emerald-900 text-white"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profil" && <StoreProfile />}
      {tab === "tim" && <UserManagement />}
      {tab === "agent" && <AgentPreferences />}
    </div>
  );
};
