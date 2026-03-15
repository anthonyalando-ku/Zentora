import { Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { useCart } from "@/features/cart/hooks/useCart";

const CartPage = () => {
  const cart = useCart();

  const subtotal = cart.subtotal;
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  if (!cart.isLoading && cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-foreground/50 mb-6">Looks like you haven't added anything yet</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-10 px-6 text-sm bg-primary text-white hover:opacity-90"
          >
            Start Shopping
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">
            Shopping Cart ({cart.items.length} item{cart.items.length !== 1 ? "s" : ""})
          </h1>
          <button className="text-sm text-destructive hover:underline" onClick={() => cart.clear()}>
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const lineTotal = item.unit_price * item.quantity;

              return (
                <div key={item.key} className="flex gap-4 p-4 bg-background rounded-2xl border border-border">
                  <Link
                    to={item.slug ? `/products/${item.slug}` : "/products"}
                    className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-50"
                  >
                    <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={item.slug ? `/products/${item.slug}` : "/products"}
                      className="font-medium text-sm hover:text-primary line-clamp-2 block mb-1"
                    >
                      {item.name}
                    </Link>

                    <p className="text-xs text-foreground/40 mb-2">
                      {item.brand ? `${item.brand} • ` : ""}
                      {item.category ? `${item.category} • ` : ""}
                      Variant ID: {item.variant_id}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                          className="w-8 h-8 flex items-center justify-center hover:bg-secondary/10 transition-colors disabled:opacity-50 text-xs"
                          onClick={() => cart.setQuantity(item, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          className="w-8 h-8 flex items-center justify-center hover:bg-secondary/10 transition-colors text-xs"
                          onClick={() => cart.setQuantity(item, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-primary text-sm">KSh {lineTotal.toLocaleString()}</div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-foreground/40">
                            KSh {item.unit_price.toLocaleString()} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    className="shrink-0 p-1 text-foreground/30 hover:text-destructive transition-colors"
                    onClick={() => cart.removeItem(item)}
                    aria-label="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Subtotal</span>
                  <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-foreground/60">Shipping</span>
                  <span className={shipping === 0 ? "text-green-500 font-medium" : "font-medium"}>
                    {shipping === 0 ? "FREE" : `KSh ${shipping.toLocaleString()}`}
                  </span>
                </div>

                {subtotal < 5000 && (
                  <p className="text-xs text-foreground/40">
                    Add KSh {(5000 - subtotal).toLocaleString()} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">KSh {total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg font-medium transition h-11 px-6 text-sm bg-primary text-white hover:opacity-90"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg font-medium transition h-11 px-6 text-sm border border-border hover:bg-secondary/10"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;