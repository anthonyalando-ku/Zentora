import { QtyControl } from "./QtyControl";

const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

type MobileStickyBarProps = {
  effectivePrice: number;
  quantity: number;
  inStock: boolean;
  added: boolean;
  selectedVariantId: number | undefined;
  upsertPending: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
};

export const MobileStickyBar = ({
  effectivePrice,
  quantity,
  inStock,
  added,
  selectedVariantId,
  upsertPending,
  onDecrement,
  onIncrement,
  onAddToCart,
  onBuyNow,
}: MobileStickyBarProps) => (
  <>
    <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-3 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center gap-2.5">
        {/* Price */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-foreground/50 uppercase tracking-wide">Price</div>
          <div className="text-base font-bold text-primary leading-tight truncate">
            KSh {effectivePrice.toLocaleString()}
          </div>
        </div>

        <QtyControl
          value={quantity}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          size="sm"
        />

        <button
          className={cn(
            "shrink-0 inline-flex items-center justify-center rounded-xl font-semibold transition-all h-10 px-4 text-sm active:scale-[0.97]",
            added
              ? "bg-green-600 text-white"
              : inStock
              ? "bg-primary text-white hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          onClick={onAddToCart}
          disabled={!inStock || !selectedVariantId || upsertPending}
        >
          {added ? "✓ Added" : "Add to cart"}
        </button>

        <button
          className="shrink-0 inline-flex items-center justify-center rounded-xl font-semibold transition-all h-10 px-4 text-sm border-2 border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.97] disabled:opacity-50"
          onClick={onBuyNow}
          disabled={!inStock || !selectedVariantId}
        >
          Buy
        </button>
      </div>
    </div>
    {/* Spacer so content isn't hidden behind bar */}
    <div className="h-20 lg:hidden" />
  </>
);