import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * DEMO ADMIN LOGIN — for testing only.
 * These credentials are visible in the site code, so anyone who
 * opens the browser tools can read them. Before the site goes live
 * with real customers, replace this with a real login (Supabase Auth).
 */
export const DEMO_ADMIN = { email: "admin@edos.demo", password: "edos2026" };

interface AdminCtx {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const Ctx = createContext<AdminCtx | null>(null);
const KEY = "edos:admin-session";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; }
  });

  const login = useCallback((email: string, password: string) => {
    const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
    if (ok) {
      setIsAdmin(true);
      try { sessionStorage.setItem(KEY, "1"); } catch { /* ignore */ }
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  }, []);

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdmin must be used inside AdminProvider");
  return c;
}
