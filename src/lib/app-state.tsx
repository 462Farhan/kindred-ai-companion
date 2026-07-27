import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "./mock-data";

type Theme = "light" | "dark";

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  role: Role;
  setRole: (role: Role) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [role, setRoleState] = useState<Role>("user");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("aps-theme") as Theme | null;
    const storedRole = window.localStorage.getItem("aps-role") as Role | null;
    if (storedTheme) setTheme(storedTheme);
    if (storedRole) setRoleState(storedRole);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      window.localStorage.setItem("aps-theme", next);
      return next;
    });
  }, []);

  const setRole = useCallback((next: Role) => {
    setRoleState(next);
    window.localStorage.setItem("aps-role", next);
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme, role, setRole }), [theme, toggleTheme, role, setRole]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
