import type { CreatedOrder } from "@/core/api/services/orders";

type ConversionParameters = {
  send_to: string;
  value: number;
  currency: string;
  transaction_id: string;
};

type GoogleTagWindow = Window & {
  gtag?: (event: "event", name: "conversion", parameters: ConversionParameters) => void;
};

const reportedOrders = new Set<string>();

// Pay-on-delivery checkout measures order creation, before payment collection.
export function reportPurchaseConversion(order: CreatedOrder): void {
  try {
    if (typeof window === "undefined") return;
    const tagWindow = window as GoogleTagWindow;
    if (typeof tagWindow.gtag !== "function") return;
    if (!order || !Number.isSafeInteger(order.ID) || order.ID <= 0) return;
    if (!Number.isFinite(order.TotalAmount) || order.TotalAmount < 0) return;
    if (!/^[A-Z]{3}$/.test(order.Currency)) return;

    const transactionId = String(order.ID);
    if (reportedOrders.has(transactionId)) return;

    tagWindow.gtag("event", "conversion", {
      send_to: "AW-18306012530/huiUCPy8tswcEPKq_phE",
      value: order.TotalAmount,
      currency: order.Currency,
      transaction_id: transactionId,
    });
    reportedOrders.add(transactionId);
  } catch {
    // Analytics must never turn a successfully created order into a checkout error.
  }
}
