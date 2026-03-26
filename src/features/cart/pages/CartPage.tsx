import { Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { useCart } from "@/features/cart/hooks/useCart";
//import { ProductCard } from "@/features/products/components/ProductCard";

const CartPage = () => {
  const cart = useCart();

  const subtotal = cart.subtotal;
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  if (cart.isLoading) {
    return (
      <MainLayout>
        <div className="bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="rounded-2xl border border-border bg-background shadow-sm p-6 sm:p-10">
              <div className="flex items-center justify-center min-h-[240px]">
                <div className="text-sm text-foreground/60">Loading your cart…</div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Empty cart
  if (!cart.isLoading && cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="rounded-2xl border border-border bg-background shadow-sm p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                    Your cart is empty
                  </h1>
                  <p className="text-sm sm:text-base text-foreground/60 mt-2 max-w-lg">
                    Browse our marketplace and add items to your cart. Deals and best sellers update often.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center rounded-xl font-medium transition h-11 px-6 text-sm bg-primary text-white hover:opacity-90"
                    >
                      Start Shopping
                    </Link>

                    <Link
                      to="/products?feed_type=trending"
                      className="inline-flex items-center justify-center rounded-xl font-medium transition h-11 px-6 text-sm border border-border hover:bg-secondary/10"
                    >
                      Browse Trending
                    </Link>
                  </div>
                </div>

                {/* Illustration placeholder (no emoji) */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-md rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 sm:p-8">
                    <div className="aspect-[4/3] rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden">
                      <img
                        src="https://picsum.photos/seed/zentora-empty-cart/900/600"
                        alt="Empty cart illustration"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-sm font-semibold text-foreground">No items yet</div>
                      <div className="text-xs text-foreground/60 mt-1">Add products to see them here.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional recommended section placeholder (keeps functionality intact, no extra hooks) */}
              <div className="mt-10 border-t border-border pt-6">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Recommended for you</h2>
                    <p className="text-sm text-foreground/60">Popular picks from the store</p>
                  </div>
                  <Link to="/products?feed_type=best_sellers" className="text-sm font-medium text-primary hover:underline">
                    View more
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[250px] rounded-2xl border border-border bg-background overflow-hidden opacity-70"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                Shopping Cart{" "}
                <span className="text-foreground/60 text-base sm:text-lg font-medium">
                  ({cart.items.length} item{cart.items.length !== 1 ? "s" : ""})
                </span>
              </h1>
              <p className="text-sm text-foreground/60 mt-1">
                Review items, adjust quantities, and proceed to checkout.
              </p>
            </div>

            <button
              className="text-sm text-destructive hover:underline self-start sm:self-auto"
              onClick={() => cart.clear()}
              aria-label="Clear all cart items"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Items */}
            <div className="lg:col-span-8 space-y-3">
              {/* Items container card */}
              <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-border bg-background">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">Cart Items</div>
                    {shipping === 0 ? (
                      <span className="text-xs font-semibold text-green-600 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                        FREE SHIPPING
                      </span>
                    ) : (
                      <span className="text-xs text-foreground/60">
                        Add{" "}
                        <span className="font-semibold text-foreground">
                          KSh {(5000 - subtotal).toLocaleString()}
                        </span>{" "}
                        for free shipping
                      </span>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-border">
                  {cart.items.map((item) => {
                    const lineTotal = item.unit_price * item.quantity;

                    // Optional sale badge (only if your cart item has these fields; safe access)
                    const hasDiscount =
                      typeof (item as any).discount === "number" ? (item as any).discount > 0 : false;

                    return (
                      <div key={item.key} className="p-4 sm:p-5">
                        <div className="flex gap-4">
                          {/* Thumbnail */}
                          <Link
                            to={item.slug ? `/products/${item.slug}` : "/products"}
                            className="shrink-0 w-24 sm:w-28"
                            aria-label={`Open ${item.name}`}
                          >
                            <div className="aspect-[4/5] rounded-xl border border-border bg-gray-50 overflow-hidden">
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          </Link>

                          {/* Info + controls */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <Link
                                  to={item.slug ? `/products/${item.slug}` : "/products"}
                                  className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-2"
                                >
                                  {item.name}
                                </Link>

                                <div className="mt-1 text-xs text-foreground/50">
                                  {item.brand ? `${item.brand} • ` : ""}
                                  {item.category ? `${item.category} • ` : ""}
                                  Variant ID: {item.variant_id}
                                </div>

                                {hasDiscount && (
                                  <div className="mt-2 inline-flex items-center gap-2">
                                    <span className="text-[11px] font-semibold text-white bg-secondary px-2 py-0.5 rounded-full">
                                      SALE
                                    </span>
                                    <span className="text-[11px] text-foreground/60">Limited offer</span>
                                  </div>
                                )}
                              </div>

                              <button
                                className="shrink-0 w-10 h-10 inline-flex items-center justify-center rounded-xl border border-border hover:bg-secondary/10 transition-colors text-foreground/60 hover:text-destructive"
                                onClick={() => cart.removeItem(item)}
                                aria-label={`Remove ${item.name} from cart`}
                                title="Remove"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {/* Quantity controls (touch friendly) */}
                              <div className="flex items-center gap-3">
                                <div className="inline-flex items-center rounded-xl border border-border overflow-hidden bg-background">
                                  <button
                                    className="w-11 h-11 inline-flex items-center justify-center hover:bg-secondary/10 transition-colors disabled:opacity-50"
                                    onClick={() => cart.setQuantity(item, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    aria-label={`Decrease quantity of ${item.name}`}
                                  >
                                    <span className="text-lg leading-none">−</span>
                                  </button>
                                  <span className="w-12 text-center text-sm font-semibold">{item.quantity}</span>
                                  <button
                                    className="w-11 h-11 inline-flex items-center justify-center hover:bg-secondary/10 transition-colors"
                                    onClick={() => cart.setQuantity(item, item.quantity + 1)}
                                    aria-label={`Increase quantity of ${item.name}`}
                                  >
                                    <span className="text-lg leading-none">+</span>
                                  </button>
                                </div>

                                {/* Unit price only if qty > 1 */}
                                {item.quantity > 1 && (
                                  <div className="text-xs text-foreground/60">
                                    Unit: <span className="font-medium text-foreground">KSh {item.unit_price.toLocaleString()}</span>
                                  </div>
                                )}
                              </div>

                              {/* Line total */}
                              <div className="text-right">
                                <div className="text-xs text-foreground/50">Line total</div>
                                <div className="text-base sm:text-lg font-bold text-primary">
                                  KSh {lineTotal.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue shopping link inside items card */}
                <div className="px-4 sm:px-6 py-4 border-t border-border bg-background">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Upsell / related section (compact grid) */}
              <section className="rounded-2xl border border-border bg-background shadow-sm">
                <div className="px-4 sm:px-6 py-4 border-b border-border">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-sm sm:text-base font-semibold text-foreground">You may also like</h2>
                      <p className="text-xs text-foreground/60 mt-1">Popular picks often bought with these items</p>
                    </div>
                    <Link to="/products?feed_type=trending" className="text-sm font-medium text-primary hover:underline">
                      Show more
                    </Link>
                  </div>
                </div>

                {/* No new hooks/data here; placeholder slots keep layout */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[250px] rounded-2xl border border-border bg-background overflow-hidden"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT: Summary */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-border bg-background shadow-sm p-5 sm:p-6 sticky top-24 hidden lg:block">
                <h2 className="text-base font-semibold text-foreground">Order Summary</h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Subtotal</span>
                    <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-foreground/60">Discounts</span>
                    <span className="font-medium text-foreground/60">KSh 0</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-foreground/60">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-semibold" : "font-medium"}>
                      {shipping === 0 ? "FREE" : `KSh ${shipping.toLocaleString()}`}
                    </span>
                  </div>

                  {subtotal < 5000 && (
                    <div className="text-xs text-foreground/60">
                      Add{" "}
                      <span className="font-semibold text-foreground">KSh {(5000 - subtotal).toLocaleString()}</span>{" "}
                      more for free shipping.
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-border">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-foreground/60">Total</div>
                      <div className="text-xl font-bold text-primary">KSh {total.toLocaleString()}</div>
                    </div>
                    {shipping === 0 && (
                      <div className="text-xs font-semibold text-green-600 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                        FREE SHIPPING
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <Link
                    to="/checkout"
                    className="w-full inline-flex items-center justify-center rounded-xl font-medium transition h-11 px-6 text-sm bg-primary text-white hover:opacity-90"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    to="/products"
                    className="w-full inline-flex items-center justify-center rounded-xl font-medium transition h-11 px-6 text-sm border border-border hover:bg-secondary/10"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-6 pt-4 border-t border-border text-sm text-foreground/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Fast delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Easy returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile sticky bottom bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 p-3">
            <div className="max-w-7xl mx-auto px-1 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] text-foreground/60">Total</div>
                <div className="text-base font-semibold text-primary leading-tight">KSh {total.toLocaleString()}</div>
                <div className="text-[11px] text-foreground/60">
                  {shipping === 0 ? "FREE SHIPPING" : `Shipping: KSh ${shipping.toLocaleString()}`}
                </div>
              </div>

              <Link
                to="/checkout"
                className="shrink-0 inline-flex items-center justify-center rounded-xl font-medium transition h-11 px-5 text-sm bg-primary text-white hover:opacity-90"
              >
                Checkout
              </Link>
            </div>
          </div>

          {/* Spacer so content isn't hidden behind mobile bar */}
          <div className="h-20 lg:hidden" />
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;