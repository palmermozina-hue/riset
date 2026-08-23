// Cross-page store — sekarang API-backed (MongoDB source of truth).
// Interface tetap sama supaya konsumen lama (`CustomerDemo`, `OwnerDashboard`,
// `Inbox`) nggak perlu diubah. localStorage cuma jadi cache buat startup
// instan; tulisan write-through ke backend + polling untuk sinkron antar tab.
import axios from "axios";
import { APPROVALS } from "@/data/mockDashboard";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const APPROVAL_KEY = "tuntas.demo.approvals.v1";
const CONV_KEY = "tuntas.demo.conversation.v1";
const LIVE_KEY = "tuntas.demo.liveSession.v1";
const OWNER_SESSIONS_KEY = "tuntas.demo.ownerSessions.v1"; // session id yang harus di-drain di client ini

const listeners = new Set();
let pendingOwnerEvents = []; // di-hydrate dari backend polling

const readLS = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const writeLS = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    // ignore quota
  }
};

const notify = () => listeners.forEach((fn) => fn());

// ---------------------------------------------------------------------------
// Session id — kita perlu ini juga di sisi store buat polling owner-events.
// ---------------------------------------------------------------------------
const SESSION_KEY = "tuntas.demo.sessionId.v1";
export const getSessionId = () => {
  let id = readLS(SESSION_KEY, null);
  if (!id) {
    id = `#${Math.floor(4800 + Math.random() * 400)}`;
    writeLS(SESSION_KEY, id);
  }
  return id;
};

// ---------------------------------------------------------------------------
// Approvals
// ---------------------------------------------------------------------------
export const getApprovals = () => readLS(APPROVAL_KEY, APPROVALS);

const setApprovals = (list) => {
  writeLS(APPROVAL_KEY, list);
  notify();
};

export const addApproval = (approval) => {
  const current = getApprovals();
  const next = [approval, ...current.filter((a) => a.id !== approval.id)];
  setApprovals(next);
  return next;
};

export const removeApproval = (id) => {
  setApprovals(getApprovals().filter((a) => a.id !== id));
};

export const resetApprovals = () => setApprovals(APPROVALS);

// Push owner decision — sekarang benar-benar hit backend. Backend akan
// menghasilkan owner_event yang dikonsumsi lewat polling di sisi customer.
export const pushOwnerEvent = async (evt) => {
  removeApproval(evt.id);
  try {
    await axios.post(`${API}/agent/approvals/${evt.id}/decide`, {
      decision: evt.decision,
      reason: evt.reason,
    });
  } catch (err) {
    // Kalau backend nggak kenal ID (mis. approval seed lama), tetap fallback
    // ke pola lama supaya UX di /dashboard nggak stuck.
    if (!err?.response || err.response?.status !== 404) {
      // eslint-disable-next-line no-console
      console.warn("decide approval gagal, lanjut mode lokal:", err?.message);
    }
    pendingOwnerEvents.push({ ...evt, ts: Date.now() });
    notify();
  }
};

// ---------------------------------------------------------------------------
// Conversation — write-through ke backend, cache di localStorage
// ---------------------------------------------------------------------------
export const getConversation = () => readLS(CONV_KEY, []);

export const saveConversation = (msgs) => {
  writeLS(CONV_KEY, msgs);
  const sid = getSessionId();
  axios
    .put(`${API}/agent/conversations/${encodeURIComponent(sid)}`, { messages: msgs })
    .catch((e) => console.warn("saveConversation gagal:", e?.message));
  notify();
};

export const clearConversation = () => {
  writeLS(CONV_KEY, []);
  const sid = getSessionId();
  axios
    .post(`${API}/agent/conversations/${encodeURIComponent(sid)}/reset`)
    .catch((e) => console.warn("resetConversation gagal:", e?.message));
  notify();
};

// ---------------------------------------------------------------------------
// Owner events — sekarang di-poll dari backend
// ---------------------------------------------------------------------------
export const consumeOwnerEvents = () => {
  const events = pendingOwnerEvents;
  pendingOwnerEvents = [];
  return events;
};

export const clearOwnerEvents = () => {
  pendingOwnerEvents = [];
};

// ---------------------------------------------------------------------------
// Live session
// ---------------------------------------------------------------------------
export const saveLiveSession = (session) => {
  writeLS(LIVE_KEY, session);
  axios
    .put(`${API}/agent/live-session`, session)
    .catch((e) => console.warn("saveLiveSession gagal:", e?.message));
  notify();
};

export const getLiveSession = () => readLS(LIVE_KEY, null);
export const clearLiveSession = () => writeLS(LIVE_KEY, null);

// ---------------------------------------------------------------------------
// Hydrate + polling
// ---------------------------------------------------------------------------
let started = false;
const startBackgroundSync = () => {
  if (started || typeof window === "undefined") return;
  started = true;

  const hydrateApprovals = async () => {
    try {
      const res = await axios.get(`${API}/agent/approvals?status=pending`);
      const list = (res.data?.approvals || []).map((a) => ({
        id: a.id,
        customer: a.customer,
        channel: a.channel,
        action: a.action,
        risk: a.risk,
        createdAt: a.createdAt,
        total: a.total,
        items: a.items || [],
        note: a.note,
      }));
      writeLS(APPROVAL_KEY, list);
      notify();
    } catch (e) {
      // silent — pakai cache localStorage
    }
  };

  const hydrateConversation = async () => {
    try {
      const sid = getSessionId();
      const res = await axios.get(`${API}/agent/conversations/${encodeURIComponent(sid)}`);
      const remote = res.data?.messages || [];
      const local = getConversation();
      if (remote.length > local.length) {
        writeLS(CONV_KEY, remote);
        notify();
      }
    } catch (e) {
      // ignore
    }
  };

  const hydrateLive = async () => {
    try {
      const res = await axios.get(`${API}/agent/live-session`);
      if (res.data) {
        writeLS(LIVE_KEY, res.data);
        notify();
      }
    } catch (e) {
      // ignore
    }
  };

  const pollOwnerEvents = async () => {
    try {
      const sid = getSessionId();
      const res = await axios.get(
        `${API}/agent/owner-events?session_id=${encodeURIComponent(sid)}&consume=true`,
      );
      const events = res.data?.events || [];
      if (events.length) {
        events.forEach((e) =>
          pendingOwnerEvents.push({
            id: e.approval_id,
            decision: e.decision,
            customer: e.customer,
            total: e.total,
            reason: e.reason,
            ts: Date.now(),
          }),
        );
        notify();
      }
    } catch (e) {
      // ignore
    }
  };

  // Hydrate awal
  hydrateApprovals();
  hydrateConversation();
  hydrateLive();

  // Polling — 2.5 dtk cukup responsif buat demo, hemat request
  setInterval(hydrateApprovals, 3000);
  setInterval(hydrateLive, 3000);
  setInterval(pollOwnerEvents, 2500);
};

if (typeof window !== "undefined") {
  startBackgroundSync();
}

export const subscribeStore = (fn) => {
  listeners.add(fn);
  const onStorage = (e) => {
    if (!e.key || e.key.startsWith("tuntas.demo.")) fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
};
