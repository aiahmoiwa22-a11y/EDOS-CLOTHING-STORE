import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { products as seedProducts, type Product } from "@/data/products";
import { loadJSON, saveJSON } from "@/lib/storage";

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
  updateProduct: (id: string, patch: Partial<Product>) => boolean;
  addProduct: (p: Omit<Product, "id" | "custom">) => { ok: boolean; id: string };
  deleteProduct: (id: string) => boolean;
  resetCatalog: () => void;
  /** false if the last save failed (browser storage full) */
  lastSaveOk: boolean;
}

const Ctx = createContext<ProductsCtx | null>(null);

const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product";

export function ProductsProvider({ children }: { children: ReactNode }) {
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
    (id: string, patch: Partial<Product>) => {
      if (state.added.some((p) => p.id === id)) {
        return commit({ ...state, added: state.added.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
      }
      return commit({ ...state, edits: { ...state.edits, [id]: { ...(state.edits[id] ?? {}), ...patch } } });
    },
    [state, commit],
  );

  const addProduct = useCallback(
    (p: Omit<Product, "id" | "custom">) => {
      let id = slug(p.name);
      const taken = new Set([...seedProducts.map((x) => x.id), ...state.added.map((x) => x.id)]);
      while (taken.has(id)) id = `${id}-${Math.floor(Math.random() * 900 + 100)}`;
      const ok = commit({ ...state, added: [...state.added, { ...p, id, custom: true }] });
      return { ok, id };
    },
    [state, commit],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      if (state.added.some((p) => p.id === id)) return commit({ ...state, added: state.added.filter((p) => p.id !== id) });
      return commit({ ...state, removed: [...state.removed, id] });
    },
    [state, commit],
  );

  const resetCatalog = useCallback(() => {
    commit(empty);
  }, [commit]);

  const value = useMemo(
    () => ({ all, visible, getProduct, updateProduct, addProduct, deleteProduct, resetCatalog, lastSaveOk }),
    [all, visible, getProduct, updateProduct, addProduct, deleteProduct, resetCatalog, lastSaveOk],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProducts() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useProducts must be used inside ProductsProvider");
  return c;
}
