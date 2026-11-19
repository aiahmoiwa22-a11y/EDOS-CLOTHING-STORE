import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { DEMO_ADMIN, useAdmin } from "@/context/AdminContext";
import { isLive } from "@/lib/supabase";

export default function AdminLogin() {
  const { isAdmin, checking, login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await login(email, password);
    setBusy(false);
    if (ok) navigate("/admin", { replace: true });
    else setError("That email or password isn't right, or this account is not an admin.");
  }

  return (
    <div className="pattern-dots flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <Logo className="mb-8" />
      <form onSubmit={submit} className="lux-card w-full max-w-sm space-y-5 p-7">
        <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Lock className="h-4 w-4" /></span><h1 className="font-display text-2xl font-semibold">Admin sign in</h1></div>

        {!isLive && <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-primary">Demo account</strong> — for testing only.<br />
          Email: <code className="text-foreground">{DEMO_ADMIN.email}</code><br />
          Password: <code className="text-foreground">{DEMO_ADMIN.password}</code>
          <Button type="button" variant="link" className="ml-1 h-auto p-0 text-xs" onClick={() => { setEmail(DEMO_ADMIN.email); setPassword(DEMO_ADMIN.password); setError(""); }}>Fill in</Button>
        </div>}

        <div><Label htmlFor="a-email">Email</Label><Input id="a-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} autoComplete="username" className="mt-1.5" /></div>
        <div><Label htmlFor="a-pass">Password</Label><Input id="a-pass" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} autoComplete="current-password" className="mt-1.5" /></div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <Button type="submit" disabled={busy || checking} className="h-11 w-full text-xs font-semibold uppercase tracking-[0.16em]">{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
      <Button asChild variant="ghost" className="mt-6 text-muted-foreground"><Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to the shop</Link></Button>
    </div>
  );
}
