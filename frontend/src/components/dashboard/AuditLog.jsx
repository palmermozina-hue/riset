import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ChevronDown,
  Download,
  FileSearch,
  Loader2,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { AUDIT } from "@/constants/testIds";
import { ACTION_META, ACTOR_META, STATUS_META } from "./audit/auditMeta";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PAGE = 40;

const ACTION_KEYS = Object.keys(ACTION_META);

const STATUS_OPTIONS = [
  { value: "all", label: "Semua status" },
  ...Object.entries(STATUS_META).map(([value, m]) => ({ value, label: m.label })),
];

const ACTOR_OPTIONS = [
  { value: "all", label: "Semua aktor" },
  ...Object.entries(ACTOR_META).map(([value, m]) => ({ value, label: m.label })),
];

const fmtTime = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const toCsv = (events) => {
  const head = ["waktu", "aktor", "aksi", "stage", "status", "ringkasan", "trace_id", "approval_id", "session_id"];
  const rows = events.map((e) =>
    [e.at, e.actor, e.action, e.stage, e.status, e.summary, e.trace_id, e.approval_id, e.session_id]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(","),
  );
  return [head.join(","), ...rows].join("\n");
};

export const AuditLog = () => {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [actions, setActions] = useState([]);
  const [status, setStatus] = useState("all");
  const [actor, setActor] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(id);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { limit, offset: 0 };
      if (debouncedQ) params.q = debouncedQ;
      if (actions.length) params.action = actions.join(",");
      if (status !== "all") params.status = status;
      if (actor !== "all") params.actor = actor;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      const res = await axios.get(`${API}/agent/audit-log`, { params });
      setData(res.data);
    } catch (e) {
      setError(e?.response?.data?.detail || "Gagal memuat audit log. Coba refresh.");
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, actions, status, actor, dateFrom, dateTo, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const events = data?.events || [];
  const counts = data?.counts_by_action || {};

  const resetFilters = () => {
    setQ("");
    setActions([]);
    setStatus("all");
    setActor("all");
    setDateFrom("");
    setDateTo("");
    setLimit(PAGE);
  };

  const toggleAction = (key) => {
    setLimit(PAGE);
    setActions((prev) => (prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]));
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(events)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tuntasumkm-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtersActive =
    Boolean(q || dateFrom || dateTo) || actions.length > 0 || status !== "all" || actor !== "all";

  const statusSummary = useMemo(
    () => Object.entries(data?.counts_by_status || {}).sort((a, b) => b[1] - a[1]),
    [data],
  );

  return (
    <div className="space-y-6" data-testid={AUDIT.page}>
      {/* Header */}
      <div
        className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800 dark:bg-stone-900"
        data-testid={AUDIT.summary}
      >
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            <ShieldCheck size={13} /> Jejak audit
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-stone-900 dark:text-stone-100">
            Semua aksi agent, kronologis dan bisa ditelusuri
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
            Tool call, permintaan approval, keputusan owner, dan perubahan stok — dicatat berurutan
            dengan waktu, aktor, dan payload mentahnya.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              data-testid={AUDIT.total}
            >
              {data?.total ?? 0} event
              {filtersActive && data ? ` dari ${data.total_unfiltered}` : ""}
            </span>
            {statusSummary.map(([s, n]) => (
              <span
                key={s}
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  STATUS_META[s]?.chip || "bg-stone-100 text-stone-600"
                }`}
              >
                {STATUS_META[s]?.label || s}: {n}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={load}
            data-testid={AUDIT.refresh}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-emerald-800 hover:text-emerald-900 dark:border-stone-700 dark:text-stone-300"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <RotateCcw size={15} />} Refresh
          </button>
          <button
            onClick={exportCsv}
            disabled={!events.length}
            data-testid={AUDIT.exportCsv}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-50"
          >
            <Download size={15} /> CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="relative sm:col-span-2">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setLimit(PAGE);
              }}
              placeholder="Cari SKU, trace id, pesan pelanggan…"
              data-testid={AUDIT.search}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-3 text-sm text-stone-800 outline-none transition-colors focus:border-emerald-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setLimit(PAGE);
            }}
            data-testid={AUDIT.statusFilter}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={actor}
            onChange={(e) => {
              setActor(e.target.value);
              setLimit(PAGE);
            }}
            data-testid={AUDIT.actorFilter}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          >
            {ACTOR_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-stone-500">
            <span className="shrink-0 font-semibold">Dari</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setLimit(PAGE);
              }}
              data-testid={AUDIT.dateFrom}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-stone-500">
            <span className="shrink-0 font-semibold">Sampai</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setLimit(PAGE);
              }}
              data-testid={AUDIT.dateTo}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </label>
          <button
            onClick={resetFilters}
            data-testid={AUDIT.resetFilters}
            className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:border-orange-500 hover:text-orange-700 dark:border-stone-700 dark:text-stone-300"
          >
            Reset filter
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {ACTION_KEYS.map((key) => {
            const meta = ACTION_META[key];
            const on = actions.includes(key);
            const Icon = meta.icon;
            return (
              <button
                key={key}
                onClick={() => toggleAction(key)}
                data-testid={AUDIT.actionFilter(key)}
                aria-pressed={on}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  on
                    ? "border-emerald-900 bg-emerald-900 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-emerald-700 hover:text-emerald-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                }`}
              >
                <Icon size={13} /> {meta.label}
                {counts[key] ? (
                  <span className={on ? "text-emerald-200" : "text-stone-400"}>{counts[key]}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div
          className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
          data-testid={AUDIT.errorBox}
        >
          {error}
        </div>
      )}

      {/* Timeline */}
      <div
        className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
        data-testid={AUDIT.timeline}
      >
        {loading && !events.length && (
          <div className="py-12 text-center">
            <Loader2 className="mx-auto mb-3 animate-spin text-emerald-800" size={26} />
            <p className="text-sm text-stone-500">Memuat jejak audit…</p>
          </div>
        )}

        {!loading && !events.length && (
          <div className="py-12 text-center" data-testid={AUDIT.emptyState}>
            <FileSearch className="mx-auto mb-3 text-stone-400" size={28} />
            <p className="text-sm text-stone-500">
              Belum ada event yang cocok. Coba longgarkan filter, atau jalankan chat di halaman demo.
            </p>
          </div>
        )}

        <ol className="relative space-y-1">
          {events.map((e) => {
            const meta = ACTION_META[e.action] || {
              label: e.action,
              icon: FileSearch,
              dot: "bg-stone-400",
            };
            const Icon = meta.icon;
            const st = STATUS_META[e.status] || { label: e.status, chip: "bg-stone-100 text-stone-600" };
            const expanded = openId === e.event_id;
            return (
              <li key={e.event_id} data-testid={AUDIT.row(e.event_id)} className="relative pl-8">
                <span className="absolute left-[11px] top-9 h-[calc(100%-1.5rem)] w-px bg-stone-200 dark:bg-stone-700" />
                <span
                  className={`absolute left-1.5 top-3.5 grid h-5 w-5 place-items-center rounded-full text-white ${meta.dot}`}
                >
                  <Icon size={11} />
                </span>
                <button
                  onClick={() => setOpenId(expanded ? null : e.event_id)}
                  data-testid={AUDIT.rowToggle(e.event_id)}
                  aria-expanded={expanded}
                  className={`w-full rounded-2xl p-3 text-left transition-colors ${
                    expanded ? "bg-emerald-50 dark:bg-emerald-950/30" : "hover:bg-stone-50 dark:hover:bg-stone-800/60"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-stone-400">{fmtTime(e.at)}</span>
                    <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                      {meta.label}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${st.chip}`}>
                      {st.label}
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                      {ACTOR_META[e.actor]?.label || e.actor}
                    </span>
                    {e.duration_ms > 0 && (
                      <span className="font-mono text-[10px] text-stone-400">{e.duration_ms}ms</span>
                    )}
                    <ChevronDown
                      size={13}
                      className={`ml-auto text-stone-400 transition-transform duration-200 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">{e.summary}</p>
                </button>

                <div
                  data-testid={AUDIT.rowDetail(e.event_id)}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                    expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mb-2 ml-3 mt-1 space-y-2 rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/60">
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {[
                          ["Stage", e.stage],
                          ["Trace", e.trace_id],
                          ["Approval", e.approval_id],
                          ["Session", e.session_id],
                        ]
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <span
                              key={k}
                              className="rounded-full bg-white px-2.5 py-1 font-mono font-bold text-stone-600 ring-1 ring-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:ring-stone-700"
                            >
                              {k}: {String(v).slice(0, 20)}
                            </span>
                          ))}
                      </div>
                      <pre className="overflow-x-auto rounded-xl bg-stone-900 p-3 font-mono text-[11px] leading-relaxed text-emerald-200">
{JSON.stringify(e, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {data && data.total > events.length && (
          <button
            onClick={() => setLimit((l) => l + PAGE)}
            data-testid={AUDIT.loadMore}
            className="mt-5 w-full rounded-full border border-stone-200 py-3 text-sm font-semibold text-stone-600 transition-colors hover:border-emerald-800 hover:text-emerald-900 dark:border-stone-700 dark:text-stone-300"
          >
            Muat {Math.min(PAGE, data.total - events.length)} event lagi
          </button>
        )}
      </div>
    </div>
  );
};
