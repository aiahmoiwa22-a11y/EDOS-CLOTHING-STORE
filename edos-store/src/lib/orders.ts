import { loadJSON, saveJSON } from "@/lib/storage";
import { isLive, supabase } from "@/lib/supabase";

export type OrderKind = "shop-order" | "custom-sewing" | "contact";
export type OrderStatus = "new" | "contacted" | "in-progress" | "done" | "cancelled";

export interface OrderRecord {
  id: string;
  kind: OrderKind;
  createdAt: string; // ISO
  status: OrderStatus;
  customerName: string;
  phone: string;
  summary: string;   // short one-liner for the list
  details: string;   // the full message that was sent to WhatsApp
  total?: string;    // e.g. "$179.99" or "Le 4,050"
}

const KEY = "edos:orders";

/** Orders saved in THIS browser (demo mode only). */
export const listOrders = (): OrderRecord[] => loadJSON<OrderRecord[]>(KEY, []);

interface OrderRow {
  id: string; kind: OrderKind; status: OrderStatus; customer_name: string; phone: string;
  summary: string; details: string; total: string | null; created_at: string;
}
const fromRow = (r: OrderRow): OrderRecord => ({
  id: r.id, kind: r.kind, status: r.status, customerName: r.customer_name, phone: r.phone,
  summary: r.summary, details: r.details, total: r.total ?? undefined, createdAt: r.created_at,
});

/**
 * Save an order / custom request / contact message.
 * Live site: sent to the database (the admin sees it in the Orders tab).
 * It never blocks the customer — the WhatsApp message is the main way the order arrives.
 */
export function saveOrder(o: Omit<OrderRecord, "id" | "createdAt" | "status">): OrderRecord {
  const rec: OrderRecord = {
    ...o,
    id: `EDOS-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  if (isLive && supabase) {
    void supabase
      .from("orders")
      .insert({
        id: rec.id, kind: rec.kind, status: "new",
        customer_name: rec.customerName.slice(0, 120) || "Customer",
        phone: (rec.phone || "n/a").slice(0, 40).padEnd(3, " "),
        summary: rec.summary.slice(0, 300), details: rec.details.slice(0, 6000), total: rec.total?.slice(0, 60) ?? null,
      })
      .then(({ error }) => { if (error) console.warn("Order could not be saved to the database:", error.message); });
  } else {
    saveJSON(KEY, [rec, ...listOrders()].slice(0, 500));
  }
  return rec;
}

/** Load the orders for the admin screen. */
export async function loadOrders(): Promise<OrderRecord[]> {
  if (!(isLive && supabase)) return listOrders();
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) { console.warn("Could not load orders:", error.message); return []; }
  return (data as OrderRow[]).map(fromRow);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (isLive && supabase) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) console.warn("Could not update order:", error.message);
    return;
  }
  saveJSON(KEY, listOrders().map((o) => (o.id === id ? { ...o, status } : o)));
}

export async function deleteOrder(id: string): Promise<void> {
  if (isLive && supabase) {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) console.warn("Could not delete order:", error.message);
    return;
  }
  saveJSON(KEY, listOrders().filter((o) => o.id !== id));
}
