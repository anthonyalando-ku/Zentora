import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

export const OrdersTab = ({ ordersQuery }: { ordersQuery: any }) => {
  if (ordersQuery.isLoading) {
    return <p className="text-sm text-foreground/60">Loading orders…</p>;
  }

  const orders = ordersQuery.data?.orders ?? [];

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-background shadow-sm p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4a2 2 0 001-1.73z"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2">No orders yet</h3>
        <p className="text-sm text-foreground/60">When you place orders, they’ll appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {orders.map((o: any) => (
        <Link
          key={o.ID}
          to={`/account/orders/${o.ID}`}
          className="group block rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition overflow-hidden"
        >
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground line-clamp-1">{o.OrderNumber}</div>
                <div className="text-xs text-foreground/60 mt-1">Placed on {new Date(o.CreatedAt).toLocaleString()}</div>
              </div>

              <span
                className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full border",
                  String(o.Status).toLowerCase() === "pending"
                    ? "bg-secondary/10 border-secondary/20 text-secondary"
                    : "bg-primary/10 border-primary/20 text-primary"
                )}
              >
                {o.Status}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div className="text-xs text-foreground/60">Total</div>
              <div className="text-sm font-bold text-primary">
                {o.Currency} {Number(o.TotalAmount).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-border bg-background group-hover:bg-secondary/5 transition-colors flex items-center justify-between">
            <span className="text-xs text-foreground/60">View details</span>
            <svg className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
};