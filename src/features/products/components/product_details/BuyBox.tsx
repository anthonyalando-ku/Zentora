import { HeartIcon, WhatsAppIcon, ShieldCheckIcon, TruckIcon, ArrowReturnIcon } from "./icons";
import { QtyControl, StockPill } from "./QtyControl";

const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

type BuyBoxProps = {
  effectivePrice: number;
  quantity: number;
  qtyInCart: number;
  inStock: boolean;
  stockLoading: boolean;
  availableQty: number;
  added: boolean;
  isWished: boolean;
  isAuthenticated: boolean;
  wishlistPending: boolean;
  selectedVariantId: number | undefined;
  upsertPending: boolean;
  removePending: boolean;
  productName: string;
  productSlug: string;
  whatsAppUrl: string;
  onDecrement: () => void;
  onIncrement: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onCartMinus: () => void;
  onCartPlus: () => void;
  onToggleWishlist: () => void;
};

export const BuyBox = ({
  effectivePrice,
  quantity,
  qtyInCart,
  inStock,
  stockLoading,
  availableQty,
  added,
  isWished,
  isAuthenticated,
  wishlistPending,
  selectedVariantId,
  upsertPending,
  removePending,
  whatsAppUrl,
  onDecrement,
  onIncrement,
  onAddToCart,
  onBuyNow,
  onCartMinus,
  onCartPlus,
  onToggleWishlist,
}: BuyBoxProps) => {
  const primaryBtnCls = cn(
    "w-full inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 h-11 text-sm tracking-wide",
    added
      ? "bg-green-600 text-white scale-[0.98]"
      : inStock
      ? "bg-primary text-white hover:opacity-90 active:scale-[0.98]"
      : "bg-muted text-muted-foreground cursor-not-allowed"
  );

  return (
    <div className="lg:col-span-3 hidden lg:block lg:self-start lg:sticky lg:top-24">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background shadow-sm p-4">

        {/* Price summary */}
        <div className="pb-3 border-b border-border">
          <div className="text-xs text-foreground/50 mb-0.5">Your price</div>
          <div className="text-2xl font-bold text-primary tracking-tight">
            KSh {effectivePrice.toLocaleString()}
          </div>
          <div className="mt-1.5">
            <StockPill isLoading={stockLoading} inStock={inStock} qty={availableQty} />
          </div>
        </div>

        {/* Quantity */}
        <div>
          <div className="text-xs text-foreground/50 mb-2">Quantity</div>
          <QtyControl value={quantity} onDecrement={onDecrement} onIncrement={onIncrement} />
          {quantity > 1 && (
            <p className="text-xs text-foreground/50 mt-1.5">
              Subtotal:{" "}
              <span className="font-semibold text-foreground">
                KSh {(effectivePrice * quantity).toLocaleString()}
              </span>
            </p>
          )}
        </div>

        {/* Cart stepper OR Add to cart */}
        {qtyInCart > 0 ? (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] text-foreground/50 uppercase tracking-wider">In cart</div>
              <div className="text-sm font-bold text-primary">
                {qtyInCart} {qtyInCart === 1 ? "item" : "items"}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center font-bold text-foreground/70 disabled:opacity-40 transition"
                onClick={onCartMinus}
                disabled={upsertPending || removePending}
                aria-label="Remove one from cart"
              >
                –
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center font-bold text-foreground/70 disabled:opacity-40 transition"
                onClick={onCartPlus}
                disabled={!inStock || upsertPending}
                aria-label="Add one to cart"
              >
                +
              </button>
            </div>
          </div>
        ) : (
          <button
            className={primaryBtnCls}
            onClick={onAddToCart}
            disabled={!inStock || !selectedVariantId || upsertPending}
          >
            {added ? "✓ Added to cart!" : "Add to cart"}
          </button>
        )}

        <button
          className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition-all h-11 text-sm border-2 border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          onClick={onBuyNow}
          disabled={!inStock || !selectedVariantId}
        >
          Buy now
        </button>

        {/* WhatsApp */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all h-10 text-sm border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 active:scale-[0.98]"
        >
          <WhatsAppIcon className="w-4 h-4" />
          Enquire on WhatsApp
        </a>

        {/* Wishlist */}
        <button
          type="button"
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all h-9 text-xs border border-border hover:bg-muted",
            isWished ? "text-primary border-primary/30 bg-primary/5" : "text-foreground/60",
            !isAuthenticated && "opacity-50"
          )}
          onClick={onToggleWishlist}
          disabled={!isAuthenticated || wishlistPending || !selectedVariantId}
        >
          <HeartIcon filled={isWished} className={isWished ? "text-primary" : ""} />
          {isWished ? "Saved to wishlist" : "Save to wishlist"}
        </button>

        {/* Trust signals */}
        <div className="pt-3 border-t border-border grid grid-cols-1 gap-2">
          {[
            { icon: <ShieldCheckIcon />, label: "Secure payment" },
            { icon: <TruckIcon />, label: "Fast delivery" },
            { icon: <ArrowReturnIcon />, label: "7-day returns" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-foreground/60">
              <span className="text-green-600 flex-shrink-0">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Dispatch note */}
        <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-[11px] text-foreground/55 border border-border">
          🚚 Usually dispatched within{" "}
          <span className="font-semibold text-foreground/80">1–2 business days</span>. Delivery to
          Nairobi from{" "}
          <span className="font-semibold text-foreground/80">KSh 200</span>.
        </div>

      </div>
    </div>
  );
};