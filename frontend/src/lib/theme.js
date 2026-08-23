// Dark mode helper — class-based (tailwind darkMode: "class"), persist di localStorage.
const KEY = "tuntas.theme.v1";

export const getTheme = () => {
  try {
    return localStorage.getItem(KEY) || "light";
  } catch {
    return "light";
  }
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // ignore
  }
};

export const toggleTheme = () => {
  const next = getTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
};
