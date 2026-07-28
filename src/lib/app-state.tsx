import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "./mock-data";

type Theme = "light" | "dark";

export interface UserProfile {
  handle: string;
  email: string;
  pronouns: string;
  timezone: string;
  bio: string;
  memberSince: string;
}

const defaultProfile: UserProfile = {
  handle: "user-8812",
  email: "member@example.com",
  pronouns: "",
  timezone: "Europe/Berlin",
  bio: "",
  memberSince: "Jan 2025",
};

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  role: Role;
  setRole: (role: Role) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
}

const AppStateContext = createContext<AppState | null>(null);

function loadProfile(): UserProfile {
  try {
    const stored = window.localStorage.getItem("aps-profile");
    if (stored) {
      return { ...defaultProfile, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return defaultProfile;
}

function saveProfile(profile: UserProfile) {
  window.localStorage.setItem("aps-profile", JSON.stringify(profile));
}

export function sendWelcomeEmail(email: string, handle: string) {
  // In a real app, this would call a backend API to send an email.
  // For now, we log it and store a flag so it only fires once per account.
  const sentKey = `aps-welcome-sent-${email}`;
  if (window.localStorage.getItem(sentKey)) {
    return false; // Already sent
  }

  // Simulate sending the welcome email
  console.log(`[PeerBridge] Welcome email sent to ${email}`);
  console.log(`
    ─────────────────────────────────────────
    To: ${email}
    Subject: Welcome to PeerBridge, @${handle}! 🌱

    Hi @${handle},

    Welcome to PeerBridge — your anonymous peer support community.

    Here's how to get started:
    • Complete your profile and set your privacy preferences
    • Explore our resource library for guided exercises
    • Start a conversation with our AI companion, Aria
    • When you're ready, connect with a trained peer supporter

    Quick links:
    - Getting Started Guide: /resources
    - AI Chat: /ai-chat
    - Peer Support: /peer-chat
    - Settings & Privacy: /settings

    Remember: Your identity stays anonymous. Supporters only see your handle.

    Take care,
    The PeerBridge Team

    ⚠️ This is a community support platform, not an emergency service.
    If you're in crisis, please contact your local emergency services.
    ─────────────────────────────────────────
  `);

  window.localStorage.setItem(sentKey, "true");
  return true; // Email was "sent"
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [role, setRoleState] = useState<Role>("user");
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("aps-theme") as Theme | null;
    const storedRole = window.localStorage.getItem("aps-role") as Role | null;
    const storedLoggedIn = window.localStorage.getItem("aps-logged-in");
    if (storedTheme) setTheme(storedTheme);
    if (storedRole) setRoleState(storedRole);
    if (storedLoggedIn === "true") setIsLoggedIn(true);
    setProfile(loadProfile());
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

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      saveProfile(next);
      return next;
    });
  }, []);

  const setIsLoggedInPersist = useCallback((v: boolean) => {
    setIsLoggedIn(v);
    window.localStorage.setItem("aps-logged-in", String(v));
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, role, setRole, profile, updateProfile, isLoggedIn, setIsLoggedIn: setIsLoggedInPersist }),
    [theme, toggleTheme, role, setRole, profile, updateProfile, isLoggedIn, setIsLoggedInPersist],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}