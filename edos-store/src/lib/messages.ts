import type { CartLine } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { formatMoney } from "@/lib/format";

/** Message sent to the shop's WhatsApp when a customer checks out the cart. */
export function buildCartMessage(
  lines: CartLine[],
  getProduct: (id: string) => Product | undefined,
  totals: { usd: number; leones: number },
  customer: { name: string; phone: string; delivery: string; address: string; notes: string },
): string {
  const items = lines
    .map((l, i) => {
      const p = getProduct(l.productId);
      if (!p) return "";
      return `${i + 1}. ${p.name} — size: ${l.size}, fabric: ${l.fabric}, qty: ${l.qty}\n    ${formatMoney(p.price * l.qty, "USD")} / ${formatMoney(p.priceLeones * l.qty, "SLE")}`;
    })
    .filter(Boolean)
    .join("\n");
  return [
    "Hello Edos Clothing & Design! I'd like to place an order:",
    "",
    items,
    "",
    `Total: ${formatMoney(totals.usd, "USD")} / ${formatMoney(totals.leones, "SLE")}`,
    "",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Delivery: ${customer.delivery}${customer.address ? ` — ${customer.address}` : ""}`,
    customer.notes ? `Notes: ${customer.notes}` : "",
  ]
    .filter((x, i, a) => !(x === "" && a[i - 1] === ""))
    .join("\n")
    .trim();
}

export interface CustomRequest {
  name: string; phone: string; email: string; orderType: string; occasion: string;
  eventDate: string; fabric: string; budget: string; description: string;
  measurements: Record<string, string>;
}

export function buildCustomMessage(r: CustomRequest): string {
  const m = Object.entries(r.measurements).filter(([, v]) => v.trim());
  return [
    "Hello Edos Clothing & Design! I'd like a custom sewing order:",
    "",
    `Name: ${r.name}`,
    `Phone: ${r.phone}`,
    r.email ? `Email: ${r.email}` : "",
    `Order type: ${r.orderType}`,
    r.occasion ? `Occasion: ${r.occasion}` : "",
    r.eventDate ? `Needed by: ${r.eventDate}` : "",
    r.fabric ? `Fabric / colours: ${r.fabric}` : "",
    r.budget ? `Budget: ${r.budget}` : "",
    "",
    "Design description:",
    r.description,
    m.length ? `\nMeasurements (inches):\n${m.map(([k, v]) => `- ${k}: ${v}`).join("\n")}` : "",
    "",
    "(I'll send my reference photos in this chat.)",
  ]
    .filter((x, i, a) => !(x === "" && a[i - 1] === ""))
    .join("\n")
    .trim();
}
