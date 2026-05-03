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
  <svg className={cn("w-4 h-4", className)} viewBox="0 0 32 32" aria-hidden="true">
    <path fill="currentColor" d="M19.11 17.59c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.21-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.44.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.87c.14.18 1.93 2.95 4.68 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z"/>
    <path fill="currentColor" d="M16.03 3C8.86 3 3.03 8.82 3.03 15.99c0 2.28.6 4.5 1.74 6.46L3 29l6.73-1.76a12.9 12.9 0 0 0 6.3 1.62h.01c7.17 0 13-5.82 13-12.99C29.04 8.82 23.2 3 16.03 3Zm0 23.62h-.01a10.77 10.77 0 0 1-5.5-1.52l-.39-.23-3.99 1.04 1.06-3.89-.25-.4a10.8 10.8 0 0 1-1.65-5.71c0-5.95 4.84-10.79 10.79-10.79 2.88 0 5.58 1.12 7.61 3.16a10.72 10.72 0 0 1 3.15 7.62c0 5.95-4.84 10.79-10.82 10.79Z"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const ArrowReturnIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
  </svg>
);

const StarFilledIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-3.5 h-3.5", className)} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
  const isSmall = size === "sm";
  return (
    <div className={cn(
      "flex items-center rounded-xl overflow-hidden border border-border bg-background",
      isSmall ? "h-10" : "h-11"
    )}>
      <button
        className={cn(
          "flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-secondary/10 transition-colors disabled:opacity-30",
          isSmall ? "w-9 h-full" : "w-11 h-full"
        )}
        onClick={onDecrement}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <svg className={cn(isSmall ? "w-3 h-3" : "w-3.5 h-3.5")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>
      <span className={cn(
        "font-semibold text-foreground text-center tabular-nums",
        isSmall ? "w-8 text-sm" : "w-10 text-sm"
      )}>
        {value}
      </span>
      <button
        className={cn(
          "flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-secondary/10 transition-colors disabled:opacity-30",
          isSmall ? "w-9 h-full" : "w-11 h-full"
        )}
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        <svg className={cn(isSmall ? "w-3 h-3" : "w-3.5 h-3.5")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

// Stock indicator pill
const StockPill = ({ isLoading, inStock, qty }: { isLoading: boolean; inStock: boolean; qty: number }) => {
  if (isLoading) return <span className="text-xs text-foreground/50">Checking…</span>;
  if (!inStock) return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
      <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
      Out of stock
    </span>
  );
  if (qty <= 5) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
      Only {qty} left
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      In stock ({qty} available)
    </span>
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

  useEffect(() => {
    if (!variants.length) return;
    if (selectedVariantId !== undefined) return;
    setSelectedVariantId(variants[0].id);
  }, [variants, selectedVariantId]);

  useEffect(() => { setSelectedImage(0); }, [productId]);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId),
    [variants, selectedVariantId]
  );

  // ── Stock ──
  const stockQuery = useVariantStock(selectedVariantId);
  const availableQty = stockQuery.data?.available_qty ?? 0;
  const inStock = availableQty > 0;

  // ── Images ──
  const imageUrls = useMemo(() => {
    const imgs = (product?.images ?? [])
      .slice()
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
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
    return items.find((i) => i.product_id === productId && i.variant_id === selectedVariantId) ?? null;
  }, [isAuthenticated, meCartQuery.data, productId, selectedVariantId]);

  const qtyInCart = useMemo(() => {
    if (!productId || !selectedVariantId) return 0;
    if (!isAuthenticated) return guestCart.getVariantQuantity(productId, selectedVariantId);
    return authCartItem?.quantity ?? 0;
  }, [authCartItem?.quantity, guestCart, isAuthenticated, productId, selectedVariantId]);

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
    return items.some((i) => i.product_id === productId && i.variant_id === selectedVariantId);
  }, [isAuthenticated, wishlistQuery.data, productId, selectedVariantId]);

  // ── Related ──
  const categoryIdForRelated = product?.categories?.[0]?.id;
  const relatedQuery = useRelatedProducts(categoryIdForRelated);
  const related = useMemo(() => {
    const items = relatedQuery.data?.items ?? [];
    return items.filter((i) => i.slug !== product?.slug).slice(0, 12).map(mapDiscoveryItemToProduct);
  }, [relatedQuery.data, product?.slug]);

  // ── Derived display values ──
  const description = product?.description?.Valid ? product.description.String : "";
  const shortDescription = product?.short_description?.Valid ? product.short_description.String : "";
  const tags = (product?.tags ?? []).map((t) => t.name);
  const attributeValues = product?.attribute_values ?? [];

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

  // ── Early returns ──
  if (productQuery.isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-foreground/50">Loading product…</p>
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
          <p className="text-foreground/50 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-10 px-5 text-sm bg-primary text-white hover:opacity-90">
            Browse products
          </Link>
        </div>
      </MainLayout>
    );
  }

  const canonicalUrl = `${window.location.origin}/products/${product.slug}`;
  const ogImage = imageUrls[0] ?? "https://picsum.photos/seed/zentora-og/1200/630";

  // ── Shared CTA classes ──
  const primaryBtnCls = cn(
    "w-full inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 h-11 text-sm tracking-wide",
    added
      ? "bg-green-600 text-white scale-[0.98]"
      : inStock
      ? "bg-primary text-white hover:opacity-90 active:scale-[0.98]"
      : "bg-muted text-muted-foreground cursor-not-allowed"
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <MainLayout>
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

      <div className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 lg:pt-6 lg:pb-16">

          {/* ── Breadcrumbs ── */}
          <nav className="flex items-center gap-1.5 text-xs text-foreground/50 mb-5 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors shrink-0">Home</Link>
            <ChevronRightIcon />
            <Link to="/products" className="hover:text-primary transition-colors shrink-0">Products</Link>
            {product.categories?.[0] && (
              <>
                <ChevronRightIcon />
                <Link
                  to={`/products?category_id=${product.categories[0].id}`}
                  className="hover:text-primary transition-colors capitalize shrink-0"
                >
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <ChevronRightIcon />
            <span className="text-foreground/80 truncate max-w-[200px] font-medium">{product.name}</span>
          </nav>

          {/* ════════════════════════════════════════════════════════════════
              MAIN PRODUCT GRID: [Gallery 5col] [Info 4col] [Buy box 3col]
          ════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">

            {/* ══════════════════════════════════════════════════════════════
                COL 1 (lg:5) — Gallery (sticky on desktop)
            ══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-24 flex flex-col gap-4">

              {/* Main image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-border group">
                <img
                  src={imageUrls[selectedImage] ?? imageUrls[0]}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {discountPercent > 0 && <Badge variant="sale">-{discountPercent}%</Badge>}
                  {product.is_featured && <Badge variant="featured">Featured</Badge>}
                  {product.is_digital && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/90 text-white backdrop-blur">
                      Digital
                    </span>
                  )}
                </div>
                {/* Mobile wishlist */}
                <button
                  type="button"
                  className="absolute top-3 right-3 lg:hidden w-9 h-9 rounded-full border border-border bg-background/90 backdrop-blur flex items-center justify-center transition hover:bg-background disabled:opacity-50"
                  onClick={handleToggleWishlist}
                  disabled={!isAuthenticated || toggleWishlist.isPending || !selectedVariantId}
                  title={isAuthenticated ? "Toggle wishlist" : "Login to use wishlist"}
                >
                  <HeartIcon filled={isWished} className={isWished ? "text-primary" : "text-foreground/60"} />
                </button>
                {/* Share button */}
                <button
                  type="button"
                  className="absolute bottom-3 right-3 w-8 h-8 rounded-full border border-border bg-background/90 backdrop-blur flex items-center justify-center transition hover:bg-background text-foreground/60 hover:text-foreground"
                  onClick={() => navigator.share?.({ title: product.name, url: canonicalUrl })}
                  title="Share product"
                >
                  <ShareIcon />
                </button>
              </div>

              {/* Thumbnails */}
              {imageUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                  {imageUrls.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        "shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-150 bg-white",
                        selectedImage === idx
                          ? "border-primary shadow-sm shadow-primary/20 scale-105"
                          : "border-border hover:border-primary/40 opacity-70 hover:opacity-100"
                      )}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-contain bg-gray-50"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* ── Trust badges (below gallery, fills the whitespace) ── */}
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { icon: <ShieldCheckIcon />, label: "Secure Payment" },
                  { icon: <TruckIcon />, label: "Fast Delivery" },
                  { icon: <ArrowReturnIcon />, label: "7-Day Returns" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background p-3 text-center"
                  >
                    <span className="text-primary">{icon}</span>
                    <span className="text-[10px] font-medium text-foreground/60 leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* ── WhatsApp enquiry banner ── */}
              <a
                href={buildWhatsAppUrl(product.name, effectivePrice, product.slug)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors px-4 py-3"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
                  <WhatsAppIcon className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#25D366]">Have a question?</div>
                  <div className="text-[11px] text-foreground/50 truncate">Chat with us on WhatsApp</div>
                </div>
                <ChevronRightIcon />
              </a>

            </div>

            {/* ══════════════════════════════════════════════════════════════
                COL 2 (lg:4) — Product Info + Tabs
            ══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-4 flex flex-col gap-4">

              {/* ── Product header ── */}
              <div className="rounded-2xl border border-border bg-background shadow-sm p-5">

                {/* Categories breadcrumb chips */}
                {product.categories?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.categories.map((cat) => (
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

                {/* Title + wishlist row */}
                <div className="flex items-start gap-2 mb-2">
                  <h1 className="text-xl font-bold text-foreground leading-snug tracking-tight flex-1">
                    {product.name}
                  </h1>
                  <button
                    type="button"
                    className={cn(
                      "hidden lg:flex flex-shrink-0 w-9 h-9 items-center justify-center rounded-xl border border-border hover:bg-secondary/10 transition-all",
                      isWished && "border-primary/30 bg-primary/5",
                      !isAuthenticated && "opacity-50"
                    )}
                    onClick={handleToggleWishlist}
                    disabled={!isAuthenticated || toggleWishlist.isPending || !selectedVariantId}
                    title={isAuthenticated ? "Toggle wishlist" : "Login to use wishlist"}
                  >
                    <HeartIcon filled={isWished} className={isWished ? "text-primary" : "text-foreground/60"} />
                  </button>
                </div>

                {/* Rating row */}
                <div className="flex items-center gap-3 mb-4">
                  <Rating
                    value={product.rating ?? 0}
                    size="md"
                    showCount
                    reviewCount={product.review_count ?? 0}
                  />
                  {product.review_count > 0 && (
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={() => setActiveTab("reviews")}
                    >
                      See reviews
                    </button>
                  )}
                </div>

                {/* Price block */}
                <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3.5 mb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      {Number(product.base_price) > effectivePrice && (
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm text-foreground/40 line-through">
                            KSh {Number(product.base_price).toLocaleString()}
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
                      <StockPill
                        isLoading={stockQuery.isLoading}
                        inStock={inStock}
                        qty={availableQty}
                      />
                    </div>
                  </div>
                </div>

                {/* Short description (preview) */}
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
                      {selectedVariant && (
                        <span className="text-[11px] text-foreground/40 font-mono bg-muted px-2 py-0.5 rounded">
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
                            "px-3.5 py-2 rounded-xl border text-sm transition-all duration-150 font-medium",
                            selectedVariantId === v.id
                              ? "border-primary bg-primary/8 text-primary shadow-sm"
                              : "border-border hover:border-primary/40 text-foreground/70 hover:text-foreground"
                          )}
                        >
                          {v.sku}
                          {Number(v.price) !== Number(product.base_price) && (
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

                {/* Tab bar */}
                <div className="flex border-b border-border overflow-x-auto scrollbar-none">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "flex-1 min-w-max px-5 py-3.5 text-xs font-semibold tracking-wider transition-colors capitalize whitespace-nowrap relative",
                        activeTab === tab
                          ? "text-primary"
                          : "text-foreground/50 hover:text-foreground"
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
                        <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                          {description}
                        </p>
                      ) : shortDescription ? (
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          {shortDescription}
                        </p>
                      ) : (
                        <p className="text-sm text-foreground/40 italic">No description provided.</p>
                      )}

                      {/* Attribute pills */}
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

                      {/* Tags */}
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
                    <div className="space-y-0.5">
                      {(
                        [
                          ["SKU", selectedVariant?.sku ?? "—"],
                          ["Category", product.categories?.map((c) => c.name).join(", ") || "—"],
                          ["Status", product.status ?? "—"],
                          ["Digital Product", product.is_digital ? "Yes" : "No"],
                          [
                            "Stock",
                            stockQuery.isLoading
                              ? "Checking…"
                              : inStock ? `${availableQty} units available` : "Out of stock",
                          ],
                        ] as [string, string][]
                      ).map(([key, val], idx) => (
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
                  )}

                  {/* Reviews tab */}
                  {activeTab === "reviews" && (
                    <div className="space-y-4">
                      {/* Rating summary */}
                      <div className="flex items-center gap-5 p-4 rounded-xl bg-muted/40 border border-border">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-foreground leading-none mb-1">
                            {(product.rating ?? 0).toFixed(1)}
                          </div>
                          <div className="flex gap-0.5 justify-center mb-1">
                            {[1,2,3,4,5].map((s) => (
                              <StarFilledIcon
                                key={s}
                                className={s <= Math.round(product.rating ?? 0) ? "text-amber-400" : "text-border"}
                              />
                            ))}
                          </div>
                          <div className="text-[11px] text-foreground/50">{product.review_count ?? 0} reviews</div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-[10px] text-foreground/50 w-2">{star}</span>
                              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full"
                                  style={{
                                    width: star === Math.round(product.rating ?? 0) ? "65%" : star === 5 ? "20%" : "5%"
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/50 text-center py-2">
                        Detailed reviews coming soon.
                      </p>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* ══════════════════════════════════════════════════════════════
                COL 3 (lg:3) — Buy Box (desktop sticky)
            ══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-3 hidden lg:block lg:self-start lg:sticky lg:top-24">
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background shadow-sm p-4">

                {/* Price summary */}
                <div className="pb-3 border-b border-border">
                  <div className="text-xs text-foreground/50 mb-0.5">Your price</div>
                  <div className="text-2xl font-bold text-primary tracking-tight">
                    KSh {effectivePrice.toLocaleString()}
                  </div>
                  <div className="mt-1.5">
                    <StockPill isLoading={stockQuery.isLoading} inStock={inStock} qty={availableQty} />
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <div className="text-xs text-foreground/50 mb-2">Quantity</div>
                  <QtyControl
                    value={quantity}
                    onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                    onIncrement={() => setQuantity((q) => q + 1)}
                  />
                  {quantity > 1 && (
                    <p className="text-xs text-foreground/50 mt-1.5">
                      Subtotal: <span className="font-semibold text-foreground">KSh {(effectivePrice * quantity).toLocaleString()}</span>
                    </p>
                  )}
                </div>

                {/* Cart stepper OR Add to cart */}
                {qtyInCart > 0 ? (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-foreground/50 uppercase tracking-wider">In cart</div>
                      <div className="text-sm font-bold text-primary">{qtyInCart} {qtyInCart === 1 ? "item" : "items"}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center font-bold text-foreground/70 disabled:opacity-40 transition"
                        onClick={handleCartMinus}
                        disabled={upsertMeCartItem.isPending || removeMeCartItem.isPending}
                        aria-label="Remove one from cart"
                      >
                        –
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center font-bold text-foreground/70 disabled:opacity-40 transition"
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
                    className={primaryBtnCls}
                    onClick={handleAddToCart}
                    disabled={!inStock || !selectedVariantId || upsertMeCartItem.isPending}
                  >
                    {added ? "✓ Added to cart!" : "Add to cart"}
                  </button>
                )}

                <button
                  className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition-all h-11 text-sm border-2 border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
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
                  onClick={handleToggleWishlist}
                  disabled={!isAuthenticated || toggleWishlist.isPending || !selectedVariantId}
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

                {/* Seller / dispatch note */}
                <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-[11px] text-foreground/55 border border-border">
                  🚚 Usually dispatched within <span className="font-semibold text-foreground/80">1–2 business days</span>. Delivery to Nairobi from <span className="font-semibold text-foreground/80">KSh 200</span>.
                </div>

              </div>
            </div>

          </div>

          {/* ════════════════════════════════════════════════════════════════
              RELATED PRODUCTS
          ════════════════════════════════════════════════════════════════ */}
          {related.length > 0 && (
            <section className="mt-12">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Related products</h2>
                  <p className="text-sm text-foreground/50 mt-0.5">You might also like these</p>
                </div>
                <Link
                  to={`/products${categoryIdForRelated ? `?category_id=${categoryIdForRelated}` : ""}`}
                  className="text-xs font-semibold text-primary hover:underline hidden sm:inline"
                >
                  View all →
                </Link>
              </div>
              <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {related.map((p) => (
                    <ProductCard
                      key={p.slug}
                      product={p}
                      hideAddToCart
                      className="transition-all hover:-translate-y-1 hover:shadow-md"
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>

        {/* ════════════════════════════════════════════════════════════════
            MOBILE STICKY BOTTOM BAR
        ════════════════════════════════════════════════════════════════ */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-3 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center gap-2.5">
            {/* Price */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-foreground/50 uppercase tracking-wide">Price</div>
              <div className="text-base font-bold text-primary leading-tight truncate">
                KSh {effectivePrice.toLocaleString()}
              </div>
            </div>
            {/* Qty */}
            <QtyControl
              value={quantity}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrement={() => setQuantity((q) => q + 1)}
              size="sm"
            />
            {/* Add to cart */}
            <button
              className={cn(
                "shrink-0 inline-flex items-center justify-center rounded-xl font-semibold transition-all h-10 px-4 text-sm active:scale-[0.97]",
                added
                  ? "bg-green-600 text-white"
                  : inStock
                  ? "bg-primary text-white hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              onClick={handleAddToCart}
              disabled={!inStock || !selectedVariantId || upsertMeCartItem.isPending}
            >
              {added ? "✓ Added" : "Add to cart"}
            </button>
            {/* Buy now */}
            <button
              className="shrink-0 inline-flex items-center justify-center rounded-xl font-semibold transition-all h-10 px-4 text-sm border-2 border-primary text-primary hover:bg-primary hover:text-white active:scale-[0.97] disabled:opacity-50"
              onClick={handleBuyNow}
              disabled={!inStock || !selectedVariantId}
            >
              Buy
            </button>
          </div>
        </div>

        {/* Mobile spacer */}
        <div className="h-20 lg:hidden" />
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;