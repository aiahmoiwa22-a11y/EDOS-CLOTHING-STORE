import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { useCurrency } from "@/context/CurrencyContext";
import { priceIn } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const { visible } = useProducts();
  const { currency } = useCurrency();
  const category = params.get("category") ?? "all";
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";

  const set = (key: string, value: string, empty: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === empty) next.delete(key); else next.set(key, value);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = visible.filter((p) => (category === "all" || p.category === category) && (!needle || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(needle)));
    if (sort === "price-asc") out = [...out].sort((a, b) => priceIn(a, currency) - priceIn(b, currency));
    if (sort === "price-desc") out = [...out].sort((a, b) => priceIn(b, currency) - priceIn(a, currency));
    if (sort === "rating") out = [...out].sort((a, b) => b.rating - a.rating);
    return out;
  }, [visible, category, q, sort, currency]);

  return (
    <div className="container-x pb-24 pt-32">
      <p className="eyebrow mb-3">The collection</p>
      <h1 className="section-title">Shop <span className="text-primary">Edos</span></h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Ready-to-order designs, each sewn to your size. Pick one, add it to your cart and send your order straight to us on WhatsApp.</p>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {[{ id: "all", label: "All" }, ...categories].map((c) => (
            <button key={c.id} type="button" onClick={() => set("category", c.id, "all")} aria-pressed={category === c.id}
              className={cn("rounded-full border px-4 py-1.5 text-[13px] transition-colors", category === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground")}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => set("q", e.target.value, "")} placeholder="Search designs" aria-label="Search designs" className="pl-9" />
          </div>
          <Select value={sort} onValueChange={(v) => set("sort", v, "featured")}>
            <SelectTrigger className="w-[170px]" aria-label="Sort"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mb-6 mt-8 text-sm text-muted-foreground" aria-live="polite">{list.length} {list.length === 1 ? "design" : "designs"}</p>

      {list.length === 0 ? (
        <div className="lux-card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <SearchX className="h-10 w-10 text-gold-dim" />
          <p className="font-display text-2xl">No designs match your search</p>
          <p className="text-sm text-muted-foreground">Try another category — or we can sew exactly what you have in mind.</p>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" onClick={() => setParams({}, { replace: true })}>Clear filters</Button>
            <Button asChild><a href="#/custom-sewing">Custom order</a></Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
