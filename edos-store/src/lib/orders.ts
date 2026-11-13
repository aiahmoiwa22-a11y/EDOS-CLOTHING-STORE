import { loadJSON, saveJSON } from "@/lib/storage";

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

export const listOrders = (): OrderRecord[] => loadJSON<OrderRecord[]>(KEY, []);

export function saveOrder(o: Omit<OrderRecord, "id" | "createdAt" | "status">): OrderRecord {
  const rec: OrderRecord = {
    ...o,
    id: `EDOS-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  saveJSON(KEY, [rec, ...listOrders()].slice(0, 500));
  return rec;
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  saveJSON(KEY, listOrders().map((o) => (o.id === id ? { ...o, status } : o)));
}

export function deleteOrder(id: string) {
  saveJSON(KEY, listOrders().filter((o) => o.id !== id));
}
