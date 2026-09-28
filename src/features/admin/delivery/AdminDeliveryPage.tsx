import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deliveryApi, deliveryPolicyKey, type DeliveryPolicy } from "@/core/api/services/delivery";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";

const adminKey = ["admin", "delivery-policy"];

function DeliveryForm({ policy, onSaved }: { policy: DeliveryPolicy; onSaved: () => void }) {
  const client = useQueryClient();
  const [fee, setFee] = useState(String(policy.nairobi_indicative_fee));
  const [note, setNote] = useState(policy.additional_information);
  const mutation = useMutation({
    mutationFn: deliveryApi.update,
    onSuccess: (saved) => {
      client.setQueryData(deliveryPolicyKey, saved);
      client.setQueryData(adminKey, saved);
      onSaved();
    },
  });
  const amount = Number(fee);
  const valid = fee.trim() !== "" && Number.isInteger(amount) && amount >= 1 && amount <= 100000 && [...note].length <= 1000;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!valid || mutation.isPending) return;
    mutation.mutate({ expected_version: policy.version, nairobi_indicative_fee: amount, additional_information: note });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5 rounded-2xl border border-border p-6">
      <div><p className="font-semibold">Kenya — nationwide</p><p className="text-sm text-foreground/60">Delivery is confirmed separately and excluded from order totals.</p></div>
      <label className="block text-sm font-medium">
        Indicative Nairobi delivery fee (KES)
        <input type="number" min="1" max="100000" step="1" required value={fee} onChange={(e) => setFee(e.target.value)} disabled={mutation.isPending} className="mt-2 block w-full rounded-lg border border-border bg-background p-3" />
        <span className="block mt-1 text-xs text-foreground/60">Information only. This does not charge customers or update existing orders.</span>
      </label>
      <label className="block text-sm font-medium">
        Additional delivery information (optional)
        <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={3} disabled={mutation.isPending} className="mt-2 block w-full rounded-lg border border-border bg-background p-3" />
      </label>
      <div className="rounded-xl bg-secondary/10 p-4 text-sm whitespace-pre-line">
        <p className="font-semibold mb-2">Customer preview</p>
        <p>We deliver across Kenya. Standard Nairobi delivery is typically KES {valid ? amount : "…"}; the actual fee depends on your location. We will contact you to confirm delivery charges. Delivery is not included in your order total.{note.trim() ? ` ${note.trim()}` : ""}</p>
      </div>
      <p className="text-xs text-foreground/60">Last saved: {new Date(policy.updated_at).toLocaleString()}</p>
      {mutation.isError && <div role="alert" className="text-sm text-red-600"><p>{mutation.error.message}</p><button type="button" className="underline mt-1" onClick={() => void client.invalidateQueries({ queryKey: adminKey })}>Reload saved settings</button></div>}
      <button disabled={!valid || mutation.isPending} className="rounded-lg bg-primary px-5 py-3 text-white font-semibold disabled:opacity-50">{mutation.isPending ? "Saving…" : "Save changes"}</button>
    </form>
  );
}

export default function AdminDeliveryPage() {
  const [saved, setSaved] = useState(false);
  const query = useQuery({ queryKey: adminKey, queryFn: deliveryApi.getAdmin, retry: 1, staleTime: Infinity, refetchOnWindowFocus: false });
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Delivery settings" />
      {saved && <p role="status" className="text-sm text-green-700">Delivery settings saved.</p>}
      {query.isPending && <p>Loading delivery settings…</p>}
      {query.isError && <div role="alert"><p>Could not load delivery settings.</p><button onClick={() => void query.refetch()} className="underline">Try again</button></div>}
      {query.data && <DeliveryForm key={query.data.version} policy={query.data} onSaved={() => setSaved(true)} />}
    </div>
  );
}
