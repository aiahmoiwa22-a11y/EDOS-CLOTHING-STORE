import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Check, Clock, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/icons";
import { getCategory } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { formatMoney } from "@/lib/format";
import { saveOrder } from "@/lib/orders";
import { openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function Product() {
  const { id = "" } = useParams();
  const { getProduct, visible } = useProducts();
  const { add } = useCart();
  const { fmt, currency } = useCurrency();
  const product = getProduct(id);
  const [size, setSize] = useState("");
  const [fabric, setFabric] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setSize(product?.sizes[0] ?? "");
    setFabric(product?.fabrics[0] ?? "");
    setQty(1);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product || product.hidden) {
    return (
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24 text-center">
        <h1 className="font-display text-4xl">This design isn't available</h1>
        <p className="text-muted-foreground">It may have been removed. Browse the rest of the collection.</p>
        <Button asChild><Link to="/shop">Back to shop</Link></Button>
      </div>
    );
  }

  const related = visible.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  function addToCart() {
    add({ productId: product!.id, size, fabric, qty });
    toast.success(`${product!.name} added to your cart`, { action: { label: "View cart", onClick: () => { window.location.hash = "#/cart"; } } });
  }

  function orderNow() {
    const total = currency === "USD" ? product!.price * qty : product!.priceLeones * qty;
    const message = [
      "Hello Edos Clothing & Design! I'd like to order:",
      "",
      `${product!.name} — size: ${size}, fabric: ${fabric}, qty: ${qty}`,
      `Price: ${formatMoney(product!.price * qty, "USD")} / ${formatMoney(product!.priceLeones * qty, "SLE")}`,
      "",
      "Please confirm availability and delivery. Thank you!",
    ].join("\n");
    saveOrder({ kind: "shop-order", customerName: "(via WhatsApp)", phone: "", summary: `${qty} × ${product!.name}`, details: message, total: formatMoney(total, currency) });
    openWhatsApp(message);
  }

  return (
    <div className="container-x pb-24 pt-28">
      <Button asChild variant="ghost" className="-ml-3 mb-6 text-muted-foreground"><Link to="/shop"><ArrowLeft className="mr-2 h-4 w-4" /> Back to shop</Link></Button>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary">
          <img src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
          {product.badge && <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">{product.badge}</span>}
        </div>

        <div>
          <p className="eyebrow mb-3">{getCategory(product.category)?.label}</p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">{product.name}</h1>
          <StarRating rating={product.rating} reviews={product.reviews} className="mt-3" />
          <p className="mt-5 text-3xl font-semibold text-primary">{fmt(product)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{currency === "USD" ? `Also ${formatMoney(product.priceLeones, "SLE")}` : `Also ${formatMoney(product.price, "USD")}`}</p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          <fieldset className="mt-8">
            <legend className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Size</legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={size === s}
                  className={cn("min-w-12 rounded-lg border px-3.5 py-2 text-sm transition-colors", size === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50")}>{s}</button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Choose “Custom fit” and we'll ask for your measurements on WhatsApp.</p>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Fabric</legend>
            <div className="flex flex-wrap gap-2">
              {product.fabrics.map((f) => (
                <button key={f} type="button" onClick={() => setFabric(f)} aria-pressed={fabric === f}
                  className={cn("rounded-lg border px-3.5 py-2 text-sm transition-colors", fabric === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50")}>{f}</button>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <Button type="button" variant="ghost" size="icon" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-8 text-center text-sm" aria-live="polite">{qty}</span>
              <Button type="button" variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}><Plus className="h-4 w-4" /></Button>
            </div>
            <Button onClick={addToCart} size="lg" className="h-12 flex-1 px-8 text-xs font-semibold uppercase tracking-[0.16em] sm:flex-none"><ShoppingBag className="mr-2 h-4 w-4" /> Add to cart</Button>
            <Button onClick={orderNow} size="lg" variant="outline" className="h-12 flex-1 border-[#25D366] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#25D366] hover:bg-[#25D366] hover:text-white sm:flex-none"><WhatsAppIcon className="mr-2 h-4 w-4" /> Order on WhatsApp</Button>
          </div>

          <ul className="mt-8 space-y-2.5 border-t border-border pt-6 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-primary" /> Made to order — ready in about {product.leadTime}</li>
            <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-primary" /> Fitting check and adjustments included</li>
            <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-primary" /> Want changes? <Link className="text-primary underline-offset-4 hover:underline" to={`/custom-sewing?design=${encodeURIComponent(product.name)}`}>Request a custom version</Link></li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-6 font-display text-3xl font-semibold">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  );
}
