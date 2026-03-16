import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { Rating } from "@/shared/components/ui";
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

const inventoryStatusToInStock = (s: string | undefined) => s === "in_stock" || s === "low_stock";

const mapDiscoveryItemToProduct = (item: DiscoveryFeedItem): Product => {
  const discount = Number(item.discount ?? 0);
  const originalPrice = discount > 0 ? item.price / (1 - discount / 100) : undefined;

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
    thumbnail: item.primary_image ?? "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: item.rating ?? 0,
    reviewCount: item.review_count ?? 0,
    inStock: inventoryStatusToInStock(item.inventory_status),
    tags: [],
  };
};

const cn = (...classes: Array<string | false | undefined | null>) => classes.filter(Boolean).join(" ");

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const productQuery = useProductDetail(slug);
  const product = productQuery.data;
  const productId = product?.id;

  const variantsQuery = useProductVariants(productId);
  const variants = variantsQuery.data ?? [];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!variants.length) return;
    if (selectedVariantId !== undefined) return;
    setSelectedVariantId(variants[0].id);
  }, [variants, selectedVariantId]);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId),
    [variants, selectedVariantId]
  );

  const stockQuery = useVariantStock(selectedVariantId);
  const availableQty = stockQuery.data?.available_qty ?? 0;
  const inStock = availableQty > 0;

  const imageUrls = useMemo(() => {
    const imgs = (product?.images ?? [])
      .slice()
      .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
      .map((i) => i.image_url);

    return imgs.length ? imgs : ["https://picsum.photos/seed/zentora-detail/800/800"];
  }, [product?.images]);

  useEffect(() => {
    setSelectedImage(0);
  }, [productId]);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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

    if (!isAuthenticated) {
      return guestCart.getVariantQuantity(productId, selectedVariantId);
    }

    return authCartItem?.quantity ?? 0;
  }, [authCartItem?.quantity, guestCart, isAuthenticated, productId, selectedVariantId]);

  const effectivePrice = useMemo(() => {
    return Number(selectedVariant?.price ?? product?.base_price ?? 0);
  }, [selectedVariant?.price, product?.base_price]);

  const wishlistQuery = useMeWishlist();
  const toggleWishlist = useToggleWishlist();

  const isWished = useMemo(() => {
    if (!isAuthenticated || !productId || !selectedVariantId) return false;
    const items = wishlistQuery.data?.items ?? [];
    return items.some((i) => i.product_id === productId && i.variant_id === selectedVariantId);
  }, [isAuthenticated, wishlistQuery.data, productId, selectedVariantId]);

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

    const nextQty = qtyInCart + quantity;

    await upsertMeCartItem.mutateAsync({
      product_id: productId,
      variant_id: selectedVariantId,
      quantity: nextQty,
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

    await toggleWishlist.mutateAsync({
      isWished,
      product_id: productId,
      variant_id: selectedVariantId,
    });
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
    if (!productId || !selectedVariantId) return;
    if (!inStock) return;

    if (!isAuthenticated) {
      guestCart.updateQuantity(productId, selectedVariantId, qtyInCart + 1);
      return;
    }

    const nextQty = qtyInCart + 1;

    await upsertMeCartItem.mutateAsync({
      product_id: productId,
      variant_id: selectedVariantId,
      quantity: nextQty,
      price_at_added: String(effectivePrice),
    });
  };

  const categoryIdForRelated = product?.categories?.[0]?.id;
  const relatedQuery = useRelatedProducts(categoryIdForRelated);

  const related = useMemo(() => {
    const items = relatedQuery.data?.items ?? [];
    return items
      .filter((i) => i.slug !== product?.slug)
      .slice(0, 12)
      .map(mapDiscoveryItemToProduct);
  }, [relatedQuery.data, product?.slug]);

  // ✅ IMPORTANT FIX: Never call hooks after conditional returns.
  // The previous version computed discountPercent with useMemo AFTER early returns.
  // When product is loading/not-found, that hook did not run -> hook order mismatch.
  // Compute it without a hook, and compute it only when product exists.
  const discountPercent = (() => {
    const original = Number(product?.base_price ?? 0);
    if (!original || original <= 0) return 0;
    if (!effectivePrice || effectivePrice <= 0) return 0;
    if (effectivePrice >= original) return 0;
    return Math.round(((original - effectivePrice) / original) * 100);
  })();

  if (!product && !productQuery.isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-foreground/50 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-10 px-5 text-sm bg-primary text-white hover:opacity-90"
          >
            Browse Products
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (productQuery.isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-foreground/50">Loading product…</p>
        </div>
      </MainLayout>
    );
  }

  const description = product?.description?.Valid ? product.description.String : "";
  const tags = (product?.tags ?? []).map((t) => t.name);

  return (
    <MainLayout>
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-foreground/50 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            {product?.categories?.[0]?.id && (
              <>
                <span>/</span>
                <Link
                  to={`/products?category_id=${product.categories[0].id}`}
                  className="hover:text-primary transition-colors capitalize"
                >
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground line-clamp-1">{product?.name}</span>
          </nav>

          {/* Main product: 12-col marketplace layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* LEFT: Gallery */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Thumbnails */}
                  {imageUrls.length > 1 && (
                    <div className="order-2 lg:order-1">
                      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[520px] pb-1 lg:pb-0 pr-1">
                        {imageUrls.map((img, idx) => (
                          <button
                            key={img}
                            onClick={() => setSelectedImage(idx)}
                            className={cn(
                              "shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-colors bg-white",
                              selectedImage === idx ? "border-primary" : "border-border hover:border-primary/40"
                            )}
                            title={`Image ${idx + 1}`}
                          >
                            <img src={img} alt="" className="w-full h-full object-contain bg-gray-50" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main image */}
                  <div className="order-1 lg:order-2 flex-1">
                    <div className="aspect-[4/5] max-h-[520px] rounded-2xl overflow-hidden bg-gray-50 border border-border">
                      <img
                        src={imageUrls[selectedImage] ?? imageUrls[0]}
                        alt={product?.name ?? ""}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-foreground/50">
                      <span>{imageUrls.length > 1 ? `Image ${selectedImage + 1} of ${imageUrls.length}` : "Image"}</span>
                      <span className="hidden sm:inline">Swipe thumbnails to view more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MIDDLE: Product information */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">{product?.name}</h1>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Rating value={product?.rating ?? 0} size="md" showCount reviewCount={product?.review_count ?? 0} />

                  <span className={cn("text-sm font-medium", inStock ? "text-green-600" : "text-destructive")}>
                    {stockQuery.isLoading ? "Checking stock..." : inStock ? "In Stock" : "Out of Stock"}
                  </span>

                  <button
                    type="button"
                    className={cn(
                      "ml-auto inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-background hover:bg-secondary/10 transition",
                      !isAuthenticated && "opacity-60"
                    )}
                    onClick={handleToggleWishlist}
                    disabled={!isAuthenticated || toggleWishlist.isPending || !selectedVariantId}
                    title={isAuthenticated ? "Wishlist" : "Login to use wishlist"}
                  >
                    <svg
                      className={cn("w-5 h-5", isWished ? "text-primary" : "text-foreground/70")}
                      viewBox="0 0 24 24"
                      fill={isWished ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Price block */}
                <div className="mt-5 rounded-2xl border border-border bg-primary/5 p-4">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-foreground/60">Price</div>
                      <div className="text-2xl sm:text-3xl font-bold text-primary">
                        KSh {effectivePrice.toLocaleString()}
                      </div>

                      {Number(product?.base_price ?? 0) > effectivePrice && (
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <span className="text-foreground/50 line-through">
                            KSh {Number(product?.base_price ?? 0).toLocaleString()}
                          </span>
                          {discountPercent > 0 && (
                            <span className="text-xs font-semibold text-white bg-secondary rounded-full px-2 py-0.5">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right text-xs text-foreground/60">
                      {inStock ? (
                        <span>
                          Available: <span className="font-semibold text-foreground">{availableQty}</span>
                        </span>
                      ) : (
                        <span>Currently unavailable</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Variant selector */}
                {variants.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm text-foreground">Variant</h3>
                      <span className="text-xs text-foreground/50">{selectedVariant ? selectedVariant.sku : "Select"}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={cn(
                            "px-4 py-2 rounded-xl border text-sm transition-colors",
                            selectedVariantId === v.id
                              ? "border-primary bg-primary/5 text-primary font-medium"
                              : "border-border hover:border-primary/40 hover:bg-secondary/10 text-foreground/80"
                          )}
                        >
                          {v.sku}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-sm text-foreground mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description preview */}
                {description && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-sm text-foreground mb-2">About this item</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed line-clamp-4">{description}</p>
                  </div>
                )}
              </div>

              {/* Sections */}
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
                  <h3 className="font-semibold text-sm mb-2">Product Description</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                    {description || "No description provided."}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
                  <h3 className="font-semibold text-sm mb-2">Specifications</h3>
                  <div className="text-sm text-foreground/70">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-foreground/60">SKU</span>
                      <span className="font-medium text-foreground">{selectedVariant?.sku ?? "—"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-foreground/60">Category</span>
                      <span className="font-medium text-foreground">{product?.categories?.[0]?.name ?? "—"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-foreground/60">Stock</span>
                      <span className={cn("font-medium", inStock ? "text-green-600" : "text-destructive")}>
                        {inStock ? "Available" : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
                  <h3 className="font-semibold text-sm mb-2">Reviews</h3>
                  <div className="flex items-center gap-3">
                    <Rating value={product?.rating ?? 0} size="md" showCount reviewCount={product?.review_count ?? 0} />
                    <span className="text-sm text-foreground/60">Customer ratings</span>
                  </div>
                  <p className="text-sm text-foreground/60 mt-3">Reviews UI will be expanded in a future stage.</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Buy box */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5 sticky top-24 space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs text-foreground/60">Your price</div>
                    <div className="text-2xl font-bold text-primary">KSh {effectivePrice.toLocaleString()}</div>
                  </div>
                  <span className={cn("text-xs font-semibold", inStock ? "text-green-600" : "text-destructive")}>
                    {inStock ? "Available" : "Out of stock"}
                  </span>
                </div>

                <div className="text-xs text-foreground/60">
                  {stockQuery.isLoading ? "Checking stock…" : inStock ? `Only ${availableQty} left` : "Currently unavailable"}
                </div>

                <div>
                  <div className="text-xs text-foreground/60 mb-2">Quantity</div>
                  <div className="flex items-center border border-border rounded-xl overflow-hidden bg-background">
                    <button
                      className="w-10 h-11 flex items-center justify-center hover:bg-secondary/10 transition-colors disabled:opacity-50"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="flex-1 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      className="w-10 h-11 flex items-center justify-center hover:bg-secondary/10 transition-colors"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {qtyInCart > 0 ? (
                  <div className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-foreground/60">In cart</div>
                        <div className="text-sm font-semibold">{qtyInCart}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl border border-border hover:bg-secondary/10"
                          onClick={handleCartMinus}
                          disabled={upsertMeCartItem.isPending || removeMeCartItem.isPending}
                          aria-label="Decrease in cart"
                        >
                          –
                        </button>
                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl border border-border hover:bg-secondary/10 disabled:opacity-50"
                          onClick={handleCartPlus}
                          disabled={!inStock || upsertMeCartItem.isPending}
                          aria-label="Increase in cart"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-11 px-5 text-sm",
                      added
                        ? "bg-green-600 text-white"
                        : inStock
                          ? "bg-primary text-white hover:opacity-90"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                    onClick={handleAddToCart}
                    disabled={!inStock || !selectedVariantId || upsertMeCartItem.isPending}
                  >
                    {added ? "Added!" : "Add to Cart"}
                  </button>
                )}

                <button
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-11 px-5 text-sm border border-border hover:bg-secondary/10 disabled:opacity-50"
                  onClick={handleBuyNow}
                  disabled={!inStock || !selectedVariantId}
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-11 px-5 text-sm border border-border hover:bg-secondary/10",
                    !isAuthenticated && "opacity-60"
                  )}
                  onClick={handleToggleWishlist}
                  disabled={!isAuthenticated || toggleWishlist.isPending || !selectedVariantId}
                >
                  <svg
                    className={cn("w-5 h-5", isWished ? "text-primary" : "text-foreground/70")}
                    viewBox="0 0 24 24"
                    fill={isWished ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
                    />
                  </svg>
                  Wishlist
                </button>

                <div className="pt-2 border-t border-border text-sm text-foreground/70 space-y-2">
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
                    <span>7-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-10">
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Related Products</h2>
                  <p className="text-sm text-foreground/60">You might also like these</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {related.map((p) => (
                    <div
                      key={p.slug}
                      className="h-[250px] overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-lg rounded-2xl"
                    >
                      <ProductCard product={p} hideAddToCart />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 p-3 z-40">
          <div className="max-w-7xl mx-auto px-1 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] text-foreground/60">Price</div>
              <div className="text-base font-semibold text-primary leading-tight">
                KSh {effectivePrice.toLocaleString()}
              </div>
            </div>

            <button
              className={cn(
                "shrink-0 inline-flex items-center justify-center rounded-xl font-medium transition h-11 px-5 text-sm",
                added
                  ? "bg-green-600 text-white"
                  : inStock
                    ? "bg-primary text-white hover:opacity-90"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              onClick={handleAddToCart}
              disabled={!inStock || !selectedVariantId || upsertMeCartItem.isPending}
            >
              {added ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </div>

        <div className="h-20 lg:hidden" />
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;