import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { Rating, Badge } from "@/shared/components/ui";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCartStore } from "@/features/cart/store/cartStore";
import { ProductCard } from "@/features/products/components/ProductCard";

import { useProductDetail } from "@/features/products/hooks/useProductDetail";
import { useProductVariants } from "@/features/products/hooks/useProductVariants";
import { useVariantStock } from "@/features/products/hooks/useVariantStock";

import { useMeCart } from "@/features/cart/hooks/useMeCart";
import { useUpsertMeCartItem } from "@/features/cart/hooks/useUpsertMeCartItem";
import { useRemoveMeCartItem } from "@/features/cart/hooks/useRemoveMeCartItem";

import { useMeWishlist } from "@/features/wishlist/hooks/useMeWishlist";
import { useToggleWishlist } from "@/features/wishlist/hooks/useToggleWishlist";

import { useRelatedProducts } from "@/features/products/hooks/useRelatedProducts";
import type { DiscoveryFeedItem } from "@/core/api/services/discovery";
import type { Product } from "@/shared/types/product";
import { ProductJsonLd } from "@/shared/seo/ProductJsonLd";

// ─── Types (matched to productDetailApi) ────────────────────────────────────
// ProductDetailBySlug fields used here:
//   id, name, slug, description (NullableString), short_description (NullableString),
//   base_price, status, is_featured, is_digital, rating, review_count,
//   images (ProductImage[]), categories (ProductCategoryRef[]),
//   tags (ProductTagRef[]), attribute_values ({ id, name }[])
//
// ProductVariant fields used here:
//   id, product_id, sku, price, is_active

// ─── Constants ───────────────────────────────────────────────────────────────
const TABS = ["description", "specifications", "reviews"] as const;
type Tab = (typeof TABS)[number];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

const inventoryStatusToInStock = (s: string | undefined) =>
  s === "in_stock" || s === "low_stock";

const mapDiscoveryItemToProduct = (item: DiscoveryFeedItem): Product => {
  const discount = Number(item.discount ?? 0);
  const originalPrice =
    discount > 0 ? item.price / (1 - discount / 100) : undefined;
  return {
    id: String(item.product_id),
    name: item.name,
    slug: item.slug,
    description: "",
    price: item.price,
    originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
    discount: discount || undefined,
    category: "electronics",
    images: [],
    thumbnail:
      item.primary_image ??
      "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: item.rating ?? 0,
    reviewCount: item.review_count ?? 0,
    inStock: inventoryStatusToInStock(item.inventory_status),
    tags: [],
  };
};

