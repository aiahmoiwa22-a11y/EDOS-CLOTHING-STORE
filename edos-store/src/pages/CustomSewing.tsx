import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, Mail, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { process } from "@/data/content";
import { buildCustomMessage, type CustomRequest } from "@/lib/messages";
import { saveOrder } from "@/lib/orders";
import { mailtoUrl, openWhatsApp, whatsappUrl } from "@/lib/whatsapp";

const orderTypes = [
  "Senator wear (men)", "Agbada (men)", "Kaftan / traditional (men)", "Aso ebi (women)", "Boubou / lace dress (women)",
  "Wedding attire", "Couple matching set", "Children's Ankara", "Alterations / repair", "Something else",
];
const measureFields = ["Chest / bust", "Waist", "Hips", "Shoulder width", "Sleeve length", "Top length", "Trouser / skirt length", "Height"];

export default function CustomSewing() {
  const [params] = useSearchParams();
  const design = params.get("design");
  const [f, setF] = useState({
    name: "", phone: "", email: "", orderType: "", occasion: "", eventDate: "", fabric: "", budget: "",
    description: design ? `I'd like a custom version of “${design}”.\n` : "",
  });
  const [m, setM] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<{ id: string; message: string; name: string } | null>(null);

  const set = (k: keyof typeof f, v: string) => { setF((x) => ({ ...x, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  function validate(): CustomRequest | null {
    const err: Record<string, string> = {};
    if (!f.name.trim()) err.name = "Please enter your name";
    if (f.phone.replace(/\D/g, "").length < 7) err.phone = "Please enter a phone number we can reach";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) err.email = "That email doesn't look right";
    if (!f.orderType) err.orderType = "Please choose what you'd like made";
    if (f.description.trim().length < 10) err.description = "Tell us a little about the design (a sentence is enough)";
    setErrors(err);
    if (Object.keys(err).length) { toast.error("Please check the highlighted fields."); return null; }
    return { ...f, name: f.name.trim(), measurements: m };
  }

  function submit(e: FormEvent, via: "whatsapp" | "email") {
    e.preventDefault();
    const req = validate();
    if (!req) return;
    const message = buildCustomMessage(req);
    const rec = saveOrder({ kind: "custom-sewing", customerName: req.name, phone: req.phone, summary: `${req.orderType}${req.occasion ? ` — ${req.occasion}` : ""}`, details: message });
    setSent({ id: rec.id, message, name: req.name });
    if (via === "whatsapp") openWhatsApp(message);
    else window.location.href = mailtoUrl(`Custom sewing request — ${req.name}`, message);
  }

  const err = (k: string) => errors[k] ? <p className="mt-1 text-xs text-destructive" role="alert">{errors[k]}</p> : null;

  return (
    <div className="container-x pb-24 pt-32">
      <p className="eyebrow mb-3">Custom sewing</p>
      <h1 className="section-title">Place your <span className="text-primary">order</span></h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Have a design in mind? Tell us about it and we'll bring it to life. Your request opens in WhatsApp — attach any reference photos there.</p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        {sent ? (
          <div className="lux-card flex flex-col items-center gap-4 p-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-primary" />
            <h2 className="font-display text-3xl">Almost done, {sent.name.split(" ")[0]}!</h2>
            <p className="max-w-sm text-muted-foreground"><strong className="text-foreground">Press send in WhatsApp</strong> (and attach your reference photos) so we receive your request. We'll reply to confirm fabric, price and timeline. Reference: {sent.id}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild><a href={whatsappUrl(sent.message)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="mr-2 h-4 w-4" /> Open WhatsApp again</a></Button>
              <Button variant="outline" onClick={() => setSent(null)}>Edit my request</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => submit(e, "whatsapp")} noValidate className="lux-card space-y-5 p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div><Label htmlFor="s-name">Full name *</Label><Input id="s-name" value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} className="mt-1.5" />{err("name")}</div>
              <div><Label htmlFor="s-phone">Phone / WhatsApp *</Label><Input id="s-phone" type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+232 76 000000" autoComplete="tel" aria-invalid={!!errors.phone} className="mt-1.5" />{err("phone")}</div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><Label htmlFor="s-email">Email (optional)</Label><Input id="s-email" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" aria-invalid={!!errors.email} className="mt-1.5" />{err("email")}</div>
              <div>
                <Label htmlFor="s-type">Order type *</Label>
                <Select value={f.orderType} onValueChange={(v) => set("orderType", v)}>
                  <SelectTrigger id="s-type" className="mt-1.5" aria-invalid={!!errors.orderType}><SelectValue placeholder="What should we make?" /></SelectTrigger>
                  <SelectContent>{orderTypes.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
                {err("orderType")}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><Label htmlFor="s-occ">Occasion</Label><Input id="s-occ" value={f.occasion} onChange={(e) => set("occasion", e.target.value)} placeholder="Wedding, church, birthday…" className="mt-1.5" /></div>
              <div><Label htmlFor="s-date">Needed by</Label><Input id="s-date" type="date" value={f.eventDate} onChange={(e) => set("eventDate", e.target.value)} className="mt-1.5" /></div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><Label htmlFor="s-fabric">Fabric / colours</Label><Input id="s-fabric" value={f.fabric} onChange={(e) => set("fabric", e.target.value)} placeholder="e.g. emerald lace with gold" className="mt-1.5" /></div>
              <div><Label htmlFor="s-budget">Budget (optional)</Label><Input id="s-budget" value={f.budget} onChange={(e) => set("budget", e.target.value)} placeholder="e.g. $120 or Le 2,700" className="mt-1.5" /></div>
            </div>
            <div><Label htmlFor="s-desc">Design description *</Label><Textarea id="s-desc" value={f.description} onChange={(e) => set("description", e.target.value)} rows={5} aria-invalid={!!errors.description} placeholder="Describe the style, neckline, sleeves, length, embroidery, who it's for…" className="mt-1.5" />{err("description")}</div>

            <Accordion type="single" collapsible className="rounded-lg border border-border px-4">
              <AccordionItem value="m" className="border-0">
                <AccordionTrigger className="text-sm hover:no-underline"><span className="flex items-center gap-2"><Ruler className="h-4 w-4 text-primary" /> Add measurements (optional, in inches)</span></AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 pb-2 sm:grid-cols-4">
                    {measureFields.map((k) => (
                      <div key={k}><Label htmlFor={`m-${k}`} className="text-xs">{k}</Label><Input id={`m-${k}`} inputMode="decimal" value={m[k] ?? ""} onChange={(e) => setM((x) => ({ ...x, [k]: e.target.value }))} className="mt-1" /></div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Not sure how to measure? Skip this — we'll guide you on WhatsApp or take them in the shop.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" size="lg" className="h-12 flex-1 bg-[#25D366] text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#1fb857]"><WhatsAppIcon className="mr-2 h-5 w-5" /> Send order request</Button>
              <Button type="button" variant="outline" size="lg" className="h-12" onClick={(e) => submit(e as unknown as FormEvent, "email")}><Mail className="mr-2 h-4 w-4" /> Send by email instead</Button>
            </div>
          </form>
        )}

        <Reveal>
          <h2 className="font-display text-3xl font-semibold">How it works</h2>
          <ol className="mt-8 space-y-7">
            {process.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/50 font-display text-lg text-primary">{i + 1}</span>
                <div><h3 className="font-display text-xl font-semibold">{s.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p></div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </div>
  );
}
