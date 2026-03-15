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

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order {order.OrderNumber}</h1>
            <p className="text-sm text-foreground/60">
              Status: <span className="font-medium">{order.Status}</span> • {new Date(order.CreatedAt).toLocaleString()}
            </p>
          </div>

          <Link to="/account" className="text-sm text-primary hover:underline">
            Back to Account
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={it.ID} className="flex gap-4 p-4 bg-background rounded-2xl border border-border">
                <Link to={`/products/${it.ProductSlug}`} className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={it.ImageURL ?? "https://picsum.photos/seed/zentora-order/200/200"}
                    alt={it.ProductName}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/products/${it.ProductSlug}`} className="font-medium text-sm hover:text-primary line-clamp-2">
                    {it.ProductName}
                  </Link>
                  <p className="text-xs text-foreground/60 mt-1">
                    {it.VariantName ? `Variant: ${it.VariantName}` : `Variant ID: ${it.VariantID}`}
                    {it.VariantSKU ? ` • ${it.VariantSKU}` : ""}
                  </p>
                  <p className="text-xs text-foreground/60 mt-1">Qty: {it.Quantity}</p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-primary">
                    {it.Currency} {Number(it.TotalPrice).toLocaleString()}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {it.Currency} {Number(it.UnitPrice).toLocaleString()} each
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="bg-background rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-4">Summary</h2>
              <div className="text-sm space-y-2">
                <Row label="Subtotal" value={`${order.Currency} ${Number(order.Subtotal).toLocaleString()}`} />
                <Row label="Shipping" value={`${order.Currency} ${Number(order.ShippingFee).toLocaleString()}`} />
                <Row label="Tax" value={`${order.Currency} ${Number(order.TaxAmount).toLocaleString()}`} />
                <div className="border-t border-border pt-3 mt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {order.Currency} {Number(order.TotalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-4">Shipping</h2>
              <div className="text-sm text-foreground/70 space-y-1">
                <div className="font-medium text-foreground">{order.Shipping.full_name}</div>
                <div>{order.Shipping.phone}</div>
                <div>
                  {order.Shipping.area ? `${order.Shipping.area}, ` : ""}
                  {order.Shipping.city}
                  {order.Shipping.county ? `, ${order.Shipping.county}` : ""}
                </div>
                <div>
                  {order.Shipping.address_line_1}
                  {order.Shipping.address_line_2 ? `, ${order.Shipping.address_line_2}` : ""}
                </div>
                <div>
                  {order.Shipping.postal_code ? `${order.Shipping.postal_code}, ` : ""}
                  {order.Shipping.country}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-foreground/60">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default OrderDetailsPage;