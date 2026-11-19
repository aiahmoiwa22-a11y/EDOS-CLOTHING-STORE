import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SocialLinks } from "@/components/SocialLinks";
import { WhatsAppIcon } from "@/components/icons";
import { site } from "@/data/site";
import { saveOrder } from "@/lib/orders";
import { openWhatsApp } from "@/lib/whatsapp";

const details = [
  { icon: Phone, label: "Phone / WhatsApp", value: site.phoneDisplay, href: `tel:+${site.whatsappNumber}` },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: MapPin, label: "Visit us", value: site.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}` },
  { icon: Clock, label: "Opening hours", value: site.hours },
];

export default function Contact() {
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!f.name.trim()) err.name = "Please enter your name";
    if (f.message.trim().length < 5) err.message = "Please write a short message";
    setErrors(err);
    if (Object.keys(err).length) return;
    const message = `Hello Edos Clothing & Design! My name is ${f.name.trim()}${f.phone ? ` (${f.phone.trim()})` : ""}.\n\n${f.message.trim()}`;
    saveOrder({ kind: "contact", customerName: f.name.trim(), phone: f.phone.trim(), summary: f.message.trim().slice(0, 80), details: message });
    openWhatsApp(message);
    toast.success("WhatsApp is opening — press send to deliver your message.");
  }

  return (
    <div className="container-x pb-24 pt-32">
      <p className="eyebrow mb-3">Get in touch</p>
      <h1 className="section-title">Contact <span className="text-primary">us</span></h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Questions, fittings or a special request? Message us — WhatsApp is the fastest way to reach the studio.</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <ul className="space-y-4">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="lux-card flex items-start gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" strokeWidth={1.6} /></span>
                <div><p className="text-[10px] uppercase tracking-[0.18em] text-gold-dim">{label}</p>
                  {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="transition-colors hover:text-primary">{value}</a> : <p>{value}</p>}</div>
              </li>
            ))}
          </ul>
          <h2 className="mb-4 mt-10 font-display text-2xl font-semibold">Find us on social media</h2>
          <SocialLinks variant="pills" />
        </div>

        <form onSubmit={submit} noValidate className="lux-card h-fit space-y-5 p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold">Send a message</h2>
          <div><Label htmlFor="k-name">Your name *</Label><Input id="k-name" value={f.name} onChange={(e) => { setF({ ...f, name: e.target.value }); setErrors({ ...errors, name: "" }); }} autoComplete="name" className="mt-1.5" />{errors.name && <p className="mt-1 text-xs text-destructive" role="alert">{errors.name}</p>}</div>
          <div><Label htmlFor="k-phone">Phone (optional)</Label><Input id="k-phone" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" className="mt-1.5" /></div>
          <div><Label htmlFor="k-msg">Message *</Label><Textarea id="k-msg" rows={5} value={f.message} onChange={(e) => { setF({ ...f, message: e.target.value }); setErrors({ ...errors, message: "" }); }} className="mt-1.5" />{errors.message && <p className="mt-1 text-xs text-destructive" role="alert">{errors.message}</p>}</div>
          <Button type="submit" size="lg" className="h-12 w-full bg-[#25D366] text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#1fb857]"><WhatsAppIcon className="mr-2 h-5 w-5" /> Send on WhatsApp</Button>
        </form>
      </div>

      {/* Store information — sample wording, edit to match the shop's real policies */}
      <div className="mt-20 grid gap-5 md:grid-cols-3">
        <section id="payments" className="lux-card scroll-mt-28 p-6">
          <h2 className="font-display text-2xl font-semibold">Payment options</h2>
          <p className="mt-2 text-sm text-muted-foreground">Prices are shown in US Dollars ($) and Sierra Leone Leones (Le) — switch currency at the top of the page. Payment is arranged with us directly after your order is confirmed.</p>
          <ul className="mt-4 flex flex-wrap gap-2">{site.paymentMethods.map((p) => <li key={p} className="rounded-md border border-border bg-secondary px-3 py-1 text-xs">{p}</li>)}</ul>
        </section>
        <section id="delivery" className="lux-card scroll-mt-28 p-6">
          <h2 className="font-display text-2xl font-semibold">Shipping &amp; delivery</h2>
          <p className="mt-2 text-sm text-muted-foreground">Every garment is made to order. We confirm your ready date when you order, and deliver within Freetown or arrange pickup at the shop. Delivery outside Freetown is arranged case by case.</p>
        </section>
        <section id="returns" className="lux-card scroll-mt-28 p-6">
          <h2 className="font-display text-2xl font-semibold">Returns &amp; alterations</h2>
          <p className="mt-2 text-sm text-muted-foreground">Because each piece is sewn for you, we include a fitting check and free adjustments on fit. Tell us within a few days if anything needs changing and we'll make it right.</p>
        </section>
      </div>
    </div>
  );
}
