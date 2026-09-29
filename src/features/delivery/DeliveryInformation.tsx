import { useQuery } from "@tanstack/react-query";
import { deliveryApi, deliveryPolicyKey, type DeliverySnapshot } from "@/core/api/services/delivery";

export const fallbackDeliveryNotice =
  "Delivery charges are confirmed separately and are not included in the order total.";

export function DeliveryInformation() {
  const query = useQuery({
    queryKey: deliveryPolicyKey,
    queryFn: deliveryApi.get,
    staleTime: 60_000,
    retry: 1,
  });
  return (
    <div className="rounded-xl border border-border bg-secondary/5 p-4 text-sm">
      <p className="font-semibold mb-1">Delivery across Kenya</p>
      <p className="text-foreground/70 whitespace-pre-line">{query.data?.message || fallbackDeliveryNotice}</p>
    </div>
  );
}

export function OrderDeliveryInformation({ snapshot }: { snapshot?: DeliverySnapshot | null }) {
  return (
    <p className="text-sm text-foreground/70 whitespace-pre-line mt-3">
      {snapshot?.notice || "Delivery details were not recorded for this order. Contact us to confirm arrangements."}
    </p>
  );
}
