// Cross-page mock store: menghubungkan customer chat (/demo) ↔ owner dashboard.
// Persistensi via localStorage supaya approval baru dari chat tetap muncul
// setelah owner navigasi ke /dashboard. Semua pure client-side, no backend.
import { APPROVALS } from "@/data/mockDashboard";

const APPROVAL_KEY = "tuntas.demo.approvals.v1";
const CONV_KEY = "tuntas.demo.conversation.v1";
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

export const subscribeStore = (fn) => {
  listeners.add(fn);
  const onStorage = (e) => {
    if (e.key === APPROVAL_KEY || e.key === CONV_KEY) fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
};