const buildWhatsAppUrl = (name: string, price: number, slug: string) => {
  const phone = "254795974591";
  const text = `Hi Zentora, I'm interested in: ${name} (KSh ${price}) - ${window.location.origin}/products/${slug}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled, className }: { filled?: boolean; className?: string }) => (
  <svg
    className={cn("w-4 h-4", className)}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
    />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("w-4 h-4", className)}
    viewBox="0 0 32 32"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M19.11 17.59c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.21-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.44.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.87c.14.18 1.93 2.95 4.68 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z"
    />
    <path
      fill="currentColor"
      d="M16.03 3C8.86 3 3.03 8.82 3.03 15.99c0 2.28.6 4.5 1.74 6.46L3 29l6.73-1.76a12.9 12.9 0 0 0 6.3 1.62h.01c7.17 0 13-5.82 13-12.99C29.04 8.82 23.2 3 16.03 3Zm0 23.62h-.01a10.77 10.77 0 0 1-5.5-1.52l-.39-.23-3.99 1.04 1.06-3.89-.25-.4a10.8 10.8 0 0 1-1.65-5.71c0-5.95 4.84-10.79 10.79-10.79 2.88 0 5.58 1.12 7.61 3.16a10.72 10.72 0 0 1 3.15 7.62c0 5.95-4.84 10.79-10.82 10.79Z"
    />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
const QtyControl = ({
  value,
  onDecrement,
  onIncrement,
  size = "md",
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  size?: "sm" | "md";
}) => {
  const btnCls =
    size === "sm"
      ? "w-9 h-10 flex items-center justify-center hover:bg-secondary/10 disabled:opacity-40"
      : "w-10 h-11 flex items-center justify-center hover:bg-secondary/10 transition-colors disabled:opacity-40";
  return (
    <div className="flex items-center border border-border rounded-xl overflow-hidden bg-background">
      <button className={btnCls} onClick={onDecrement} disabled={value <= 1} aria-label="Decrease quantity">
        {size === "sm" ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        ) : (
          <MinusIcon />
        )}
      </button>
      <span className={cn("text-center font-semibold", size === "sm" ? "text-sm w-6" : "flex-1 text-sm")}>
        {value}
      </span>
      <button className={btnCls} onClick={onIncrement} aria-label="Increase quantity">
        {size === "sm" ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <PlusIcon />
        )}
      </button>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // ── Auth ──
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // ── Product + variants ──
  const productQuery = useProductDetail(slug);
  const product = productQuery.data;
  const productId = product?.id;

  const variantsQuery = useProductVariants(productId);
  const variants = variantsQuery.data ?? [];

  // ── Selection state ──
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Auto-select first variant
  useEffect(() => {
    if (!variants.length) return;
    if (selectedVariantId !== undefined) return;
    setSelectedVariantId(variants[0].id);
  }, [variants, selectedVariantId]);

  // Reset image index when product changes
  useEffect(() => {
    setSelectedImage(0);
  }, [productId]);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId),
    [variants, selectedVariantId]
  );

  // ── Stock ──
  const stockQuery = useVariantStock(selectedVariantId);
  const availableQty = stockQuery.data?.available_qty ?? 0;
  const inStock = availableQty > 0;

  // ── Images — sorted: primary first, then by sort_order ──
  const imageUrls = useMemo(() => {
    const imgs = (product?.images ?? [])
      .slice()
      .sort(
        (a, b) =>
          Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order
      )
      .map((i) => i.image_url);
    return imgs.length ? imgs : ["https://picsum.photos/seed/zentora-detail/800/800"];
  }, [product?.images]);

  // ── Cart ──
  const guestCart = useCartStore();
  const meCartQuery = useMeCart();
  const upsertMeCartItem = useUpsertMeCartItem();
  const removeMeCartItem = useRemoveMeCartItem();

  const authCartItem = useMemo(() => {
    if (!isAuthenticated || !productId || !selectedVariantId) return null;
    const items = meCartQuery.data?.items ?? [];
    return (
      items.find(
        (i) => i.product_id === productId && i.variant_id === selectedVariantId
      ) ?? null
    );
  }, [isAuthenticated, meCartQuery.data, productId, selectedVariantId]);

  const qtyInCart = useMemo(() => {
    if (!productId || !selectedVariantId) return 0;
    if (!isAuthenticated)
      return guestCart.getVariantQuantity(productId, selectedVariantId);
    return authCartItem?.quantity ?? 0;
  }, [authCartItem?.quantity, guestCart, isAuthenticated, productId, selectedVariantId]);

  // ── Price — variant price takes precedence over base_price ──
  const effectivePrice = useMemo(
    () => Number(selectedVariant?.price ?? product?.base_price ?? 0),
    [selectedVariant?.price, product?.base_price]
  );

  // ── Wishlist ──
  const wishlistQuery = useMeWishlist();
  const toggleWishlist = useToggleWishlist();

  const isWished = useMemo(() => {
    if (!isAuthenticated || !productId || !selectedVariantId) return false;
    const items = wishlistQuery.data?.items ?? [];
    return items.some(
      (i) => i.product_id === productId && i.variant_id === selectedVariantId
    );
  }, [isAuthenticated, wishlistQuery.data, productId, selectedVariantId]);

  // ── Related ──
  const categoryIdForRelated = product?.categories?.[0]?.id;
  const relatedQuery = useRelatedProducts(categoryIdForRelated);
  const related = useMemo(() => {
    const items = relatedQuery.data?.items ?? [];
    return items
      .filter((i) => i.slug !== product?.slug)
      .slice(0, 12)
      .map(mapDiscoveryItemToProduct);
  }, [relatedQuery.data, product?.slug]);

  // ── Derived display values ──
  // description: NullableString — use .Valid guard
  const description = product?.description?.Valid
    ? product.description.String
    : "";
  // short_description: NullableString — used as subtitle/preview
  const shortDescription = product?.short_description?.Valid
    ? product.short_description.String
    : "";
  // tags: ProductTagRef[] — map to name strings
  const tags = (product?.tags ?? []).map((t) => t.name);
  // attribute_values: { id, name }[] — these are the product attributes (e.g. "Color: Red")
  // The API returns { id, name } per attribute value, not { name, value } pairs.
  // We render them as feature pills, not a key/value table.
  const attributeValues = product?.attribute_values ?? [];

  // discountPercent — computed without useMemo to avoid hook-order issues
  // when product is still loading (we return early below).
  const discountPercent = (() => {
    const original = Number(product?.base_price ?? 0);
    if (!original || original <= 0) return 0;
    if (!effectivePrice || effectivePrice <= 0) return 0;
    if (effectivePrice >= original) return 0;
    return Math.round(((original - effectivePrice) / original) * 100);
  })();

  // ── Handlers ──
  const handleAddToCart = async () => {
    if (!product || !productId || !selectedVariantId) return;
    if (!inStock) return;

    if (!isAuthenticated) {
      guestCart.addVariantItem({
        product_id: productId,
        variant_id: selectedVariantId,
        quantity,
        slug: product.slug,
        name: product.name,
        thumbnail: imageUrls[0] ?? "",
        price: effectivePrice,
        sku: selectedVariant?.sku,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      return;
    }

    await upsertMeCartItem.mutateAsync({
      product_id: productId,
      variant_id: selectedVariantId,
      quantity: qtyInCart + quantity,
      price_at_added: String(effectivePrice),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/checkout");
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated || !productId || !selectedVariantId) return;
    await toggleWishlist.mutateAsync({ isWished, product_id: productId, variant_id: selectedVariantId });
  };

  const handleCartMinus = async () => {
    if (!productId || !selectedVariantId) return;
    if (!isAuthenticated) {
      guestCart.updateQuantity(productId, selectedVariantId, Math.max(0, qtyInCart - 1));
      return;
    }
    const nextQty = qtyInCart - 1;
    if (nextQty <= 0) {
      if (!authCartItem) return;
      await removeMeCartItem.mutateAsync(authCartItem.id);
      return;
    }
    await upsertMeCartItem.mutateAsync({
      product_id: productId,
      variant_id: selectedVariantId,
      quantity: nextQty,
      price_at_added: String(effectivePrice),
    });
  };

  const handleCartPlus = async () => {
    if (!productId || !selectedVariantId || !inStock) return;
    if (!isAuthenticated) {
      guestCart.updateQuantity(productId, selectedVariantId, qtyInCart + 1);
      return;
    }
    await upsertMeCartItem.mutateAsync({
      product_id: productId,
      variant_id: selectedVariantId,
      quantity: qtyInCart + 1,
      price_at_added: String(effectivePrice),
    });
  };

  // ── Early returns (all hooks above this line) ──────────────────────────────
  if (productQuery.isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-foreground/50">Loading product…</p>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-foreground/50 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-10 px-5 text-sm bg-primary text-white hover:opacity-90"
          >
            Browse products
          </Link>
        </div>
      </MainLayout>
    );
  }

  // ── Derived after guard ──
  const canonicalUrl = `${window.location.origin}/products/${product.slug}`;
  const ogImage = imageUrls[0] ?? "https://picsum.photos/seed/zentora-og/1200/630";

  // ── Buy box shared button classes ──
  const addToCartCls = cn(
    "w-full inline-flex items-center justify-center rounded-xl font-medium transition h-11 text-sm",
    added
      ? "bg-green-600 text-white"
      : inStock
      ? "bg-primary text-white hover:opacity-90"
      : "bg-gray-200 text-gray-400 cursor-not-allowed"
  );

  return (
    <MainLayout>
      {/* JSON-LD — render concern, not a side-effect of handleAddToCart */}
      <ProductJsonLd
        name={product.name}
        description={description || shortDescription || undefined}
        image={ogImage}
        sku={selectedVariant?.sku}
        price={effectivePrice}
        currency="KES"
        availability={inStock ? "InStock" : "OutOfStock"}
        url={canonicalUrl}
        ratingValue={product.rating || undefined}
        reviewCount={product.review_count || undefined}
      />

      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">

          {/* ── Breadcrumbs ── */}
          <nav
            className="flex items-center gap-2 text-xs text-foreground/50 mb-5 overflow-x-auto whitespace-nowrap pb-1"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/products" className="hover:text-primary transition-colors shrink-0">
              Products
            </Link>
            {product.categories?.[0] && (
              <>
                <span aria-hidden>/</span>
                <Link
                  to={`/products?category_id=${product.categories[0].id}`}
                  className="hover:text-primary transition-colors capitalize shrink-0"
                >
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

            {/* ══ COL 1 (lg:5) — Gallery ══════════════════════════════════════ */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-background shadow-sm p-3 sm:p-4">

                {/* Main image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-border mb-3">
                  <img
                    src={imageUrls[selectedImage] ?? imageUrls[0]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />

                  {/* Discount badge */}
                  {discountPercent > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant="sale">-{discountPercent}%</Badge>
                    </div>
                  )}

                  {/* Featured badge */}
                  {product.is_featured && (
                    <div className={cn("absolute z-10", discountPercent > 0 ? "top-10 left-3 mt-1" : "top-3 left-3")}>
                      <Badge variant="featured">Featured</Badge>
                    </div>
                  )}

                  {/* Wishlist — bottom-right of image on mobile */}
                  <button
                    type="button"
                    className={cn(
                      "absolute bottom-3 right-3 lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background/90 backdrop-blur transition",
                      !isAuthenticated && "opacity-60"
                    )}
                    onClick={handleToggleWishlist}
                    disabled={!isAuthenticated || toggleWishlist.isPending || !selectedVariantId}
                    title={isAuthenticated ? "Toggle wishlist" : "Login to use wishlist"}
                  >
                    <HeartIcon filled={isWished} className={isWished ? "text-primary" : "text-foreground/70"} />
                  </button>
                </div>

                {/* Thumbnails — horizontal scroll */}
                {imageUrls.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
                    {imageUrls.map((img, idx) => (
                      <button
                        key={img}
                        onClick={() => setSelectedImage(idx)}
                        className={cn(
                          "shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-colors bg-white",
                          selectedImage === idx
                            ? "border-primary"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <img
                          src={img}
                          alt={`${product.name} image ${idx + 1}`}
                          className="w-full h-full object-contain bg-gray-50"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ══ COL 2 (lg:4) — Info + tabs ═════════════════════════════════ */}
            <div className="lg:col-span-4 flex flex-col gap-4">

              {/* Product header card */}
              <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">

                {/* Status row */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {product.is_digital && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">
                      Digital
                    </span>
                  )}
                  <span
                    className={cn(
                      "ml-auto text-xs font-semibold",
                      inStock ? "text-green-600" : "text-destructive"
                    )}
                  >
                    {stockQuery.isLoading
                      ? "Checking stock…"
                      : inStock
                      ? "In stock"
                      : "Out of stock"}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight leading-snug mb-2">
                  {product.name}
                </h1>

                {/* Short description — shown here if present */}
                {shortDescription && (
                  <p className="text-sm text-foreground/60 leading-relaxed mb-3">
                    {shortDescription}
                  </p>
                )}

                {/* Rating + desktop wishlist */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Rating
                    value={product.rating ?? 0}
                    size="md"
                    showCount
                    reviewCount={product.review_count ?? 0}
                  />
                  <button
                    type="button"
                    className={cn(
                      "hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-background hover:bg-secondary/10 transition ml-auto",
                      !isAuthenticated && "opacity-60"
                    )}
                    onClick={handleToggleWishlist}
                    disabled={
                      !isAuthenticated || toggleWishlist.isPending || !selectedVariantId
                    }
                    title={isAuthenticated ? "Toggle wishlist" : "Login to use wishlist"}
                  >
                    <HeartIcon
                      filled={isWished}
                      className={isWished ? "text-primary" : "text-foreground/70"}
                    />
                  </button>
                </div>

                {/* Price block */}
                <div className="rounded-xl border border-border bg-primary/5 px-4 py-3 mb-4">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="text-xs text-foreground/60 mb-0.5">Price</div>
                      <div className="text-2xl sm:text-3xl font-bold text-primary leading-none">
                        KSh {effectivePrice.toLocaleString()}
                      </div>
                      {/* Show original base_price strikethrough only if variant price < base_price */}
                      {Number(product.base_price) > effectivePrice && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-foreground/50 line-through">
                            KSh {Number(product.base_price).toLocaleString()}
                          </span>
                          {discountPercent > 0 && (
                            <span className="text-xs font-semibold bg-secondary text-white rounded-full px-2 py-0.5">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs text-foreground/60 shrink-0">
                      {inStock ? (
                        <>
                          <span className="font-semibold text-foreground">{availableQty}</span>
                          {" "}left
                        </>
                      ) : (
                        "Unavailable"
                      )}
                    </div>
                  </div>
                </div>

                {/* Variant selector — ProductVariant has sku + price */}
                {variants.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-foreground">Variant</h3>
                      {selectedVariant && (
                        <span className="text-xs text-foreground/50 font-mono">
                          {selectedVariant.sku}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl border text-sm transition-colors",
                            selectedVariantId === v.id
                              ? "border-primary bg-primary/5 text-primary font-medium"
                              : "border-border hover:border-primary/40 hover:bg-secondary/10 text-foreground/80"
                          )}
                        >
                          {v.sku}
                          {/* Show variant price only if it differs from base_price */}
                          {Number(v.price) !== Number(product.base_price) && (
                            <span className="ml-1.5 text-xs text-foreground/50">
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
              <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
                {/* Tab bar */}
                <div className="flex border-b border-border overflow-x-auto scrollbar-none">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex-1 min-w-max px-4 py-3 text-sm font-medium transition-colors capitalize whitespace-nowrap",
                        activeTab === tab
                          ? "border-b-2 border-primary text-primary"
                          : "text-foreground/60 hover:text-foreground"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-4 sm:p-5">

                  {/* Description tab */}
                  {activeTab === "description" && (
                    <div className="space-y-4">
                      {description ? (
                        <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                          {description}
                        </p>
                      ) : shortDescription ? (
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          {shortDescription}
                        </p>
                      ) : (
                        <p className="text-sm text-foreground/50">No description provided.</p>
                      )}

                      {/* attribute_values as feature pills */}
                      {attributeValues.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                          {attributeValues.map((av) => (
                            <span
                              key={av.id}
                              className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium"
                            >
                              {av.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tags — ProductTagRef[] */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full bg-border/40 text-foreground/60 text-xs capitalize"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Specifications tab */}
                  {activeTab === "specifications" && (
                    <div className="divide-y divide-border text-sm">
                      {/* Core fields always shown */}
                      {(
                        [
                          ["SKU", selectedVariant?.sku ?? "—"],
                          [
                            "Category",
                            product.categories?.map((c) => c.name).join(", ") || "—",
                          ],
                          ["Status", product.status ?? "—"],
                          ["Digital", product.is_digital ? "Yes" : "No"],
                          [
                            "Stock",
                            stockQuery.isLoading
                              ? "Checking…"
                              : inStock
                              ? `${availableQty} available`
                              : "Out of stock",
                          ],
                        ] as [string, string][]
                      ).map(([key, val]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center py-2.5 gap-4"
                        >
                          <span className="text-foreground/60 shrink-0">{key}</span>
                          <span
                            className={cn(
                              "font-medium text-right",
                              key === "Stock" && inStock
                                ? "text-green-600"
                                : key === "Stock"
                                ? "text-destructive"
                                : "text-foreground"
                            )}
                          >
                            {val}
                          </span>
                        </div>
                      ))}

                      {/* attribute_values — { id, name } — shown as flat rows */}
                      {attributeValues.length > 0 && (
                        <>
                          <div className="py-2 text-xs font-semibold text-foreground/40 uppercase tracking-wider">
                            Attributes
                          </div>
                          {attributeValues.map((av) => (
                            <div
                              key={av.id}
                              className="flex justify-between items-center py-2.5 gap-4"
                            >
                              <span className="text-foreground/60 shrink-0 text-xs">#{av.id}</span>
                              <span className="font-medium text-right text-foreground">{av.name}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {/* Reviews tab */}
                  {activeTab === "reviews" && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Rating
                          value={product.rating ?? 0}
                          size="md"
                          showCount
                          reviewCount={product.review_count ?? 0}
                        />
                      </div>
                      <p className="text-sm text-foreground/50">
                        Detailed reviews coming in a future stage.
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* ══ COL 3 (lg:3) — Buy box (desktop only; mobile = sticky bar) ═ */}
            <div className="lg:col-span-3">
              <div className="hidden lg:flex flex-col gap-3 rounded-2xl border border-border bg-background shadow-sm p-4 sticky top-24">

                {/* Price summary */}
                <div>
                  <div className="text-xs text-foreground/60">Your price</div>
                  <div className="text-2xl font-bold text-primary">
                    KSh {effectivePrice.toLocaleString()}
                  </div>
                  <div
                    className={cn(
                      "text-xs font-medium mt-0.5",
                      inStock ? "text-green-600" : "text-destructive"
                    )}
                  >
                    {stockQuery.isLoading
                      ? "Checking stock…"
                      : inStock
                      ? `${availableQty} units left`
                      : "Currently unavailable"}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <div className="text-xs text-foreground/60 mb-2">Quantity</div>
                  <QtyControl
                    value={quantity}
                    onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                    onIncrement={() => setQuantity((q) => q + 1)}
                  />
                </div>

                {/* Cart stepper (already in cart) or Add button */}
                {qtyInCart > 0 ? (
                  <div className="rounded-xl border border-border p-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-foreground/60">In cart</div>
                      <div className="text-sm font-semibold">{qtyInCart}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="w-9 h-9 rounded-xl border border-border hover:bg-secondary/10 flex items-center justify-center text-lg disabled:opacity-40"
                        onClick={handleCartMinus}
                        disabled={upsertMeCartItem.isPending || removeMeCartItem.isPending}
                        aria-label="Remove one from cart"
                      >
                        –
                      </button>
                      <button
                        type="button"
                        className="w-9 h-9 rounded-xl border border-border hover:bg-secondary/10 flex items-center justify-center text-lg disabled:opacity-40"
                        onClick={handleCartPlus}
                        disabled={!inStock || upsertMeCartItem.isPending}
                        aria-label="Add one to cart"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className={addToCartCls}
                    onClick={handleAddToCart}
                    disabled={!inStock || !selectedVariantId || upsertMeCartItem.isPending}
                  >
                    {added ? "Added!" : "Add to cart"}
                  </button>
                )}

                <button
                  className="w-full inline-flex items-center justify-center rounded-xl font-medium transition h-11 text-sm border border-border hover:bg-secondary/10 disabled:opacity-50"
                  onClick={handleBuyNow}
                  disabled={!inStock || !selectedVariantId}
                >
                  Buy now
                </button>

                {/* WhatsApp */}
                <a
                  href={buildWhatsAppUrl(product.name, effectivePrice, product.slug)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-11 text-sm border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10">
                    <WhatsAppIcon className="text-[#25D366]" />
                    WhatsApp
                  </button>
                </a>

                {/* Wishlist */}
                <button
                  type="button"
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-10 text-sm border border-border hover:bg-secondary/10",
                    !isAuthenticated && "opacity-60"
                  )}
                  onClick={handleToggleWishlist}
                  disabled={!isAuthenticated || toggleWishlist.isPending || !selectedVariantId}
                >
                  <HeartIcon
                    filled={isWished}
                    className={isWished ? "text-primary" : "text-foreground/70"}
                  />
                  {isWished ? "Saved to wishlist" : "Add to wishlist"}
                </button>

                {/* Trust signals */}
                <div className="pt-2 border-t border-border space-y-2">
                  {["Secure payment", "Fast delivery", "7-day returns"].map((text) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-foreground/70">
                      <span className="text-green-600 font-bold text-base leading-none">✓</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ── Related products ── */}
          {related.length > 0 && (
            <section className="mt-10">
              <div className="mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Related products</h2>
                <p className="text-sm text-foreground/60">You might also like these</p>
              </div>
              <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {related.map((p) => (
                    <ProductCard
                      key={p.slug}
                      product={p}
                      hideAddToCart
                      className="transition-all hover:-translate-y-1"
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ── Mobile sticky bottom bar ── */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 p-3 z-40">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-foreground/60">Price</div>
              <div className="text-base font-semibold text-primary leading-tight">
                KSh {effectivePrice.toLocaleString()}
              </div>
            </div>
            <QtyControl
              value={quantity}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrement={() => setQuantity((q) => q + 1)}
              size="sm"
            />
            <button
              className={cn(
                "shrink-0 inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm",
                added
                  ? "bg-green-600 text-white"
                  : inStock
                  ? "bg-primary text-white hover:opacity-90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              onClick={handleAddToCart}
              disabled={!inStock || !selectedVariantId || upsertMeCartItem.isPending}
            >
              {added ? "Added!" : "Add to cart"}
            </button>
          </div>
        </div>

        {/* Spacer so content isn't hidden behind sticky bar on mobile */}
        <div className="h-20 lg:hidden" />
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;