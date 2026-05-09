import { Link } from "react-router-dom";
import { Rating } from "@/shared/components/ui";
import { HeartIcon, StarFilledIcon } from "./icons";
import { StockPill } from "./QtyControl";

const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

const TABS = ["description", "specifications", "reviews"] as const;
type Tab = (typeof TABS)[number];

type Variant = { id: number; sku: string; price: number | string };
type Category = { id: number; name: string };
type AttributeValue = { id: number; name: string };

type ProductInfoProps = {
  productName: string;
  categories: Category[];
  rating: number;
  reviewCount: number;
  basePrice: number;
  effectivePrice: number;
  discountPercent: number;
  shortDescription: string;
  description: string;
  tags: string[];
  attributeValues: AttributeValue[];
  variants: Variant[];
  selectedVariantId: number | undefined;
  activeTab: Tab;
  isWished: boolean;
  isAuthenticated: boolean;
  wishlistPending: boolean;
  stockLoading: boolean;
  inStock: boolean;
  availableQty: number;
  selectedVariantSku: string | undefined;
  onSelectVariant: (id: number) => void;
  onSetActiveTab: (tab: Tab) => void;
  onToggleWishlist: () => void;
};

export const ProductInfo = ({
  productName,
  categories,
  rating,
  reviewCount,
  basePrice,
  effectivePrice,
  discountPercent,
  shortDescription,
  description,
  tags,
  attributeValues,
  variants,
  selectedVariantId,
  activeTab,
  isWished,
  isAuthenticated,
  wishlistPending,
  stockLoading,
  inStock,
  availableQty,
  selectedVariantSku,
  onSelectVariant,
  onSetActiveTab,
  onToggleWishlist,
}: ProductInfoProps) => {
  return (
    <div className="lg:col-span-4 flex flex-col gap-4">

      {/* ── Product header card ── */}
      <div className="rounded-2xl border border-border bg-background shadow-sm p-5">

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category_id=${cat.id}`}
                className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/8 text-primary hover:bg-primary/15 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title + desktop wishlist */}
        <div className="flex items-start gap-2 mb-2">
          <h1 className="text-xl font-bold text-foreground leading-snug tracking-tight flex-1">
            {productName}
          </h1>
          <button
            type="button"
            className={cn(
              "hidden lg:flex flex-shrink-0 w-9 h-9 items-center justify-center rounded-xl border border-border hover:bg-secondary/10 transition-all",
              isWished && "border-primary/30 bg-primary/5",
              !isAuthenticated && "opacity-50"
            )}
            onClick={onToggleWishlist}
            disabled={!isAuthenticated || wishlistPending || !selectedVariantId}
            title={isAuthenticated ? "Toggle wishlist" : "Login to use wishlist"}
          >
            <HeartIcon filled={isWished} className={isWished ? "text-primary" : "text-foreground/60"} />
          </button>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-3 mb-4">
          <Rating value={rating} size="md" showCount reviewCount={reviewCount} />
          {reviewCount > 0 && (
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => onSetActiveTab("reviews")}
            >
              See reviews
            </button>
          )}
        </div>

        {/* Price block */}
        <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3.5 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              {basePrice > effectivePrice && (
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm text-foreground/40 line-through">
                    KSh {basePrice.toLocaleString()}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-[11px] font-bold bg-destructive/90 text-white rounded-full px-2 py-0.5">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              )}
              <div className="text-3xl font-bold text-primary leading-none tracking-tight">
                KSh <span>{effectivePrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right">
              <StockPill isLoading={stockLoading} inStock={inStock} qty={availableQty} />
            </div>
          </div>
        </div>

        {/* Short description */}
        {shortDescription && (
          <p className="text-sm text-foreground/65 leading-relaxed mb-4 border-l-2 border-primary/20 pl-3">
            {shortDescription}
          </p>
        )}

        {/* Variant selector */}
        {variants.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Variant</span>
              {selectedVariantSku && (
                <span className="text-[11px] text-foreground/40 font-mono bg-muted px-2 py-0.5 rounded">
                  {selectedVariantSku}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onSelectVariant(v.id)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl border text-sm transition-all duration-150 font-medium",
                    selectedVariantId === v.id
                      ? "border-primary bg-primary/8 text-primary shadow-sm"
                      : "border-border hover:border-primary/40 text-foreground/70 hover:text-foreground"
                  )}
                >
                  {v.sku}
                  {Number(v.price) !== basePrice && (
                    <span className="ml-1.5 text-xs opacity-60">
                      KSh {Number(v.price).toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Tabbed content card ── */}
      <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden flex-1">
        <div className="flex border-b border-border overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onSetActiveTab(tab)}
              className={cn(
                "flex-1 min-w-max px-5 py-3.5 text-xs font-semibold tracking-wider transition-colors capitalize whitespace-nowrap relative",
                activeTab === tab ? "text-primary" : "text-foreground/50 hover:text-foreground"
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Description tab */}
          {activeTab === "description" && (
            <div className="space-y-4">
              {description ? (
                <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">{description}</p>
              ) : shortDescription ? (
                <p className="text-sm text-foreground/70 leading-relaxed">{shortDescription}</p>
              ) : (
                <p className="text-sm text-foreground/40 italic">No description provided.</p>
              )}

              {attributeValues.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground/40 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {attributeValues.map((av) => (
                      <span
                        key={av.id}
                        className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium border border-secondary/20"
                      >
                        {av.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tags.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground/40 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-border/40 text-foreground/55 text-xs capitalize border border-border"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Specifications tab */}
          {activeTab === "specifications" && (
            <SpecificationsTab
              sku={selectedVariantSku}
              categories={categories}
              inStock={inStock}
              availableQty={availableQty}
              stockLoading={stockLoading}
              attributeValues={attributeValues}
            />
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <ReviewsTab rating={rating} reviewCount={reviewCount} />
          )}
        </div>
      </div>
    </div>
  );
};

// ── SpecificationsTab ─────────────────────────────────────────────────────────
const SpecificationsTab = ({
  sku,
  categories,
  inStock,
  availableQty,
  stockLoading,
  attributeValues,
}: {
  sku: string | undefined;
  categories: Category[];
  inStock: boolean;
  availableQty: number;
  stockLoading: boolean;
  attributeValues: AttributeValue[];
}) => {
  const rows: [string, string][] = [
    ["SKU", sku ?? "—"],
    ["Category", categories.map((c) => c.name).join(", ") || "—"],
    ["Stock", stockLoading ? "Checking…" : inStock ? `${availableQty} units available` : "Out of stock"],
  ];

  return (
    <div className="space-y-0.5">
      {rows.map(([key, val], idx) => (
        <div
          key={key}
          className={cn(
            "flex justify-between items-center py-2.5 px-3 rounded-lg text-sm gap-4",
            idx % 2 === 0 ? "bg-muted/40" : "bg-background"
          )}
        >
          <span className="text-foreground/55 shrink-0 text-xs font-medium">{key}</span>
          <span className={cn(
            "font-semibold text-right text-xs",
            key === "Stock" && inStock ? "text-green-600" : key === "Stock" ? "text-destructive" : "text-foreground"
          )}>
            {val}
          </span>
        </div>
      ))}

      {attributeValues.length > 0 && (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground/40 pt-3 pb-1 px-3">Attributes</p>
          {attributeValues.map((av, idx) => (
            <div
              key={av.id}
              className={cn(
                "flex justify-between items-center py-2.5 px-3 rounded-lg text-sm gap-4",
                idx % 2 === 0 ? "bg-muted/40" : "bg-background"
              )}
            >
              <span className="text-foreground/55 shrink-0 text-xs font-mono">#{av.id}</span>
              <span className="font-semibold text-right text-xs text-foreground">{av.name}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

// ── ReviewsTab ────────────────────────────────────────────────────────────────
const ReviewsTab = ({ rating, reviewCount }: { rating: number; reviewCount: number }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-5 p-4 rounded-xl bg-muted/40 border border-border">
      <div className="text-center">
        <div className="text-4xl font-bold text-foreground leading-none mb-1">{rating.toFixed(1)}</div>
        <div className="flex gap-0.5 justify-center mb-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarFilledIcon key={s} className={s <= Math.round(rating) ? "text-amber-400" : "text-border"} />
          ))}
        </div>
        <div className="text-[11px] text-foreground/50">{reviewCount} reviews</div>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-[10px] text-foreground/50 w-2">{star}</span>
            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: star === Math.round(rating) ? "65%" : star === 5 ? "20%" : "5%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
    <p className="text-sm text-foreground/50 text-center py-2">Detailed reviews coming soon.</p>
  </div>
);