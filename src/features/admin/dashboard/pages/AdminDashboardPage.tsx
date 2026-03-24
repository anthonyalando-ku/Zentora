import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
import {
  useAdminDashboardOrderStats,
  useAdminDashboardPendingOrders,
  useAdminDashboardUserStats,
} from "@/features/admin/dashboard/hooks/useAdminDashboard";

const StatCard = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: React.ReactNode;
  helper?: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border bg-background shadow-sm p-4">
    <div className="text-xs text-foreground/50">{label}</div>
    <div className="mt-1 text-xl font-bold">{value}</div>
    {helper ? <div className="mt-1 text-xs text-foreground/50">{helper}</div> : null}
  </div>
);

const StatusPill = ({ status }: { status: string }) => {
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

export default function AdminDashboardPage() {
  const userStatsQ = useAdminDashboardUserStats();
  const orderStatsQ = useAdminDashboardOrderStats();

  const [pendingLimit] = useState(10);
  const [pendingOffset, setPendingOffset] = useState(0);
  const pendingQ = useAdminDashboardPendingOrders(pendingLimit, pendingOffset);

  const pendingOrders = pendingQ.data?.orders ?? [];

  const updatedAt = useMemo(() => {
    const u = orderStatsQ.data?.updated_at;
    if (!u) return null;
    try {
      return new Date(u).toLocaleString();
    } catch {
      return null;
    }
  }, [orderStatsQ.data?.updated_at]);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Operational overview for orders, revenue, and users."
        breadcrumbs={[{ label: "Admin", href: "/admin" }]}
        action={
          <div className="inline-flex items-center gap-2">
            <Link
              to="/admin/orders"
              className="h-10 px-4 rounded-xl border border-border hover:bg-secondary/10 text-sm font-semibold inline-flex items-center"
            >
              View orders
            </Link>
            <Link
              to="/admin/products"
              className="h-10 px-4 rounded-xl bg-primary text-white hover:opacity-90 text-sm font-semibold inline-flex items-center"
            >
              Manage products
            </Link>
          </div>
        }
      />

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Revenue (today)" value={orderStatsQ.data ? orderStatsQ.data.revenue_today : "—"} helper={updatedAt ? `Updated: ${updatedAt}` : undefined} />
        <StatCard label="Revenue (7 days)" value={orderStatsQ.data ? orderStatsQ.data.revenue_7_days : "—"} helper={orderStatsQ.data ? `${orderStatsQ.data.orders_7_days} orders` : undefined} />
        <StatCard label="Pending orders" value={orderStatsQ.data ? orderStatsQ.data.pending_orders : "—"} helper="Needs attention" />
        <StatCard label="Total users" value={userStatsQ.data ? userStatsQ.data.total_users : "—"} helper={userStatsQ.data ? `${userStatsQ.data.active_users} active` : undefined} />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 space-y-4">
          <ProductHubSection
            title="Pending orders"
            description="Latest pending orders requiring fulfillment."
            action={
              <Link
                to="/admin/orders?statuses=pending"
                className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
              >
                See all
              </Link>
            }
          >
            {pendingQ.isLoading ? (
              <div className="text-sm text-foreground/60">Loading pending orders…</div>
            ) : pendingQ.isError ? (
              <div className="text-sm text-destructive">Failed to load pending orders.</div>
            ) : pendingOrders.length === 0 ? (
              <div className="text-sm text-foreground/60">No pending orders.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[880px] w-full">
                  <thead className="bg-secondary/5">
                    <tr className="text-left">
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Order</th>
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Customer</th>
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Total</th>
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60">Created</th>
                      <th className="px-4 py-3 text-xs font-semibold text-foreground/60 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.map((o) => (
                      <tr key={o.id} className="border-t border-border hover:bg-secondary/5 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold">{o.order_number}</div>
                          <div className="text-xs text-foreground/50">#{o.id}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium text-foreground/80">{o.shipping.full_name ?? ""}</div>
                          <div className="text-xs text-foreground/50">{o.shipping.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusPill status={o.status} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {o.total_amount} <span className="text-xs text-foreground/50">{o.currency}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">{new Date(o.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/admin/orders/${o.id}`}
                            className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-semibold inline-flex items-center"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-foreground/50">Offset: {pendingOffset}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 text-xs font-semibold disabled:opacity-50"
                  disabled={pendingOffset <= 0}
                  onClick={() => setPendingOffset((v) => Math.max(0, v - pendingLimit))}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 text-xs font-semibold disabled:opacity-50"
                  disabled={pendingOrders.length < pendingLimit}
                  onClick={() => setPendingOffset((v) => v + pendingLimit)}
                >
                  Next
                </button>
              </div>
            </div>
          </ProductHubSection>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ProductHubSection title="Users" description="Account totals and admin footprint.">
            {userStatsQ.isLoading ? (
              <div className="text-sm text-foreground/60">Loading user stats…</div>
            ) : userStatsQ.isError ? (
              <div className="text-sm text-destructive">Failed to load user stats.</div>
            ) : !userStatsQ.data ? (
              <div className="text-sm text-foreground/60">No data.</div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/50">Active</span>
                  <span className="font-semibold">{userStatsQ.data.active_users}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/50">Pending verification</span>
                  <span className="font-semibold">{userStatsQ.data.pending_verification_users}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/50">Suspended</span>
                  <span className="font-semibold">{userStatsQ.data.suspended_users}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-foreground/50">Admins</span>
                  <span className="font-semibold">
                    {userStatsQ.data.admin_users}{" "}
                    <span className="text-xs text-foreground/50">(super: {userStatsQ.data.super_admin_users})</span>
                  </span>
                </div>
              </div>
            )}
          </ProductHubSection>

          <ProductHubSection title="Order health" description="Fast snapshot to triage issues.">
            {orderStatsQ.isLoading ? (
              <div className="text-sm text-foreground/60">Loading order stats…</div>
            ) : orderStatsQ.isError ? (
              <div className="text-sm text-destructive">Failed to load order stats.</div>
            ) : !orderStatsQ.data ? (
              <div className="text-sm text-foreground/60">No data.</div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/50">Completed</span>
                  <span className="font-semibold">{orderStatsQ.data.completed_orders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/50">Cancelled</span>
                  <span className="font-semibold">{orderStatsQ.data.cancelled_orders}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-foreground/50">Orders (today)</span>
                  <span className="font-semibold">{orderStatsQ.data.orders_today}</span>
                </div>
              </div>
            )}
          </ProductHubSection>
        </div>
      </div>
    </div>
  );
}