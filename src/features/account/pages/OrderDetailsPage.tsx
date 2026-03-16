import { Link, useParams } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { useOrderDetails } from "@/features/account/hooks/useOrderDetails";
import { useAuthStore } from "@/features/auth/store/authStore";
import type { OrderItem } from "@/core/api/services/ordersMe";

const OrderDetailsPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { id } = useParams<{ id: string }>();

  const orderId = id ? Number(id) : undefined;
  const query = useOrderDetails(orderId);

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold mb-2">Please login</h2>
          <Link to="/login" className="text-primary hover:underline">
            Go to Login
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (query.isLoading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-24">
          <p className="text-foreground/60">Loading order…</p>
        </div>
      </MainLayout>
    );
  }

  const order = query.data?.order;
  if (!order) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <Link to="/account" className="text-primary hover:underline">
            Back to Account
          </Link>
        </div>
      </MainLayout>
    );
  }

  const items: OrderItem[] = Array.isArray(order.Items) ? order.Items : [];

  const status = String(order.Status ?? "");
  const statusKey = status.toLowerCase();

  const statusBadgeClass =
    statusKey.includes("cancel")
      ? "bg-red-500/10 text-red-700 border-red-500/20"
      : statusKey.includes("deliver") || statusKey.includes("complete")
        ? "bg-green-500/10 text-green-700 border-green-500/20"
        : statusKey.includes("process") || statusKey.includes("ship")
          ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
          : "bg-yellow-500/10 text-yellow-800 border-yellow-500/20";

  return (
    <MainLayout>
      <div className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="rounded-2xl border border-border bg-background shadow-sm p-5 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                    Order {order.OrderNumber}
                  </h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${statusBadgeClass}`}>
                    {order.Status}
                  </span>
                </div>

                <p className="text-sm text-foreground/60 mt-2">
                  Placed on <span className="font-medium text-foreground/80">{new Date(order.CreatedAt).toLocaleString()}</span>
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  to="/account"
                  className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm border border-border bg-background hover:bg-secondary/10"
                >
                  Back to Account
                </Link>
              </div>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Items */}
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm sm:text-base font-semibold text-foreground">
                      Items <span className="text-foreground/60">({items.length})</span>
                    </h2>
                    <span className="text-xs text-foreground/60">Review your purchased items</span>
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {items.map((it) => (
                    <div key={it.ID} className="p-4 sm:p-5">
                      <div className="flex gap-4">
                        <Link
                          to={`/products/${it.ProductSlug}`}
                          className="shrink-0 w-20 sm:w-24"
                          aria-label={`Open ${it.ProductName}`}
                        >
                          <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-border">
                            <img
                              src={it.ImageURL ?? "https://picsum.photos/seed/zentora-order/200/200"}
                              alt={it.ProductName}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${it.ProductSlug}`}
                            className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-2"
                          >
                            {it.ProductName}
                          </Link>

                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-foreground/60">
                              {it.VariantName ? `Variant: ${it.VariantName}` : `Variant ID: ${it.VariantID}`}
                              {it.VariantSKU ? ` • SKU: ${it.VariantSKU}` : ""}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-foreground/60">
                              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-2.5 py-1">
                                <span className="text-foreground/60">Qty</span>
                                <span className="font-semibold text-foreground">{it.Quantity}</span>
                              </span>

                              <span>
                                Unit:{" "}
                                <span className="font-medium text-foreground/80">
                                  {it.Currency} {Number(it.UnitPrice).toLocaleString()}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs text-foreground/60">Total</div>
                          <div className="text-sm sm:text-base font-bold text-primary">
                            {it.Currency} {Number(it.TotalPrice).toLocaleString()}
                          </div>
                          <div className="text-xs text-foreground/50 mt-1">incl. item total</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary + Shipping */}
            <div className="lg:col-span-4 space-y-4">
              {/* Summary */}
              <div className="rounded-2xl border border-border bg-background shadow-sm p-5 sm:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-foreground mb-4">Order Summary</h2>

                <div className="text-sm space-y-3">
                  <Row label="Subtotal" value={`${order.Currency} ${Number(order.Subtotal).toLocaleString()}`} />
                  <Row label="Shipping" value={`${order.Currency} ${Number(order.ShippingFee).toLocaleString()}`} />
                  <Row label="Tax" value={`${order.Currency} ${Number(order.TaxAmount).toLocaleString()}`} />

                  <div className="pt-4 mt-4 border-t border-border flex items-end justify-between">
                    <div>
                      <div className="text-xs text-foreground/60">Total</div>
                      <div className="text-xl font-bold text-primary">
                        {order.Currency} {Number(order.TotalAmount).toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs text-foreground/60">Final amount</span>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="rounded-2xl border border-border bg-background shadow-sm p-5 sm:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-foreground mb-4">Shipping Address</h2>

                <div className="text-sm text-foreground/80 space-y-2">
                  <div className="font-semibold text-foreground">{order.Shipping.full_name}</div>
                  <div className="text-foreground/70">{order.Shipping.phone}</div>

                  <div className="pt-2 border-t border-border space-y-1 text-foreground/70">
                    <div>{order.Shipping.address_line_1}</div>
                    {order.Shipping.address_line_2 ? <div>{order.Shipping.address_line_2}</div> : null}

                    <div className="pt-2">
                      {order.Shipping.area ? <div>{order.Shipping.area}</div> : null}
                      <div>
                        {order.Shipping.city}
                        {order.Shipping.county ? `, ${order.Shipping.county}` : ""}
                      </div>
                    </div>

                    <div className="pt-2">
                      {order.Shipping.postal_code ? <div>{order.Shipping.postal_code}</div> : null}
                      <div>{order.Shipping.country}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help / actions (pure UI) */}
              <div className="rounded-2xl border border-border bg-background shadow-sm p-5 sm:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-foreground mb-2">Need help?</h2>
                <p className="text-sm text-foreground/60">
                  If you have questions about this order, contact support with your order number.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-foreground/60">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default OrderDetailsPage;