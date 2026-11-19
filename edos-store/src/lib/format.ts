export type Currency = "USD" | "SLE";

export interface Priced {
  price: number;        // USD
  priceLeones: number;  // SLE
}

export function formatMoney(amount: number, currency: Currency): string {
  if (currency === "USD") {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `Le ${Math.round(amount).toLocaleString("en-US")}`;
}

/** Pick the right price for the chosen currency (USD and Leones are set separately). */
export function priceIn(p: Priced, currency: Currency): number {
  return currency === "USD" ? p.price : p.priceLeones;
}
