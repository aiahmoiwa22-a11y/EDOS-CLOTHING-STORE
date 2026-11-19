import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { mailtoUrl } from "@/lib/whatsapp";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (site.newsletterEndpoint) {
      setBusy(true);
      try {
        const res = await fetch(site.newsletterEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email: value }),
        });
        if (!res.ok) throw new Error("bad status");
        toast.success("You're subscribed. Thank you!");
        setEmail("");
      } catch {
        toast.error("Could not subscribe right now. Please try again.");
      } finally {
        setBusy(false);
      }
      return;
    }
    // No newsletter service connected yet: open an email to the shop instead.
    window.location.href = mailtoUrl("Newsletter sign-up", `Please add ${value} to the Edos newsletter list.`);
    toast.success("Your email app will open — just press send to subscribe.");
  }

  return (
    <form onSubmit={onSubmit} className={className} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <div className="flex">
        <Input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="h-11 rounded-r-none border-r-0 bg-card"
        />
        <Button type="submit" disabled={busy} className="h-11 rounded-l-none px-6 text-xs font-semibold uppercase tracking-widest">
          {busy ? "..." : "Subscribe"}
        </Button>
      </div>
    </form>
  );
}
