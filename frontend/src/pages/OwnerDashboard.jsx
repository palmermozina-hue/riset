import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Shell } from "@/components/dashboard/Shell";
import { Overview } from "@/components/dashboard/Overview";
import { ApprovalQueue } from "@/components/dashboard/ApprovalQueue";
import { Inbox } from "@/components/dashboard/Inbox";
import { Catalog } from "@/components/dashboard/Catalog";
import { Analytics } from "@/components/dashboard/Analytics";
import { CONVERSATIONS } from "@/data/mockDashboard";
import { DASHBOARD } from "@/constants/testIds";
import { getUser } from "@/lib/mockAuth";
import { getApprovals, pushOwnerEvent, removeApproval, subscribeStore } from "@/lib/mockStore";
import { useT } from "@/lib/i18n";

const HEADING_KEYS = ["ringkasan", "approval", "inbox", "katalog", "analitik"];

export default function OwnerDashboard() {
  const user = getUser();
  const t = useT();
  const [tab, setTab] = useState("ringkasan");
  const [queue, setQueue] = useState(() => getApprovals());
  const [history, setHistory] = useState([]);

  const unread = useMemo(() => CONVERSATIONS.reduce((s, c) => s + c.unread, 0), []);

  useEffect(() => {
    // Sinkronisasi kalau approval baru datang dari /demo
    const sync = () => setQueue(getApprovals());
    return subscribeStore(sync);
  }, []);

  if (!user) return <Navigate to="/auth" replace />;

  const decide = (item, decision) => {
    setQueue((q) => q.filter((x) => x.id !== item.id));
    setHistory((h) => [{ ...item, decision }, ...h]);
    removeApproval(item.id);
    // Owner reply loop — kirim keputusan balik ke chat pelanggan di /demo.
    pushOwnerEvent({
      id: item.id,
      decision,
      customer: item.customer,
      total: item.total,
      reason: decision === "reject" ? "stok lagi nggak mencukupi" : undefined,
    });
    if (decision === "approve") {
      toast.success(`${item.id} disetujui — konfirmasi terkirim ke chat pelanggan.`);
    } else {
      toast.info(`${item.id} ditolak. Agent kirim penjelasan sopan ke ${item.customer}.`);
    }
  };

  const title = t(`dash.${tab}.title`);
  const subtitle = t(`dash.${tab}.sub`);
  // touch HEADING_KEYS so linters keep import
  void HEADING_KEYS;

  return (
    <Shell
      active={tab}
      onChange={setTab}
      badges={{ approval: queue.length, inbox: unread }}
      user={user}
    >
      <div className="mb-8">
        <h1
          className="font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100"
          data-testid={DASHBOARD.sectionTitle}
        >
          {title}
        </h1>
        <p className="mt-2 text-base text-stone-600 dark:text-stone-400">{subtitle}</p>
      </div>

      {tab === "ringkasan" && (
        <Overview pendingCount={queue.length} onGoApproval={() => setTab("approval")} />
      )}
      {tab === "approval" && <ApprovalQueue items={queue} onDecide={decide} history={history} />}
      {tab === "inbox" && <Inbox />}
      {tab === "katalog" && <Catalog />}
      {tab === "analitik" && <Analytics />}
    </Shell>
  );
}
