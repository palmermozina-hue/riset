import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Package,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { DASHBOARD, LOGOUT } from "@/constants/testIds";
import { signOut } from "@/lib/mockAuth";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export const NAV = [
  { id: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  { id: "approval", label: "Approval Queue", icon: ClipboardCheck, badgeKey: "approval" },
  { id: "inbox", label: "Inbox Chat", icon: MessagesSquare, badgeKey: "inbox" },
  { id: "katalog", label: "Katalog & Stok", icon: Package },
  { id: "analitik", label: "Analitik", icon: BarChart3 },
];

export const Shell = ({ active, onChange, badges, user, children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    signOut();
    toast.success("Kamu udah keluar. Sampai nanti!");
    navigate("/auth");
  };

  const navList = (mobile = false) => (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        const badge = item.badgeKey ? badges?.[item.badgeKey] : 0;
        return (
          <button
            key={item.id}
            onClick={() => {
              onChange(item.id);
              setOpen(false);
            }}
            data-testid={mobile ? `${DASHBOARD.navItem(item.id)}-mobile` : DASHBOARD.navItem(item.id)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-white/10 text-white"
                : "text-emerald-100/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={18} strokeWidth={2} />
            <span className="flex-1 text-left">{item.label}</span>
            {badge > 0 && (
              <span className="rounded-full bg-orange-600 px-2 py-0.5 text-[11px] font-bold text-white">
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950" data-testid={DASHBOARD.page}>
      {/* Sidebar desktop */}
      <aside
        className="fixed inset-y-0 left-0 hidden w-[264px] flex-col justify-between bg-emerald-950 p-5 lg:flex"
        data-testid={DASHBOARD.sidebar}
      >
        <div>
          <Link to="/" className="mb-9 flex items-center gap-2.5 px-1">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-600 text-white">
              <Zap size={18} strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Tuntas<span className="text-orange-500">UMKM</span>
            </span>
          </Link>
          {navList()}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
            Agent status
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm font-semibold text-white">Aktif — 3 kanal</span>
          </div>
          <button
            onClick={logout}
            data-testid={LOGOUT.button}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition-colors hover:bg-white/10"
          >
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </aside>

      {/* Topbar */}
      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-stone-200 bg-white/80 px-5 py-3.5 backdrop-blur-xl lg:px-9 dark:border-stone-800 dark:bg-stone-900/80">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              data-testid={DASHBOARD.mobileToggle}
              aria-label="Menu dashboard"
              className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <p className="font-display text-base font-bold tracking-tight text-stone-900">
                {user?.storeName || "Toko kamu"}
              </p>
              <p className="text-xs text-stone-500">Senin, 8 Juni 2026 · shift pagi</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <ThemeToggle inline />
            <button
              onClick={() => toast.info(`${badges?.approval || 0} aksi masih nunggu persetujuan kamu.`)}
              data-testid="dashboard-notif-button"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-stone-200 text-stone-600 transition-colors hover:border-emerald-800 hover:text-emerald-900"
              aria-label="Notifikasi"
            >
              <Bell size={17} />
              {badges?.approval > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                  {badges.approval}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2.5 rounded-full border border-stone-200 bg-white py-1.5 pl-1.5 pr-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-900 text-xs font-bold text-white">
                {(user?.name || "R")[0].toUpperCase()}
              </span>
              <span className="hidden text-sm font-semibold text-stone-800 sm:block" data-testid="dashboard-user-name">
                {user?.name || "Owner"}
              </span>
            </div>
          </div>
        </header>

        {open && (
          <div className="border-b border-emerald-900 bg-emerald-950 px-5 py-4 lg:hidden">
            {navList(true)}
            <button
              onClick={logout}
              data-testid="logout-button-mobile"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-emerald-100"
            >
              <LogOut size={15} /> Keluar
            </button>
          </div>
        )}

        <main className="px-5 py-8 lg:px-9 lg:py-10">{children}</main>
      </div>
    </div>
  );
};
