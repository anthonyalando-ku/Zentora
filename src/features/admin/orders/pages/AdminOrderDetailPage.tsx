import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
import { useAdminOrder, useUpdateAdminOrderStatus } from "@/features/admin/orders/hooks/useAdminOrders";
import type { OrderStatus } from "@/features/admin/orders/api/adminOrdersApi";

const statusOptions: OrderStatus[] = ["pending", "shipped", "delivered", "completed", "cancelled"];

const StatusPill = ({ status }: { status: OrderStatus }) => {
  const cls =
    status === "pending"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-700"
      : status === "shipped"
        ? "border-blue-500/20 bg-blue-500/10 text-blue-700"
        : status === "delivered"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
          : status === "completed"
            ? "border-primary/20 bg-primary/10 text-primary"
            : "border-destructive/20 bg-destructive/10 text-destructive";

  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`}>{status}</span>;
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  const orderQ = useAdminOrder(orderId);
  const update = useUpdateAdminOrderStatus(orderId);

  const [nextStatus, setNextStatus] = useState<OrderStatus>("pending");

  const order = orderQ.data;

  useEffect(() => {
    if (order) setNextStatus(order.status);
  }, [order]);

  if (orderQ.isLoading) {
    return <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">Loading order…</div>;
  }
  if (!order) {
    return <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">Order not found.</div>;
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={`Order ${order.order_number}`}
        subtitle={`#${order.id}`}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: order.order_number, href: `/admin/orders/${order.id}` },
        ]}
        action={
          <div className="inline-flex items-center gap-2">
            <Link to="/admin/orders" className="h-10 px-4 rounded-xl border border-border hover:bg-secondary/10 text-sm font-semibold inline-flex items-center">
              Back
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8 space-y-4">
          <ProductHubSection title="Items" description="Products included in this order.">
            {order.items && order.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full">
                  <thead className="bg-secondary/5">
                    <tr className="text-left">
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Product</th>
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Variant</th>
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Qty</th>
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Unit</th>
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((it) => (
                      <tr key={it.id} className="border-t border-border">
                        <td className="px-4 py-3 text-sm font-medium">{it.product_name}</td>
                        <td className="px-4 py-3 text-sm">{it.variant_id ?? "—"}</td>
                        <td className="px-4 py-3 text-sm">{it.quantity}</td>
                        <td className="px-4 py-3 text-sm">{it.unit_price}</td>
                        <td className="px-4 py-3 text-sm">{it.total_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-foreground/60">No items.</div>
            )}
          </ProductHubSection>

          <ProductHubSection title="Shipping" description="Customer shipping information.">
            <div className="text-sm text-foreground/70 space-y-1">
              <div>
                <span className="text-foreground/50">Name:</span> {order.shipping.full_name}
              </div>
              <div>
                <span className="text-foreground/50">Phone:</span> {order.shipping.phone}
              </div>
              <div>
                <span className="text-foreground/50">Address:</span> {order.shipping.address_line_1}
                {order.shipping.address_line_2 ? `, ${order.shipping.address_line_2}` : ""}
              </div>
              <div>
                <span className="text-foreground/50">City:</span> {order.shipping.city} {order.shipping.area ? `(${order.shipping.area})` : ""}
              </div>
              <div>
                <span className="text-foreground/50">Country:</span> {order.shipping.country}
              </div>
            </div>
          </ProductHubSection>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <ProductHubSection title="Summary" description="Totals and status.">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-foreground/50">Status</span>
                <div className="flex items-center gap-2">
                  <StatusPill status={order.status} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-foreground/50">Subtotal</span>
                <span className="font-semibold">{order.subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground/50">Shipping</span>
                <span className="font-semibold">{order.shipping_fee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground/50">Discount</span>
                <span className="font-semibold">{order.discount_amount}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-foreground/50">Total</span>
                <span className="font-bold text-foreground">
                  {order.total_amount} <span className="text-xs text-foreground/50">{order.currency}</span>
                </span>
              </div>

              <div className="pt-4">
                <div className="text-xs text-foreground/60">Update status</div>
                <select
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value as OrderStatus)}
                  className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {nextStatus === "cancelled" ? (
                  <div className="mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-foreground/70">
                    Cancelling an order may require manual inventory/fulfillment handling.
                  </div>
                ) : null}

                <button
                  type="button"
                  disabled={update.isPending || nextStatus === order.status}
                  className="mt-3 w-full h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
                  onClick={() => update.mutate({ status: nextStatus })}
                >
                  {update.isPending ? "Saving…" : "Save status"}
                </button>

                {update.isError ? <div className="mt-2 text-xs text-destructive">Failed to update status.</div> : null}
                {update.isSuccess ? <div className="mt-2 text-xs text-foreground/60">Status updated.</div> : null}
              </div>
            </div>
          </ProductHubSection>
        </div>
      </div>
    </div>
  );
}