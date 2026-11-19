import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { formatMoney, priceIn, type Currency, type Priced } from "@/lib/format";

interface CurrencyCtx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Format a product's price in the currently selected currency */
  fmt: (p: Priced) => string;
  /** Format a raw amount that is already in the currently selected currency */
  fmtAmount: (amount: number) => string;
}

const Ctx = createContext<CurrencyCtx | null>(null);
const KEY = "edos:currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      return localStorage.getItem(KEY) === "SLE" ? "SLE" : "USD";
    } catch {
      return "USD";
    }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, currency); } catch { /* storage unavailable */ }
  }, [currency]);

  const fmt = useCallback((p: Priced) => formatMoney(priceIn(p, currency), currency), [currency]);
  const fmtAmount = useCallback((a: number) => formatMoney(a, currency), [currency]);
  const value = useMemo(() => ({ currency, setCurrency, fmt, fmtAmount }), [currency, fmt, fmtAmount]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCurrency must be used inside CurrencyProvider");
  return c;
}
