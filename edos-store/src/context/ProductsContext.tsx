import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as seedProducts, type Product } from "@/data/products";
import { loadJSON, saveJSON } from "@/lib/storage";
import { isLive, supabase } from "@/lib/supabase";

/** What the admin has changed, stored on top of the original catalogue. */
interface CatalogState {
  /** changes to original products, keyed by product id */
  edits: Record<string, Partial<Product>>;
  /** products added by the admin */
  added: Product[];
  /** original products the admin deleted */
  removed: string[];
}

const KEY = "edos:catalog";
const empty: CatalogState = { edits: {}, added: [], removed: [] };

interface ProductsCtx {
  /** every product, including hidden ones (for the admin) */
  all: Product[];
  /** only products that should be shown in the shop */
  visible: Product[];
  getProduct: (id: string) => Product | undefined;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<boolean>;
  addProduct: (p: Omit<Product, "id" | "custom">) => Promise<{ ok: boolean; id: string }>;
  deleteProduct: (id: string) => Promise<boolean>;
  resetCatalog: () => void;
  /** false if the last save failed */
  lastSaveOk: boolean;
  /** true while the first load from the database is running */
  loading: boolean;
}

const Ctx = createContext<ProductsCtx | null>(null);

const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product";

/** DEMO MODE: products live in this browser only (used when Supabase is not configured). */
function LocalProductsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(() => ({ ...empty, ...loadJSON<CatalogState>(KEY, empty) }));
  const [lastSaveOk, setLastSaveOk] = useState(true);

  const commit = useCallback((next: CatalogState) => {
    const ok = saveJSON(KEY, next);
    setLastSaveOk(ok);
    if (ok) setState(next);
    return ok;
  }, []);

  const all = useMemo<Product[]>(() => {
    const originals = seedProducts
      .filter((p) => !state.removed.includes(p.id))
      .map((p) => ({ ...p, ...(state.edits[p.id] ?? {}) }));
    return [...originals, ...state.added];
  }, [state]);

  const visible = useMemo(() => all.filter((p) => !p.hidden), [all]);
  const getProduct = useCallback((id: string) => all.find((p) => p.id === id), [all]);

  const updateProduct = useCallback(
    async (id: string, patch: Partial<Product>) => {
      if (state.added.some((p) => p.id === id)) {
        return commit({ ...state, added: state.added.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
      }
      return commit({ ...state, edits: { ...state.edits, [id]: { ...(state.edits[id] ?? {}), ...patch } } });
    },
    [state, commit],
  );

  const addProduct = useCallback(
    async (p: Omit<Product, "id" | "custom">) => {
      let id = slug(p.name);
      const taken = new Set([...seedProducts.map((x) => x.id), ...state.added.map((x) => x.id)]);
      while (taken.has(id)) id = `${id}-${Math.floor(Math.random() * 900 + 100)}`;
      const ok = commit({ ...state, added: [...state.added, { ...p, id, custom: true }] });
      return { ok, id };
    },
    [state, commit],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (state.added.some((p) => p.id === id)) return commit({ ...state, added: state.added.filter((p) => p.id !== id) });
      return commit({ ...state, removed: [...state.removed, id] });
    },
    [state, commit],
  );

  const resetCatalog = useCallback(() => {
    commit(empty);
  }, [commit]);

  const value = useMemo(
    () => ({ all, visible, getProduct, updateProduct, addProduct, deleteProduct, resetCatalog, lastSaveOk, loading: false }),
    [all, visible, getProduct, updateProduct, addProduct, deleteProduct, resetCatalog, lastSaveOk],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ============================================================
   LIVE MODE — products come from the Supabase database
   ============================================================ */

/** The photos that ship with the website, used for products that have no uploaded photo yet. */
const bundledImage = Object.fromEntries(seedProducts.map((p) => [p.id, p.image])) as Record<string, string>;

interface ProductRow {
  id: string; name: string; category: Product["category"]; price_usd: number | string; price_leones: number;
  rating: number | string; reviews: number; image_url: string | null; badge: Product["badge"] | null; popular: boolean;
  description: string; fabrics: string[]; sizes: string[]; lead_time: string; hidden: boolean; sort_order: number;
}

const fromRow = (r: ProductRow): Product => ({
  id: r.id, name: r.name, category: r.category, price: Number(r.price_usd), priceLeones: Number(r.price_leones),
  rating: Number(r.rating), reviews: r.reviews, image: r.image_url || bundledImage[r.id] || seedProducts[0].image,
  badge: r.badge ?? undefined, popular: r.popular, description: r.description, fabrics: r.fabrics, sizes: r.sizes,
  leadTime: r.lead_time, hidden: r.hidden, custom: !(r.id in bundledImage),
});

/** Only photos uploaded to our own storage are saved as an address; bundled photos need none. */
const uploadedUrl = (img?: string) => (img && img.includes("/storage/v1/object/public/") ? img : undefined);

function toRow(patch: Partial<Product>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.price !== undefined) row.price_usd = patch.price;
  if (patch.priceLeones !== undefined) row.price_leones = patch.priceLeones;
  if (patch.rating !== undefined) row.rating = patch.rating;
  if (patch.reviews !== undefined) row.reviews = patch.reviews;
  if ("badge" in patch) row.badge = patch.badge ?? null;
  if (patch.popular !== undefined) row.popular = patch.popular;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.fabrics !== undefined) row.fabrics = patch.fabrics;
  if (patch.sizes !== undefined) row.sizes = patch.sizes;
  if (patch.leadTime !== undefined) row.lead_time = patch.leadTime;
  if (patch.hidden !== undefined) row.hidden = patch.hidden;
  const img = uploadedUrl(patch.image);
  if (img) row.image_url = img;
  return row;
}

