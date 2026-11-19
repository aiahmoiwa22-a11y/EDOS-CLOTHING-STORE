import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useProducts } from "@/context/ProductsContext";

export interface CartLine {
  key: string;
  productId: string;
  size: string;
  fabric: string;
  qty: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;        // USD
  subtotalLeones: number;  // Leones (sum of the separate Leones prices)
  add: (line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "edos:cart";

const makeKey = (l: Omit<CartLine, "key">) => `${l.productId}|${l.size}|${l.fabric}`;

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartLine[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { getProduct } = useProducts();
  const [stored, setLines] = useState<CartLine[]>(load);
  // ignore lines whose product was removed or hidden by the admin
  const lines = useMemo(
    () => stored.filter((l) => { const p = getProduct(l.productId); return p && !p.hidden; }),
    [stored, getProduct],
  );

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(stored)); } catch { /* storage unavailable */ }
  }, [stored]);

  const add = useCallback((line: Omit<CartLine, "key">) => {
    const key = makeKey(line);
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + line.qty, 20) } : l));
      return [...prev, { ...line, key }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 20) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => sum + (getProduct(l.productId)?.price ?? 0) * l.qty, 0);
    const subtotalLeones = lines.reduce((sum, l) => sum + (getProduct(l.productId)?.priceLeones ?? 0) * l.qty, 0);
    return { lines, count, subtotal, subtotalLeones, add, setQty, remove, clear };
  }, [lines, getProduct, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
