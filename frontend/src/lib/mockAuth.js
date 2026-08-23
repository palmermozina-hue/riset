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

export const signIn = ({ name, email }) => {
  const user = {
    name: name || email.split("@")[0],
    email,
    storeName: "Warung Kopi Senja",
    loggedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
};

export const signOut = () => localStorage.removeItem(KEY);
