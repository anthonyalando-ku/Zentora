import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
import {
  useAdminDashboardOrderStats,
  useAdminDashboardPendingOrders,
  useAdminDashboardUserStats,
} from "@/features/admin/dashboard/hooks/useAdminDashboard";
import { AdminTable, AdminTableHead, AdminTh, AdminTd, AdminTr } from "@/features/admin/shared/components/AdminTable";
import StatCard from "@/features/admin/dashboard/components/StatCard";
import { IconBag, IconMoney, IconUsers } from "@/features/admin/dashboard/components/Icons";
import StatusPill from "@/features/admin/dashboard/components/StatusPil";
import TableSkeleton from "@/features/admin/dashboard/components/TableSkeleton";
import EmptyState from "@/features/admin/dashboard/components/EmptySate";

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
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Link
              to="/admin/orders"
              className="h-10 px-4 rounded-xl border border-border hover:bg-secondary/10 text-sm font-semibold inline-flex items-center justify-center"
            >
              View orders
            </Link>
            <Link
              to="/admin/products"
              className="h-10 px-4 rounded-xl bg-primary text-white hover:opacity-90 text-sm font-semibold inline-flex items-center justify-center"
            >
              Manage products
            </Link>
          </div>
        }
      />

      {/* KPIs: 1 col mobile / 2 tablet / 4 desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Revenue (today)"
          value={orderStatsQ.data ? orderStatsQ.data.revenue_today : "—"}
          helper={updatedAt ? `Updated: ${updatedAt}` : "—"}
          icon={<IconMoney />}
          tone="info"
        />
        <StatCard
          label="Revenue (last 7 days)"
          value={orderStatsQ.data ? orderStatsQ.data.revenue_7_days : "—"}
          helper={orderStatsQ.data ? `${orderStatsQ.data.orders_7_days} orders` : "—"}
          icon={<IconMoney />}
          tone="default"
        />
        <StatCard
          label="Pending orders"
          value={orderStatsQ.data ? orderStatsQ.data.pending_orders : "—"}
          helper="Needs attention"
          icon={<IconBag />}
          tone="warning"
        />
        <StatCard
          label="Total users"
          value={userStatsQ.data ? userStatsQ.data.total_users : "—"}
          helper={userStatsQ.data ? `${userStatsQ.data.active_users} active` : "—"}
          icon={<IconUsers />}
          tone="success"
        />
      </div>

      {/* Main layout: Pending orders (left) / panels (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 space-y-4 min-w-0">
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
              <TableSkeleton rows={6} />
            ) : pendingQ.isError ? (
              <div className="text-sm text-destructive">Failed to load pending orders.</div>
            ) : pendingOrders.length === 0 ? (
              <EmptyState
                title="No pending orders"
                message="You’re all caught up. New pending orders will appear here for fulfillment."
                action={
                  <Link
                    to="/admin/orders"
                    className="h-10 px-4 rounded-xl border border-border hover:bg-secondary/10 text-sm font-semibold inline-flex items-center justify-center"
                  >
                    View all orders
                  </Link>
                }
              />
            ) : (
              <AdminTable>
                <table className="min-w-[880px] w-full">
                  <AdminTableHead>
                    <tr>
                      <AdminTh>Order</AdminTh>
                      <AdminTh>Customer</AdminTh>
                      <AdminTh>Status</AdminTh>
                      <AdminTh>Total</AdminTh>
                      <AdminTh>Created</AdminTh>
                      <AdminTh className="text-right">Actions</AdminTh>
                    </tr>
                  </AdminTableHead>

                  <tbody>
                    {pendingOrders.map((o) => (
                      <AdminTr key={o.ID}>
                        <AdminTd>
                          <div className="text-sm font-semibold text-foreground">{o.OrderNumber}</div>
                          <div className="text-xs text-foreground/50">#{o.ID}</div>
                        </AdminTd>

                        <AdminTd>
                          <div className="font-medium text-foreground/85">{o.Shipping?.full_name ?? "-"}</div>
                          <div className="text-xs text-foreground/50">{o.Shipping?.phone ?? "-"}</div>
                        </AdminTd>

                        <AdminTd>
                          <StatusPill status={o.Status} />
                        </AdminTd>

                        <AdminTd>
                          <span className="font-semibold">{o.TotalAmount}</span>{" "}
                          <span className="text-xs text-foreground/50">{o.Currency}</span>
                        </AdminTd>

                        <AdminTd className="text-foreground/80">
                          {new Date(o.CreatedAt).toLocaleString()}
                        </AdminTd>

                        <AdminTd className="text-right">
                          <Link
                            to={`/admin/orders/${o.ID}`}
                            className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-semibold inline-flex items-center justify-center"
                          >
                            View
                          </Link>
                        </AdminTd>
                      </AdminTr>
                    ))}
                  </tbody>
                </table>
              </AdminTable>
            )}

            {/* pagination */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-foreground/50">
                Showing offset <span className="font-medium text-foreground">{pendingOffset}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 text-xs font-semibold disabled:opacity-50"
                  disabled={pendingOffset <= 0 || pendingQ.isLoading}
                  onClick={() => setPendingOffset((v) => Math.max(0, v - pendingLimit))}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 text-xs font-semibold disabled:opacity-50"
                  disabled={pendingOrders.length < pendingLimit || pendingQ.isLoading}
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
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                ))}
              </div>
            ) : userStatsQ.isError ? (
              <div className="text-sm text-destructive">Failed to load user stats.</div>
            ) : !userStatsQ.data ? (
              <div className="text-sm text-foreground/60">No data.</div>
            ) : (
              <div className="divide-y divide-border text-sm">
                <Row label="Active users" value={userStatsQ.data.active_users} />
                <Row label="Pending verification" value={userStatsQ.data.pending_verification_users} />
                <Row label="Suspended users" value={userStatsQ.data.suspended_users} />
                <Row
                  label="Admins"
                  value={
                    <span className="font-semibold">
                      {userStatsQ.data.admin_users}{" "}
                      <span className="text-xs text-foreground/50">(super: {userStatsQ.data.super_admin_users})</span>
                    </span>
                  }
                />
              </div>
            )}
          </ProductHubSection>

          <ProductHubSection title="Order health" description="Fast snapshot to triage issues.">
            {orderStatsQ.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
                ))}
              </div>
            ) : orderStatsQ.isError ? (
              <div className="text-sm text-destructive">Failed to load order stats.</div>
            ) : !orderStatsQ.data ? (
              <div className="text-sm text-foreground/60">No data.</div>
            ) : (
              <div className="divide-y divide-border text-sm">
                <Row label="Completed orders" value={orderStatsQ.data.completed_orders} />
                <Row label="Cancelled orders" value={orderStatsQ.data.cancelled_orders} />
                <Row label="Orders (today)" value={orderStatsQ.data.orders_today} />
              </div>
            )}
          </ProductHubSection>
        </div>
      </div>
    </div>
  );
}

/* small helper row component */
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-foreground/55">{label}</span>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);