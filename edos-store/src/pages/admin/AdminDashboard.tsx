import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { ExternalLink, Eye, EyeOff, Inbox, LogOut, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/Logo";
import { WhatsAppIcon } from "@/components/icons";
import { ProductEditor } from "@/pages/admin/ProductEditor";
import { useAdmin } from "@/context/AdminContext";
import { useProducts } from "@/context/ProductsContext";
import { getCategory, type Product } from "@/data/products";
import { isLive } from "@/lib/supabase";
import { CategoryPhotos } from "@/pages/admin/CategoryPhotos";
import { deleteOrder, loadOrders, updateOrderStatus, type OrderKind, type OrderRecord, type OrderStatus } from "@/lib/orders";

/** A price box that saves when you leave it or press Enter. */
function PriceCell({ value, prefix, onSave, label }: { value: number; prefix: string; onSave: (n: number) => void; label: string }) {
  const [text, setText] = useState(String(value));
  const [editing, setEditing] = useState(false);
  const shown = editing ? text : String(value);

  function commit() {
    setEditing(false);
    const n = Number(text);
    if (text.trim() === "" || !(n >= 0)) { toast.error("Please enter a valid price."); setText(String(value)); return; }
    if (n !== value) onSave(n);
  }

  return (
    <div className="relative w-32">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{prefix}</span>
      <Input
        aria-label={label}
        inputMode="decimal"
        value={shown}
        className="h-9 pl-8 text-right"
        onFocus={() => { setText(String(value)); setEditing(true); }}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
      />
    </div>
  );
}

const kindLabel: Record<OrderKind, string> = { "shop-order": "Shop order", "custom-sewing": "Custom sewing", contact: "Message" };
const statuses: { id: OrderStatus; label: string }[] = [
  { id: "new", label: "New" }, { id: "contacted", label: "Contacted" }, { id: "in-progress", label: "In progress" }, { id: "done", label: "Done" }, { id: "cancelled", label: "Cancelled" },
];

export default function AdminDashboard() {
  const { isAdmin, checking, logout } = useAdmin();
  const { all, updateProduct, resetCatalog, lastSaveOk } = useProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [openOrder, setOpenOrder] = useState<string | null>(null);

  const refresh = async () => setOrders(await loadOrders());
  useEffect(() => { if (isAdmin) void refresh(); }, [isAdmin]);

  if (checking) return null;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const save = async (id: string, patch: Partial<Product>) => {
    if (await updateProduct(id, patch)) toast.success("Saved");
    else toast.error(isLive ? "Could not save — check your internet connection and that you are signed in as admin." : "Could not save — browser storage is full.");
  };
  const newCount = orders.filter((o) => o.status === "new").length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/60">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-4"><Logo /><Badge variant="outline" className="hidden border-primary/40 text-primary sm:inline-flex">Admin</Badge></div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/" target="_blank"><ExternalLink className="mr-2 h-4 w-4" /> View shop</Link></Button>
            <Button variant="outline" size="sm" onClick={logout}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
          </div>
        </div>
      </header>

      <main className="container-x py-8">
        {isLive ? (
          <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
            <strong className="text-primary">Live.</strong> Price, product and photo changes are saved to the database and appear for every customer straight away. Orders sent from the website are listed under Orders &amp; requests.
          </div>
        ) : (<div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
          <strong className="text-primary">Demo mode.</strong> Changes are saved only in this browser, so customers on other devices won't see them yet, and the orders list only shows orders placed from this browser. Real orders still arrive on WhatsApp.
        </div>)}
        {!lastSaveOk && <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert">The last change could not be saved. Check your connection (and, in demo mode, that the browser's storage is not full).</p>}

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products &amp; prices ({all.length})</TabsTrigger>
            <TabsTrigger value="categories">Category photos</TabsTrigger>
            <TabsTrigger value="orders">Orders &amp; requests{newCount > 0 && <span className="ml-2 rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{newCount}</span>}</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Change a price and press Enter or click away — it saves instantly. Dollar and Leones prices are separate.</p>
              <div className="flex gap-2">
                {!isLive && <Button variant="outline" size="sm" onClick={() => { if (window.confirm("Restore the original sample products and prices? This removes your product changes.")) { resetCatalog(); toast.success("Catalogue reset"); } }}><RotateCcw className="mr-2 h-4 w-4" /> Reset catalogue</Button>}
                <Button size="sm" onClick={() => { setEditing(null); setEditorOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Add product</Button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[820px] text-sm">
                <thead className="bg-secondary text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3 text-right">Price ($)</th><th className="p-3 text-right">Price (Le)</th><th className="p-3 text-center">In shop</th><th className="p-3 text-right">Edit</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {all.map((p) => (
                    <tr key={p.id} className={p.hidden ? "opacity-60" : ""}>
                      <td className="p-3"><div className="flex items-center gap-3"><img src={p.image} alt="" className="h-14 w-11 rounded object-cover" /><div><p className="font-medium">{p.name}</p>{p.custom && <span className="text-[10px] uppercase tracking-wider text-primary">Added by you</span>}</div></div></td>
                      <td className="p-3 text-muted-foreground">{getCategory(p.category)?.label}</td>
                      <td className="p-3"><div className="flex justify-end"><PriceCell key={`u${p.price}`} value={p.price} prefix="$" label={`${p.name} price in dollars`} onSave={(n) => save(p.id, { price: Math.round(n * 100) / 100 })} /></div></td>
                      <td className="p-3"><div className="flex justify-end"><PriceCell key={`l${p.priceLeones}`} value={p.priceLeones} prefix="Le" label={`${p.name} price in Leones`} onSave={(n) => save(p.id, { priceLeones: Math.round(n) })} /></div></td>
                      <td className="p-3 text-center"><Button variant="ghost" size="icon" aria-label={p.hidden ? `Show ${p.name} in shop` : `Hide ${p.name} from shop`} onClick={() => save(p.id, { hidden: !p.hidden })}>{p.hidden ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-primary" />}</Button></td>
                      <td className="p-3 text-right"><Button variant="outline" size="sm" onClick={() => { setEditing(p); setEditorOpen(true); }}><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="categories"><CategoryPhotos /></TabsContent>

          <TabsContent value="orders">
            <div className="mb-4 flex justify-end"><Button variant="outline" size="sm" onClick={() => { void refresh(); }}><RotateCcw className="mr-2 h-4 w-4" /> Refresh orders</Button></div>
            {orders.length === 0 ? (
              <div className="lux-card flex flex-col items-center gap-3 px-6 py-16 text-center">
                <Inbox className="h-10 w-10 text-gold-dim" />
                <p className="font-display text-2xl">No orders yet</p>
                <p className="max-w-md text-sm text-muted-foreground">Orders and custom sewing requests sent from this browser will appear here. Try placing a test order from the shop to see how it looks.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => {
                  const digits = o.phone.replace(/\D/g, "");
                  return (
                    <li key={o.id} className="lux-card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="border-primary/40 text-primary">{kindLabel[o.kind]}</Badge><span className="text-xs text-muted-foreground">{o.id} · {new Date(o.createdAt).toLocaleString()}</span></div>
                          <p className="mt-2 font-medium">{o.customerName}{o.phone && <span className="ml-2 text-sm font-normal text-muted-foreground">{o.phone}</span>}</p>
                          <p className="text-sm text-muted-foreground">{o.summary}{o.total && <span className="ml-2 font-medium text-primary">{o.total}</span>}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Select value={o.status} onValueChange={async (v) => { await updateOrderStatus(o.id, v as OrderStatus); await refresh(); }}>
                            <SelectTrigger className="h-9 w-[140px]" aria-label="Order status"><SelectValue /></SelectTrigger>
                            <SelectContent>{statuses.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}</SelectContent>
                          </Select>
                          {digits.length >= 7 && <Button asChild variant="outline" size="sm"><a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="mr-1.5 h-4 w-4" /> Message</a></Button>}
                          <Button variant="ghost" size="sm" onClick={() => setOpenOrder(openOrder === o.id ? null : o.id)}>{openOrder === o.id ? "Hide" : "Details"}</Button>
                          <Button variant="ghost" size="icon" aria-label="Delete order" className="text-muted-foreground hover:text-destructive" onClick={async () => { if (window.confirm("Delete this order from the list?")) { await deleteOrder(o.id); await refresh(); } }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      {openOrder === o.id && <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-secondary p-3 font-sans text-xs leading-relaxed text-muted-foreground">{o.details}</pre>}
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-6 text-xs text-muted-foreground">{orders.length} saved. Prices in each order are the ones the customer saw when they placed it.</p>
          </TabsContent>
        </Tabs>
      </main>

      <ProductEditor open={editorOpen} product={editing} onClose={() => setEditorOpen(false)} />
    </div>
  );
}
