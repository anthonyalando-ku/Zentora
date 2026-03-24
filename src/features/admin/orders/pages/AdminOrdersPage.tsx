import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { useAdminOrderStats, useAdminOrdersList } from "@/features/admin/orders/hooks/useAdminOrders";
import type { ListOrdersParams, OrderStatus, Order } from "@/features/admin/orders/api/adminOrdersApi";
import { adminOrdersApi } from "@/features/admin/orders/api/adminOrdersApi";

const statusOptions: OrderStatus[] = ["pending", "shipped", "delivered", "completed", "cancelled"];

function toRFC3339DateStart(d: string) {
  return d ? new Date(`${d}T00:00:00.000Z`).toISOString() : "";
}
function toRFC3339DateEnd(d: string) {
  return d ? new Date(`${d}T23:59:59.999Z`).toISOString() : "";
}

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

export default function AdminOrdersPage() {
  const statsQ = useAdminOrderStats();
  const [sp, setSp] = useSearchParams();

  const [status, setStatus] = useState<string>(sp.get("statuses") ?? "");
  const [orderNumber, setOrderNumber] = useState<string>(sp.get("order_number") ?? "");
  const [userId, setUserId] = useState<string>(sp.get("user_id") ?? "");
  const [from, setFrom] = useState<string>(sp.get("from") ?? "");
  const [to, setTo] = useState<string>(sp.get("to") ?? "");
  const [limit, setLimit] = useState<number>(Number(sp.get("limit") ?? 20));
  const [offset, setOffset] = useState<number>(Number(sp.get("offset") ?? 0));

  // Quick lookup by number
  const [lookup, setLookup] = useState("");
  const [lookupErr, setLookupErr] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const params: ListOrdersParams = useMemo(
    () => ({
      statuses: status || undefined,
      order_number: orderNumber || undefined,
      user_id: userId || undefined,
      created_from: from ? toRFC3339DateStart(from) : undefined,
      created_to: to ? toRFC3339DateEnd(to) : undefined,
      limit,
      offset,
      sort_by: "created_at",
      sort_desc: true,
    }),
    [status, orderNumber, userId, from, to, limit, offset]
  );

  const listQ = useAdminOrdersList(params);

  const [openStatus, setOpenStatus] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus>("pending");
  const [saving, setSaving] = useState(false);

  const applyFilters = () => {
    const next = new URLSearchParams(sp);
    if (status) next.set("statuses", status);
    else next.delete("statuses");

    if (orderNumber) next.set("order_number", orderNumber);
    else next.delete("order_number");

    if (userId) next.set("user_id", userId);
    else next.delete("user_id");

    if (from) next.set("from", from);
    else next.delete("from");

    if (to) next.set("to", to);
    else next.delete("to");

    next.set("limit", String(limit));
    next.set("offset", String(0));
    setOffset(0);

    setSp(next);
  };

  const resetFilters = () => {
    setStatus("");
    setOrderNumber("");
    setUserId("");
    setFrom("");
    setTo("");
    setOffset(0);
    setLimit(20);
    setSp(new URLSearchParams());
  };

  const orders = listQ.data?.orders ?? [];

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Orders"
        subtitle="Manage orders, track revenue, and update statuses."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <input
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              placeholder="Quick lookup: ZNT-..."
              className="h-10 w-[240px] rounded-xl border border-border bg-background px-3 text-sm"
            />
            <button
              type="button"
              disabled={lookupLoading || !lookup.trim()}
              className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              onClick={async () => {
                const n = lookup.trim();
                if (!n) return;
                setLookupErr(null);
                setLookupLoading(true);
                try {
                  const o = await adminOrdersApi.getByNumber(n);
                  window.location.href = `/admin/orders/${o.id}`;
                } catch (e: any) {
                  setLookupErr("Order not found.");
                } finally {
                  setLookupLoading(false);
                }
              }}
            >
              {lookupLoading ? "…" : "Go"}
            </button>
          </div>
        }
      />

      {lookupErr ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{lookupErr}</div> : null}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-background shadow-sm p-4">
          <div className="text-xs text-foreground/50">Total orders</div>
          <div className="mt-1 text-xl font-bold">{statsQ.data?.total_orders ?? "—"}</div>
        </div>
        <div className="rounded-2xl border border-border bg-background shadow-sm p-4">
          <div className="text-xs text-foreground/50">Pending</div>
          <div className="mt-1 text-xl font-bold">{statsQ.data?.pending_orders ?? "—"}</div>
        </div>
        <div className="rounded-2xl border border-border bg-background shadow-sm p-4">
          <div className="text-xs text-foreground/50">Revenue (7d)</div>
          <div className="mt-1 text-xl font-bold">{statsQ.data ? `${statsQ.data.revenue_7_days}` : "—"}</div>
        </div>
        <div className="rounded-2xl border border-border bg-background shadow-sm p-4">
          <div className="text-xs text-foreground/50">Revenue (total)</div>
          <div className="mt-1 text-xl font-bold">{statsQ.data ? `${statsQ.data.revenue_total}` : "—"}</div>
        </div>
      </div>

      {/* Filters + table */}
      <ProductHubSection
        title="Order list"
        description="Filter orders and update status."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
            >
              Reset
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
          <div>
            <div className="text-xs text-foreground/60">Status</div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm">
              <option value="">All</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="pending,shipped,delivered,completed,cancelled">Any (all statuses)</option>
            </select>
          </div>

          <div>
            <div className="text-xs text-foreground/60">Order number</div>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm"
              placeholder="ZNT-..."
            />
          </div>

          <div>
            <div className="text-xs text-foreground/60">User ID</div>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm" placeholder="e.g. 123" />
          </div>

          <div>
            <div className="text-xs text-foreground/60">From</div>
            <input value={from} onChange={(e) => setFrom(e.target.value)} type="date" className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm" />
          </div>

          <div>
            <div className="text-xs text-foreground/60">To</div>
            <input value={to} onChange={(e) => setTo(e.target.value)} type="date" className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm" />
          </div>

          <div>
            <div className="text-xs text-foreground/60">Page size</div>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {listQ.isLoading ? (
            <div className="text-sm text-foreground/60">Loading orders…</div>
          ) : listQ.isError ? (
            <div className="text-sm text-destructive">Failed to load orders.</div>
          ) : orders.length === 0 ? (
            <div className="text-sm text-foreground/60">No orders found.</div>
          ) : (
            <table className="min-w-[1120px] w-full">
              <thead className="bg-secondary/5">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Order</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">User</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Total</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Created</th>
                  <th className="px-4 py-3 text-xs font-semibold text-foreground/60 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-secondary/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold">{o.order_number}</div>
                      <div className="text-xs text-foreground/50">#{o.id}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{o.user_id ?? "—"}</td>
                    <td className="px-4 py-3 text-sm">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {o.total_amount} <span className="text-xs text-foreground/50">{o.currency}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(o.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link to={`/admin/orders/${o.id}`} className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-semibold inline-flex items-center">
                          View
                        </Link>
                        <button
                          type="button"
                          className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-semibold"
                          onClick={() => {
                            setSelectedOrder(o);
                            setNextStatus(o.status);
                            setOpenStatus(true);
                          }}
                        >
                          Update status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-foreground/50">Offset: {offset}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 text-xs font-semibold disabled:opacity-50"
              disabled={offset <= 0}
              onClick={() => {
                const next = Math.max(0, offset - limit);
                setOffset(next);
                const n = new URLSearchParams(sp);
                n.set("offset", String(next));
                n.set("limit", String(limit));
                setSp(n);
              }}
            >
              Prev
            </button>
            <button
              type="button"
              className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 text-xs font-semibold disabled:opacity-50"
              disabled={orders.length < limit}
              onClick={() => {
                const next = offset + limit;
                setOffset(next);
                const n = new URLSearchParams(sp);
                n.set("offset", String(next));
                n.set("limit", String(limit));
                setSp(n);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </ProductHubSection>

      {/* Status modal */}
      <AdminModal
        open={openStatus}
        title="Update order status"
        subtitle={selectedOrder ? `${selectedOrder.order_number} (#${selectedOrder.id})` : ""}
        onClose={() => setOpenStatus(false)}
      >
        {!selectedOrder ? null : (
          <div className="space-y-4">
            <div className="text-sm text-foreground/60">
              Current status: <span className="font-semibold text-foreground">{selectedOrder.status}</span>
            </div>

            <div>
              <div className="text-xs text-foreground/60">New status</div>
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
            </div>

            {nextStatus === "cancelled" ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-foreground/70">
                Cancelling an order may require manual inventory/fulfillment handling. Confirm before proceeding.
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                className="flex-1 h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
                onClick={async () => {
                  setSaving(true);
                  try {
                    await adminOrdersApi.updateStatus(selectedOrder.id, nextStatus);
                    setOpenStatus(false);
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? "Saving…" : "Save"}
              </button>

              <button
                type="button"
                disabled={saving}
                className="h-11 px-4 rounded-xl border border-border hover:bg-secondary/10 text-sm font-semibold disabled:opacity-50"
                onClick={() => setOpenStatus(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}