function LiveProductsProvider({ children }: { children: ReactNode }) {
  // Start with the built-in products so the shop is never empty while loading (or if offline).
  const [all, setAll] = useState<Product[]>(seedProducts);
  const [loading, setLoading] = useState(true);
  const [lastSaveOk, setLastSaveOk] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from("products").select("*").order("sort_order").order("created_at");
    if (error) { console.warn("Could not load products from the database:", error.message); setLoading(false); return; }
    if (data) setAll((data as ProductRow[]).map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    // when the admin signs in or out, reload (admins also see hidden products)
    const { data: sub } = supabase!.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") setTimeout(load, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const visible = useMemo(() => all.filter((p) => !p.hidden), [all]);
  const getProduct = useCallback((id: string) => all.find((p) => p.id === id), [all]);

  const updateProduct = useCallback(async (id: string, patch: Partial<Product>) => {
    const before = all;
    setAll((cur) => cur.map((p) => (p.id === id ? { ...p, ...patch } : p))); // show it straight away
    const { data, error } = await supabase!.from("products").update(toRow(patch)).eq("id", id).select("id");
    const ok = !error && !!data && data.length > 0;
    if (!ok) { setAll(before); console.warn("Could not save product:", error?.message ?? "not allowed"); }
    setLastSaveOk(ok);
    return ok;
  }, [all]);

  const addProduct = useCallback(async (p: Omit<Product, "id" | "custom">) => {
    let id = slug(p.name);
    const taken = new Set(all.map((x) => x.id));
    while (taken.has(id)) id = `${id}-${Math.floor(Math.random() * 900 + 100)}`;
    const sort = all.length;
    const { error } = await supabase!.from("products").insert({ id, sort_order: sort, ...toRow(p) });
    const ok = !error;
    if (ok) setAll((cur) => [...cur, { ...p, id, custom: true }]);
    else console.warn("Could not add product:", error.message);
    setLastSaveOk(ok);
    return { ok, id };
  }, [all]);

  const deleteProduct = useCallback(async (id: string) => {
    const { data, error } = await supabase!.from("products").delete().eq("id", id).select("id");
    const ok = !error && !!data && data.length > 0;
    if (ok) setAll((cur) => cur.filter((p) => p.id !== id));
    setLastSaveOk(ok);
    return ok;
  }, []);

  const resetCatalog = useCallback(() => { /* not available on the live site */ }, []);

  const value = useMemo(
    () => ({ all, visible, getProduct, updateProduct, addProduct, deleteProduct, resetCatalog, lastSaveOk, loading }),
    [all, visible, getProduct, updateProduct, addProduct, deleteProduct, resetCatalog, lastSaveOk, loading],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Uses the real database when it is configured, otherwise browser-only demo mode. */
export function ProductsProvider({ children }: { children: ReactNode }) {
  return isLive ? <LiveProductsProvider>{children}</LiveProductsProvider> : <LocalProductsProvider>{children}</LocalProductsProvider>;
}

export function useProducts() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useProducts must be used inside ProductsProvider");
  return c;
}
