// Mock auth: disimpan di localStorage, belum ada backend.
const KEY = "tuntas_user";

export const getUser = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const signIn = ({ name, email, provider = "email" }) => {
  const user = {
    name: name || email.split("@")[0],
    email,
    provider,
    storeName: "Warung Kopi Senja",
    loggedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
};

// Mock Google sign-in — belum nempel ke OAuth beneran, cuma simulasi popup.
export const GOOGLE_DEMO_ACCOUNT = {
  name: "Rina Pratiwi",
  email: "rina@warungkopisenja.id",
};

export const signInWithGoogle = () =>
  signIn({ ...GOOGLE_DEMO_ACCOUNT, provider: "google" });

export const updateUser = (patch) => {
  const current = getUser();
  if (!current) return null;
  const next = { ...current, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const signOut = () => localStorage.removeItem(KEY);
