import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WhatsAppIcon } from "@/components/icons";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatMoney } from "@/lib/format";
import { buildCartMessage } from "@/lib/messages";
import { saveOrder } from "@/lib/orders";
import { openWhatsApp, whatsappUrl } from "@/lib/whatsapp";

export default function Cart() {
  const { lines, subtotal, subtotalLeones, setQty, remove, clear } = useCart();
  const { getProduct } = useProducts();
  const { fmt, currency, fmtAmount } = useCurrency();
  const [form, setForm] = useState({ name: "", phone: "", delivery: "Delivery", address: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<{ id: string; message: string } | null>(null);

  const set = (k: keyof typeof form, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };
  const total = currency === "USD" ? subtotal : subtotalLeones;

  function submit(e: FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = "Please enter your name";
    if (form.phone.replace(/\D/g, "").length < 7) err.phone = "Please enter a phone number we can reach";
    if (form.delivery === "Delivery" && !form.address.trim()) err.address = "Please tell us where to deliver";
    setErrors(err);
    if (Object.keys(err).length) { toast.error("Please check the highlighted fields."); return; }

    const message = buildCartMessage(lines, getProduct, { usd: subtotal, leones: subtotalLeones }, form);
    const rec = saveOrder({
      kind: "shop-order", customerName: form.name.trim(), phone: form.phone.trim(),
      summary: lines.map((l) => `${l.qty} × ${getProduct(l.productId)?.name}`).join(", "), details: message, total: fmtAmount(total),
    });
    setSent({ id: rec.id, message });
    openWhatsApp(message);
  }

  if (sent) {
    return (
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24 text-center">
        <CheckCircle2 className="h-14 w-14 text-primary" />
        <h1 className="font-display text-4xl">Your order is ready to send</h1>
        <p className="max-w-md text-muted-foreground">WhatsApp should have opened with your order. <strong className="text-foreground">Press send there</strong> so we receive it — we'll reply to confirm price, fabric and delivery. Reference: <span className="text-foreground">{sent.id}</span></p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button asChild><a href={whatsappUrl(sent.message)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="mr-2 h-4 w-4" /> Open WhatsApp again</a></Button>
          <Button variant="outline" onClick={() => { clear(); setSent(null); }}>Clear cart &amp; finish</Button>
          <Button variant="ghost" onClick={() => setSent(null)}>Back to cart</Button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24 text-center">
        <ShoppingBag className="h-14 w-14 text-gold-dim" />
        <h1 className="font-display text-4xl">Your cart is empty</h1>
        <p className="text-muted-foreground">Find something you love — or have it sewn just for you.</p>
        <div className="mt-2 flex gap-3"><Button asChild><Link to="/shop">Browse the shop</Link></Button><Button asChild variant="outline"><Link to="/custom-sewing">Custom order</Link></Button></div>
      </div>
    );
  }

  const field = (id: keyof typeof form) => errors[id] ? <p className="mt-1 text-xs text-destructive" role="alert">{errors[id]}</p> : null;

  return (
    <div className="container-x pb-24 pt-32">
      <h1 className="section-title mb-10">Your <span className="text-primary">cart</span></h1>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <ul className="space-y-4">
          {lines.map((l) => {
            const p = getProduct(l.productId);
            if (!p) return null;
            return (
              <li key={l.key} className="lux-card flex gap-4 p-4">
                <Link to={`/product/${p.id}`} className="shrink-0"><img src={p.image} alt={p.name} className="h-28 w-24 rounded-lg object-cover" /></Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div><Link to={`/product/${p.id}`} className="font-display text-xl font-semibold hover:text-primary">{p.name}</Link><p className="mt-0.5 text-xs text-muted-foreground">Size: {l.size} · {l.fabric}</p></div>
                    <p className="font-semibold text-primary">{fmtAmount((currency === "USD" ? p.price : p.priceLeones) * l.qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-lg border border-border">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label={`Decrease ${p.name}`} onClick={() => setQty(l.key, l.qty - 1)}><Minus className="h-3.5 w-3.5" /></Button>
                      <span className="w-7 text-center text-sm">{l.qty}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label={`Increase ${p.name}`} onClick={() => setQty(l.key, l.qty + 1)}><Plus className="h-3.5 w-3.5" /></Button>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => remove(l.key)}><Trash2 className="mr-1.5 h-4 w-4" /> Remove</Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <form onSubmit={submit} noValidate className="lux-card h-fit space-y-5 p-6 lg:sticky lg:top-28">
          <div className="flex items-baseline justify-between border-b border-border pb-4">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-3xl font-semibold text-primary">{fmtAmount(total)}</span>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">Also {currency === "USD" ? formatMoney(subtotalLeones, "SLE") : formatMoney(subtotal, "USD")}. Final price is confirmed on WhatsApp.</p>

          <div><Label htmlFor="c-name">Full name</Label><Input id="c-name" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} className="mt-1.5" />{field("name")}</div>
          <div><Label htmlFor="c-phone">Phone / WhatsApp</Label><Input id="c-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+232 76 000000" autoComplete="tel" aria-invalid={!!errors.phone} className="mt-1.5" />{field("phone")}</div>
          <div>
            <Label htmlFor="c-delivery">Delivery or pickup</Label>
            <Select value={form.delivery} onValueChange={(v) => set("delivery", v)}>
              <SelectTrigger id="c-delivery" className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Delivery">Delivery</SelectItem><SelectItem value="Pickup at the shop">Pickup at the shop</SelectItem></SelectContent>
            </Select>
          </div>
          {form.delivery === "Delivery" && <div><Label htmlFor="c-address">Delivery address / area</Label><Input id="c-address" value={form.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" aria-invalid={!!errors.address} className="mt-1.5" />{field("address")}</div>}
          <div><Label htmlFor="c-notes">Notes (optional)</Label><Textarea id="c-notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} placeholder="Event date, measurements, colour changes…" className="mt-1.5" /></div>

          <Button type="submit" size="lg" className="h-12 w-full bg-[#25D366] text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#1fb857]"><WhatsAppIcon className="mr-2 h-5 w-5" /> Send order on WhatsApp</Button>
          <p className="text-center text-xs text-muted-foreground">No payment is taken on the website. We confirm everything with you first. Prices shown: {fmt({ price: subtotal, priceLeones: subtotalLeones })}</p>
        </form>
      </div>
    </div>
  );
}
