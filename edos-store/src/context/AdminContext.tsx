import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isLive, supabase } from "@/lib/supabase";

/**
 * DEMO ADMIN LOGIN — used ONLY when the site is not connected to Supabase.
 * (These credentials are visible in the code, so they are for testing only.)
 * When Supabase is connected, the admin signs in with a real account instead.
 */
export const DEMO_ADMIN = { email: "admin@edos.demo", password: "edos2026" };

interface AdminCtx {
  isAdmin: boolean;
  /** true while we check whether someone is already signed in */
  checking: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const Ctx = createContext<AdminCtx | null>(null);
const KEY = "edos:admin-session";

/** A signed-in user only counts as admin if their id is in the `admins` table. */
async function isListedAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase!.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  return !!data;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (isLive) return false;
    try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; }
  });
  const [checking, setChecking] = useState<boolean>(isLive);

  useEffect(() => {
    if (!isLive || !supabase) return;
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id;
      const ok = uid ? await isListedAdmin(uid) : false;
      if (!cancelled) { setIsAdmin(ok); setChecking(false); }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") setIsAdmin(false);
      if (event === "TOKEN_REFRESHED" && !session) setIsAdmin(false);
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (isLive && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error || !data.user) return false;
      const ok = await isListedAdmin(data.user.id);
      if (!ok) { await supabase.auth.signOut(); return false; }
      setIsAdmin(true);
      return true;
    }
    const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
    if (ok) {
      setIsAdmin(true);
      try { sessionStorage.setItem(KEY, "1"); } catch { /* ignore */ }
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    if (isLive && supabase) void supabase.auth.signOut();
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  }, []);

  const value = useMemo(() => ({ isAdmin, checking, login, logout }), [isAdmin, checking, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdmin must be used inside AdminProvider");
  return c;
}
