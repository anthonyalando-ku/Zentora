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
import { cn } from "@/shared/utils/cn";

/* ─── helpers ───────────────────────────────────────────── */

function fmt(n: number | undefined, currency?: string) {
  if (n == null) return "—";
  if (currency) {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  }
  return new Intl.NumberFormat("en-KE").format(n);
}

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/* ─── page ──────────────────────────────────────────────── */

export default function AdminDashboardPage() {
  const userStatsQ = useAdminDashboardUserStats();
  const orderStatsQ = useAdminDashboardOrderStats();

  const [pendingLimit] = useState(10);
  const [pendingOffset, setPendingOffset] = useState(0);
  const pendingQ = useAdminDashboardPendingOrders(pendingLimit, pendingOffset);

  const pendingOrders = pendingQ.data?.orders ?? [];
  const currency = pendingOrders[0]?.Currency ?? "KES";

  const updatedAt = useMemo(() => {
    const u = orderStatsQ.data?.updated_at;
    if (!u) return null;
    try { return fmtDate(u); } catch { return null; }
  }, [orderStatsQ.data?.updated_at]);

  const isFirstPage = pendingOffset === 0;
  const hasNext = pendingOrders.length >= pendingLimit;
  const currentPage = Math.floor(pendingOffset / pendingLimit) + 1;

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ─────────────────────────────────────────── */}
      <AdminPageHeader
        title="Dashboard"
        subtitle="Operational overview · orders, revenue, and users."
        breadcrumbs={[{ label: "Admin", href: "/admin" }]}
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/orders"
              className="h-9 px-4 rounded-xl border border-border bg-background hover:bg-secondary/10 text-sm font-medium text-foreground/80 inline-flex items-center gap-1.5 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M7 3h10a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" />
              </svg>
              Orders
            </Link>
            <Link
              to="/admin/products"
              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-sm font-semibold inline-flex items-center gap-1.5 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
              </svg>
              Manage products
            </Link>
          </div>
        }
      />

      {/* ── KPI cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Revenue today"
          value={orderStatsQ.data ? fmt(orderStatsQ.data.revenue_today, currency) : "—"}
          helper={updatedAt ? `Updated ${updatedAt}` : "Loading…"}
          icon={<IconMoney />}
          tone="info"
        />
        <StatCard
          label="Revenue · 7 days"
          value={orderStatsQ.data ? fmt(orderStatsQ.data.revenue_7_days, currency) : "—"}
          helper={orderStatsQ.data ? `${fmt(orderStatsQ.data.orders_7_days)} orders placed` : "—"}
          icon={<IconMoney />}
          tone="default"
        />
        <StatCard
          label="Pending orders"
          value={orderStatsQ.data ? fmt(orderStatsQ.data.pending_orders) : "—"}
          helper="Awaiting fulfillment"
          icon={<IconBag />}
          tone="warning"
        />
        <StatCard
          label="Registered users"
          value={userStatsQ.data ? fmt(userStatsQ.data.total_users) : "—"}
          helper={userStatsQ.data ? `${fmt(userStatsQ.data.active_users)} active` : "—"}
          icon={<IconUsers />}
          tone="success"
        />
      </div>

      {/* ── Main grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        {/* Pending orders */}
        <div className="lg:col-span-8 min-w-0">
          <SectionCard
            title="Pending orders"
            description="Requires fulfillment · sorted by newest"
            badge={
              orderStatsQ.data?.pending_orders != null ? (
                <span className="inline-flex items-center h-5 px-2 rounded-full bg-amber-500/10 text-amber-700 text-[11px] font-semibold tabular-nums">
                  {fmt(orderStatsQ.data.pending_orders)}
                </span>
              ) : null
            }
            action={
              <Link
                to="/admin/orders?statuses=pending"
                className="h-8 px-3 rounded-xl border border-border hover:bg-secondary/10 text-xs font-medium text-foreground/70 inline-flex items-center gap-1 transition"
              >
                See all
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            }
          >
            {pendingQ.isLoading ? (
              <TableSkeleton rows={6} />
            ) : pendingQ.isError ? (
              <ErrorBanner message="Failed to load pending orders." />
            ) : pendingOrders.length === 0 ? (
              <EmptyState
                title="No pending orders"
                message="You're all caught up. New pending orders will appear here for fulfillment."
                action={
                  <Link
                    to="/admin/orders"
                    className="h-9 px-4 rounded-xl border border-border hover:bg-secondary/10 text-sm font-medium text-foreground/80 inline-flex items-center transition"
                  >
                    View all orders
                  </Link>
                }
              />
            ) : (
              <AdminTable>
                <table className="min-w-[880px] w-full border-collapse">
                  <AdminTableHead>
                    <tr className="border-b border-border">
                      <AdminTh className="px-4 py-3 text-[11px] uppercase tracking-widest font-semibold text-foreground/40">Order</AdminTh>
                      <AdminTh className="px-4 py-3 text-[11px] uppercase tracking-widest font-semibold text-foreground/40">Customer</AdminTh>
                      <AdminTh className="px-4 py-3 text-[11px] uppercase tracking-widest font-semibold text-foreground/40">Status</AdminTh>
                      <AdminTh className="px-4 py-3 text-[11px] uppercase tracking-widest font-semibold text-foreground/40">Total</AdminTh>
                      <AdminTh className="px-4 py-3 text-[11px] uppercase tracking-widest font-semibold text-foreground/40">Placed</AdminTh>
                      <AdminTh className="px-4 py-3 text-[11px] uppercase tracking-widest font-semibold text-foreground/40 text-right">Action</AdminTh>
                    </tr>
                  </AdminTableHead>

                  <tbody>
                    {pendingOrders.map((o) => (
                      <AdminTr
                        key={o.ID}
                        className="border-b border-border hover:bg-secondary/5 transition-colors"
                      >
                        <AdminTd className="px-4 py-3.5">
                          <p className="text-[13px] font-semibold text-foreground font-mono">{o.OrderNumber}</p>
                          <p className="text-[11px] text-foreground/40 mt-0.5">#{o.ID}</p>
                        </AdminTd>

                        <AdminTd className="px-4 py-3.5">
                          <p className="text-[13px] font-medium text-foreground/85">{o.Shipping?.full_name ?? "—"}</p>
                          <p className="text-[11px] text-foreground/40 mt-0.5">{o.Shipping?.phone ?? "—"}</p>
                        </AdminTd>

                        <AdminTd className="px-4 py-3.5">
                          <StatusPill status={o.Status} />
                        </AdminTd>

                        <AdminTd className="px-4 py-3.5">
                          <span className="text-[13px] font-semibold text-foreground tabular-nums">
                            {fmt(o.TotalAmount, o.Currency)}
                          </span>
                        </AdminTd>

                        <AdminTd className="px-4 py-3.5">
                          <span className="text-[12px] text-foreground/55 tabular-nums">
                            {fmtDate(o.CreatedAt)}
                          </span>
                        </AdminTd>

                        <AdminTd className="px-4 py-3.5 text-right">
                          <Link
                            to={`/admin/orders/${o.ID}`}
                            className="h-8 px-3 rounded-xl border border-border hover:bg-secondary/10 text-[12px] font-medium text-foreground/70 inline-flex items-center gap-1 transition"
                          >
                            Review
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </AdminTd>
                      </AdminTr>
                    ))}
                  </tbody>
                </table>
              </AdminTable>
            )}

            {/* Pagination */}
            {!pendingQ.isLoading && !pendingQ.isError && pendingOrders.length > 0 && (
              <div className="mt-4 px-4 pb-2 flex items-center justify-between gap-3">
                <p className="text-[12px] text-foreground/40">
                  Page{" "}
                  <span className="font-medium text-foreground/70">{currentPage}</span>
                  {" · "}
                  <span className="font-medium text-foreground/70">{pendingOrders.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="h-8 px-3 rounded-xl border border-border hover:bg-secondary/10 text-[12px] font-medium text-foreground/70 inline-flex items-center gap-1 transition disabled:opacity-40 disabled:pointer-events-none"
                    disabled={isFirstPage || pendingQ.isLoading}
                    onClick={() => setPendingOffset((v) => Math.max(0, v - pendingLimit))}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Prev
                  </button>
                  <button
                    type="button"
                    className="h-8 px-3 rounded-xl border border-border hover:bg-secondary/10 text-[12px] font-medium text-foreground/70 inline-flex items-center gap-1 transition disabled:opacity-40 disabled:pointer-events-none"
                    disabled={!hasNext || pendingQ.isLoading}
                    onClick={() => setPendingOffset((v) => v + pendingLimit)}
                  >
                    Next
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right panels */}
        <div className="lg:col-span-4 space-y-4">
          <SectionCard title="Users" description="Account totals & admin footprint">
            {userStatsQ.isLoading ? (
              <RowSkeleton count={4} />
            ) : userStatsQ.isError ? (
              <ErrorBanner message="Failed to load user stats." />
            ) : !userStatsQ.data ? (
              <p className="text-sm text-foreground/50 py-6 text-center">No data available.</p>
            ) : (
              <dl className="divide-y divide-border">
                <MetricRow label="Active" value={fmt(userStatsQ.data.active_users)} accent="success" />
                <MetricRow label="Pending verification" value={fmt(userStatsQ.data.pending_verification_users)} accent="warning" />
                <MetricRow label="Suspended" value={fmt(userStatsQ.data.suspended_users)} accent="danger" />
                <MetricRow
                  label="Admins"
                  value={
                    <span className="tabular-nums">
                      {fmt(userStatsQ.data.admin_users)}{" "}
                      <span className="text-[11px] text-foreground/40 font-normal">
                        ({fmt(userStatsQ.data.super_admin_users)} super)
                      </span>
                    </span>
                  }
                />
              </dl>
            )}
          </SectionCard>

          <SectionCard title="Order health" description="Quick triage snapshot">
            {orderStatsQ.isLoading ? (
              <RowSkeleton count={3} />
            ) : orderStatsQ.isError ? (
              <ErrorBanner message="Failed to load order stats." />
            ) : !orderStatsQ.data ? (
              <p className="text-sm text-foreground/50 py-6 text-center">No data available.</p>
            ) : (
              <dl className="divide-y divide-border">
                <MetricRow label="Completed" value={fmt(orderStatsQ.data.completed_orders)} accent="success" />
                <MetricRow label="Cancelled" value={fmt(orderStatsQ.data.cancelled_orders)} accent="danger" />
                <MetricRow label="Total orders" value={fmt(orderStatsQ.data.total_orders)} />
                <MetricRow label="Orders today" value={fmt(orderStatsQ.data.orders_today)} accent="info" />
              </dl>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ─── shared sub-components ─────────────────────────────── */

function SectionCard({
  title,
  description,
  badge,
  action,
  children,
}: {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background overflow-hidden shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-semibold text-foreground truncate">{title}</h2>
            {badge}
          </div>
          {description && (
            <p className="text-[12px] text-foreground/45 mt-0.5 truncate">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}

const accentMap = {
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-destructive",
  info: "text-primary",
};

function MetricRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: keyof typeof accentMap;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3 gap-4">
      <dt className="text-[13px] text-foreground/55 truncate">{label}</dt>
      <dd className={cn("text-[13px] font-semibold tabular-nums shrink-0", accent ? accentMap[accent] : "text-foreground")}>
        {value}
      </dd>
    </div>
  );
}

function RowSkeleton({ count }: { count: number }) {
  return (
    <div className="px-5 py-1 space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3">
          <div
            className="h-3 w-28 rounded-md bg-foreground/8 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
          <div
            className="h-3 w-12 rounded-md bg-foreground/8 animate-pulse"
            style={{ animationDelay: `${i * 80 + 40}ms` }}
          />
        </div>
      ))}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mx-4 my-3 flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-destructive/8 border border-destructive/15">
      <svg className="w-4 h-4 text-destructive shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      </svg>
      <span className="text-[13px] font-medium text-destructive">{message}</span>
    </div>
  );
}