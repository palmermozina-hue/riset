// Cross-page mock store: menghubungkan customer chat (/demo) ↔ owner dashboard.
// Persistensi via localStorage supaya approval baru dari chat tetap muncul
// setelah owner navigasi ke /dashboard. Semua pure client-side, no backend.
import { APPROVALS } from "@/data/mockDashboard";

const APPROVAL_KEY = "tuntas.demo.approvals.v1";
const CONV_KEY = "tuntas.demo.conversation.v1";
const EVENT_KEY = "tuntas.demo.ownerEvents.v1";
const LIVE_KEY = "tuntas.demo.liveSession.v1";
const listeners = new Set();

const read = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    // ignore
  }
  listeners.forEach((fn) => fn());
};

export const getApprovals = () => {
  const seeded = read(APPROVAL_KEY, null);
  if (seeded) return seeded;
  write(APPROVAL_KEY, APPROVALS);
  return APPROVALS;
};

export const addApproval = (approval) => {
  const current = getApprovals();
  const next = [approval, ...current.filter((a) => a.id !== approval.id)];
  write(APPROVAL_KEY, next);
  return next;
};

export const removeApproval = (id) => {
  const current = getApprovals();
  write(APPROVAL_KEY, current.filter((a) => a.id !== id));
};

export const resetApprovals = () => write(APPROVAL_KEY, APPROVALS);

export const getConversation = () => read(CONV_KEY, []);
export const saveConversation = (msgs) => write(CONV_KEY, msgs);
export const clearConversation = () => write(CONV_KEY, []);

// ---------------------------------------------------------------------------
// Owner reply loop — keputusan owner di /dashboard dikirim balik ke chat /demo
// ---------------------------------------------------------------------------

/** Owner menekan Setujui/Tolak → event antre buat dikonsumsi halaman /demo. */
export const pushOwnerEvent = (evt) => {
  const next = [...read(EVENT_KEY, []), { ...evt, consumed: false, ts: Date.now() }];
  write(EVENT_KEY, next);
  return next;
};

export const getOwnerEvents = () => read(EVENT_KEY, []);

/** Ambil event yang belum pernah ditampilkan di chat, lalu tandai sudah dipakai. */
export const consumeOwnerEvents = () => {
  const all = read(EVENT_KEY, []);
  const pending = all.filter((e) => !e.consumed);
  if (pending.length) write(EVENT_KEY, all.map((e) => ({ ...e, consumed: true })));
  return pending;
};

export const clearOwnerEvents = () => write(EVENT_KEY, []);

// ---------------------------------------------------------------------------
// Live session — percakapan /demo yang sedang berjalan, dibaca Trace Viewer
// di Inbox dashboard supaya owner/juri lihat jejak 7-tahap yang asli.
// ---------------------------------------------------------------------------

export const saveLiveSession = (session) => write(LIVE_KEY, session);
export const getLiveSession = () => read(LIVE_KEY, null);
export const clearLiveSession = () => write(LIVE_KEY, null);

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
