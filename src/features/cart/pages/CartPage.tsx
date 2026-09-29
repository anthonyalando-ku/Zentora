import "@/styles/cart.css";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Flame, MessageCircle, RotateCcw, ShoppingBag } from "lucide-react";
import { MainLayout } from "@/shared/layouts";
import { useCart, type UnifiedCartItem } from "@/features/cart/hooks/useCart";
import { useDiscoveryFeed } from "@/features/discovery/hooks/useDiscoveryFeed";
import { ProductCard } from "@/features/products/components/ProductCard";
import { mapDiscoveryItemToProduct } from "@/features/public/home/utils/mapDiscoveryItem";
import { CartDeliveryNotice } from "../components/CartDeliveryNotice";
import { CartItemRow } from "../components/CartItemRow";

const ksh = (n: number) => "KSh " + n.toLocaleString();
const plural = (n: number) => `${n.toLocaleString()} item${n === 1 ? "" : "s"}`;
const CLEAR_ALL = "__all";

// Trending products from the discovery feed, excluding what is already in the cart.
// Keyed on product ids so quantity changes don't rebuild the row.
function TrendingPicks({ excludeIds }: { excludeIds: string }) {
  const trending = useDiscoveryFeed("trending", 10);
  const products = useMemo(() => {
    const exclude = new Set(excludeIds.split(",").filter(Boolean));
    return (trending.data?.items ?? []).filter(p => !exclude.has(String(p.product_id))).slice(0, 6).map(mapDiscoveryItemToProduct);
  }, [trending.data, excludeIds]);
  if (!products.length) return null;
  return (
    <section className="store-section cart-picks" aria-labelledby="cart-picks-heading">
      <div className="store-section-heading">
        <div><h2 id="cart-picks-heading"><Flame size={21} aria-hidden="true" />Trending now</h2><p>Popular with shoppers this week</p></div>
        <Link to="/collections/trending">See all <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className="store-product-grid">
        {products.map(p => <ProductCard key={p.slug} product={p} hideAddToCart variant="storefront" />)}
      </div>
    </section>
  );
}

const CartPage = () => {
  const cart = useCart();
  // Lines with a change in flight; blocks repeat clicks until the cart settles.
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());
  const inFlight = useRef(new Set<string>()); // synchronous guard for clicks within one frame
  const [error, setError] = useState<string | null>(null);

  const run = async (key: string, action: () => Promise<void> | void) => {
    if (inFlight.current.has(key) || inFlight.current.has(CLEAR_ALL)) return;
    inFlight.current.add(key);
    setError(null);
    setPending(new Set(inFlight.current));
    try {
      await action();
    } catch {
      // Mutations roll back to the last server state on failure.
      setError("We couldn't update your cart. Your previous cart has been restored — please try again.");
    } finally {
      inFlight.current.delete(key);
      setPending(new Set(inFlight.current));
    }
  };

  const setQuantity = (item: UnifiedCartItem, qty: number) => run(item.key, () => cart.setQuantity(item, qty));
  const removeItem = (item: UnifiedCartItem) => run(item.key, () => cart.removeItem(item));
  const clearAll = () => { if (confirm("Remove all items from your cart?")) void run(CLEAR_ALL, () => cart.clear()); };

  const cartProductIds = cart.items.map(i => i.product_id).join(",");
  const clearing = pending.has(CLEAR_ALL);

  // Only block the page on the first load; background refetches keep the current cart visible.
  if (cart.isLoading && cart.items.length === 0) {
    return <MainLayout><div className="cart-page"><div className="store-shell">
      <div className="cart-loading" aria-busy="true" aria-label="Loading your cart"><div className="store-skeleton" /><div className="store-skeleton" /></div>
    </div></div></MainLayout>;
  }

  if (cart.items.length === 0) {
    return <MainLayout><div className="cart-page"><div className="store-shell">
      <nav className="cart-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Cart</span></nav>
      <div className="cart-empty">
        <span className="cart-empty-icon" aria-hidden="true"><ShoppingBag /></span>
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="store-cta">Continue shopping <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
      <TrendingPicks excludeIds="" />
    </div></div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="cart-page"><div className="store-shell">
        <nav className="cart-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Cart</span></nav>
        <header className="cart-header">
          <div>
            <h1>Shopping Cart <span>({plural(cart.itemCount)})</span></h1>
            <p>Review your items before checkout.</p>
          </div>
          <button type="button" className="cart-clear" onClick={clearAll} disabled={clearing}>Clear cart</button>
        </header>

        <CartDeliveryNotice />
        {error && <p className="cart-error" role="alert">{error}</p>}

        <div className="cart-layout">
          <section className="cart-items" aria-labelledby="cart-items-heading">
            <h2 id="cart-items-heading" className="cart-items-heading">Your items</h2>
            <ul>
              {cart.items.map(item => (
                <CartItemRow key={item.key} item={item} busy={clearing || pending.has(item.key)}
                  onQuantity={qty => void setQuantity(item, qty)} onRemove={() => void removeItem(item)} />
              ))}
            </ul>
          </section>

          <aside className="cart-summary" aria-labelledby="cart-summary-heading">
            <h2 id="cart-summary-heading">Order Summary</h2>
            <dl>
              <div><dt>Subtotal ({plural(cart.itemCount)})</dt><dd>{ksh(cart.subtotal)}</dd></div>
              <div><dt>Delivery</dt><dd className="cart-summary-muted">Confirmed separately</dd></div>
            </dl>
            <div className="cart-summary-total">
              <span>Total (excluding delivery)</span>
              <strong>{ksh(cart.subtotal)}</strong>
            </div>
            <Link to="/checkout" className="store-cta cart-checkout">Proceed to Checkout <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link to="/products" className="cart-continue"><ArrowLeft size={15} aria-hidden="true" />Continue shopping</Link>
            <ul className="cart-assurance">
              <li><Link to="/returns"><RotateCcw aria-hidden="true" />7-day returns · see policy</Link></li>
              <li><Link to="/contact"><MessageCircle aria-hidden="true" />Questions? Talk to our team</Link></li>
            </ul>
          </aside>
        </div>

        <TrendingPicks excludeIds={cartProductIds} />
      </div></div>
    </MainLayout>
  );
};

export default CartPage;
