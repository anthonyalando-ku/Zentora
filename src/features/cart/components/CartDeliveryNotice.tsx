import { useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Truck } from "lucide-react";
import { deliveryApi, deliveryPolicyKey } from "@/core/api/services/delivery";
import { fallbackDeliveryNotice } from "@/features/delivery/DeliveryInformation";

/**
 * Compact, expandable delivery notice. The full backend message is always in the
 * DOM; collapsed it is clamped to a short preview, expanded it shows in full.
 */
export function CartDeliveryNotice() {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const policy = useQuery({ queryKey: deliveryPolicyKey, queryFn: deliveryApi.get, staleTime: 60_000, retry: 1 });
  const message = policy.data?.message || fallbackDeliveryNotice;
  const title = policy.data?.included_in_order_total ? "Delivery across Kenya" : "Delivery fee confirmed separately";

  return (
    <section className={"cart-delivery" + (open ? " is-open" : "")}>
      <button type="button" className="cart-delivery-toggle" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen(v => !v)}>
        <span className="cart-delivery-icon" aria-hidden="true"><Truck /></span>
        <strong>{title}</strong>
        <span className="cart-delivery-action">{open ? "Hide" : "View details"}<ChevronDown aria-hidden="true" /></span>
      </button>
      <p id={bodyId} className="cart-delivery-message">{message}</p>
    </section>
  );
}
