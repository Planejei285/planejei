import { useEffect, useMemo, useState } from "react";

export type AppUser = {
  name: string;
  email: string;
  createdAt: string;
};

const USER_KEY = "planejei-user";
const ADMIN_KEY = "planejei-admin-session";
const PLAN_KEY = "planejei-plan";

export function getStoredUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AppUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
}

export function setAdminSession(enabled: boolean) {
  if (enabled) {
    localStorage.setItem(ADMIN_KEY, "true");
  } else {
    localStorage.removeItem(ADMIN_KEY);
  }
}

export function hasAdminSession() {
  return localStorage.getItem(ADMIN_KEY) === "true";
}

export function getStoredPlan(): "free" | "basic" | "premium" {
  const raw = localStorage.getItem(PLAN_KEY);
  if (raw === "basic" || raw === "premium") return raw;
  return "free";
}

export function setStoredPlan(plan: "free" | "basic" | "premium") {
  localStorage.setItem(PLAN_KEY, plan);
}

export function useLocalUserAuth() {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const api = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: (name: string, email: string) => {
        const newUser = {
          name,
          email,
          createdAt: new Date().toISOString(),
        } satisfies AppUser;
        setStoredUser(newUser);
        setUser(newUser);
      },
      logout: () => {
        clearStoredUser();
        setUser(null);
      },
      refresh: () => setUser(getStoredUser()),
    }),
    [user]
  );

  return api;
}
