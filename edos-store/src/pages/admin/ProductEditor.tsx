import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { categories, type CategoryId, type Product } from "@/data/products";
import { site } from "@/data/site";
import { fileToResizedDataUrl } from "@/lib/storage";
import { useProducts } from "@/context/ProductsContext";

type Draft = {
  name: string; category: CategoryId; price: string; priceLeones: string; description: string;
  fabrics: string; sizes: string; leadTime: string; badge: string; hidden: boolean; image: string; popular: boolean;
};

const blank: Draft = {
  name: "", category: "men", price: "", priceLeones: "", description: "", fabrics: "", sizes: "S, M, L, XL, XXL, Custom fit",
  leadTime: "7–10 days", badge: "none", hidden: false, image: "", popular: false,
};

const toDraft = (p: Product): Draft => ({
  name: p.name, category: p.category, price: String(p.price), priceLeones: String(p.priceLeones), description: p.description,
  fabrics: p.fabrics.join(", "), sizes: p.sizes.join(", "), leadTime: p.leadTime, badge: p.badge ?? "none", hidden: !!p.hidden, image: p.image, popular: !!p.popular,
});

const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

/** Add (product = null) or edit a product. */
export function ProductEditor({ open, product, onClose }: { open: boolean; product: Product | null; onClose: () => void }) {
  const { addProduct, updateProduct, deleteProduct } = useProducts();
  const [d, setD] = useState<Draft>(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) { setD(product ? toDraft(product) : blank); setErrors({}); } }, [open, product]);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => { setD((x) => ({ ...x, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    try { set("image", await fileToResizedDataUrl(file)); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not use that photo."); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  }

  function save() {
    const err: Record<string, string> = {};
    const usd = Number(d.price); const sle = Number(d.priceLeones);
    if (!d.name.trim()) err.name = "Name is required";
    if (!d.price || !(usd >= 0)) err.price = "Enter the dollar price";
    if (!d.priceLeones || !(sle >= 0)) err.priceLeones = "Enter the Leones price";
    if (!d.image) err.image = "Add a photo";
    if (!list(d.fabrics).length) err.fabrics = "Add at least one fabric";
    if (!list(d.sizes).length) err.sizes = "Add at least one size";
    setErrors(err);
    if (Object.keys(err).length) { toast.error("Please fix the highlighted fields."); return; }

    const data = {
      name: d.name.trim(), category: d.category, price: Math.round(usd * 100) / 100, priceLeones: Math.round(sle),
      description: d.description.trim(), fabrics: list(d.fabrics), sizes: list(d.sizes), leadTime: d.leadTime.trim() || "7–10 days",
      badge: d.badge === "none" ? undefined : (d.badge as Product["badge"]), hidden: d.hidden, popular: d.popular, image: d.image,
    };
    const ok = product
      ? updateProduct(product.id, data)
      : addProduct({ ...data, rating: 5, reviews: 0 }).ok;
    if (!ok) { toast.error("Could not save — the browser's storage is full. Try a smaller photo or remove unused products."); return; }
    toast.success(product ? "Product updated" : "Product added");
    onClose();
  }

  function remove() {
    if (!product) return;
    if (!window.confirm(`Delete “${product.name}” from the shop? You can restore sample products with “Reset catalogue”.`)) return;
    deleteProduct(product.id);
    toast.success("Product deleted");
    onClose();
  }

  const e = (k: string) => errors[k] ? <p className="mt-1 text-xs text-destructive" role="alert">{errors[k]}</p> : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border bg-popover sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">{product ? "Edit product" : "Add a product"}</DialogTitle>
          <DialogDescription>Set the dollar price and the Leones price separately — neither is converted automatically.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
          <div>
            <Label>Photo</Label>
            <div className="mt-1.5 overflow-hidden rounded-lg border border-border bg-secondary">
              {d.image ? <img src={d.image} alt="" className="aspect-[3/4] w-full object-cover" /> : <div className="flex aspect-[3/4] items-center justify-center text-muted-foreground"><ImagePlus className="h-8 w-8" /></div>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(ev) => onFile(ev.target.files?.[0])} aria-label="Upload product photo" />
            <Button type="button" variant="outline" size="sm" className="mt-2 w-full" disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? "Processing…" : d.image ? "Replace photo" : "Upload photo"}</Button>
            {e("image")}
          </div>

          <div className="space-y-4">
            <div><Label htmlFor="p-name">Name *</Label><Input id="p-name" value={d.name} onChange={(ev) => set("name", ev.target.value)} className="mt-1.5" />{e("name")}</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="p-cat">Category</Label>
                <Select value={d.category} onValueChange={(v) => set("category", v as CategoryId)}>
                  <SelectTrigger id="p-cat" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="p-badge">Badge</Label>
                <Select value={d.badge} onValueChange={(v) => set("badge", v)}>
                  <SelectTrigger id="p-badge" className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{["none", "Bestseller", "New", "Featured"].map((b) => <SelectItem key={b} value={b}>{b === "none" ? "No badge" : b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="p-usd">Price in dollars ($) *</Label><Input id="p-usd" inputMode="decimal" value={d.price} onChange={(ev) => set("price", ev.target.value)} placeholder="89.99" className="mt-1.5" />{e("price")}</div>
              <div><Label htmlFor="p-sle">Price in Leones (Le) *</Label><Input id="p-sle" inputMode="numeric" value={d.priceLeones} onChange={(ev) => set("priceLeones", ev.target.value)} placeholder="2000" className="mt-1.5" />{e("priceLeones")}</div>
            </div>
            <Button type="button" variant="ghost" size="sm" className="h-auto px-0 text-xs text-primary" onClick={() => { const usd = Number(d.price); if (usd > 0) set("priceLeones", String(Math.round((usd * site.suggestedLeonesPerDollar) / 50) * 50)); else toast.error("Enter the dollar price first."); }}>
              <Wand2 className="mr-1.5 h-3.5 w-3.5" /> Suggest Leones from today's rate (Le {site.suggestedLeonesPerDollar} per $1) — you can still change it
            </Button>
          </div>
        </div>

        <div><Label htmlFor="p-desc">Description</Label><Textarea id="p-desc" rows={3} value={d.description} onChange={(ev) => set("description", ev.target.value)} className="mt-1.5" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="p-fab">Fabrics (comma separated) *</Label><Input id="p-fab" value={d.fabrics} onChange={(ev) => set("fabrics", ev.target.value)} placeholder="Black cashmere, Navy cashmere" className="mt-1.5" />{e("fabrics")}</div>
          <div><Label htmlFor="p-sizes">Sizes (comma separated) *</Label><Input id="p-sizes" value={d.sizes} onChange={(ev) => set("sizes", ev.target.value)} className="mt-1.5" />{e("sizes")}</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="p-lead">Ready in</Label><Input id="p-lead" value={d.leadTime} onChange={(ev) => set("leadTime", ev.target.value)} className="mt-1.5" /></div>
          <div className="flex items-end gap-6 pb-2">
            <label className="flex items-center gap-2 text-sm"><Switch checked={!d.hidden} onCheckedChange={(v) => set("hidden", !v)} /> Visible in shop</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={d.popular} onCheckedChange={(v) => set("popular", v)} /> Show on home page</label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {product ? <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={remove}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button> : <span />}
          <div className="flex gap-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="button" onClick={save}>{product ? "Save changes" : "Add product"}</Button></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
