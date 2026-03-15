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

    // backend upsert rejects qty <= 0; use DELETE when going to zero
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
      .slice(0, 4)
      .map(mapDiscoveryItemToProduct);
  }, [relatedQuery.data, product?.slug]);

  if (!product && !productQuery.isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-foreground/50 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          {product?.categories?.[0]?.id && (
            <>
              <span>/</span>
              <Link to={`/products?category_id=${product.categories[0].id}`} className="hover:text-primary capitalize">
                {product.categories[0].name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-border">
              <img
                src={imageUrls[selectedImage] ?? imageUrls[0]}
                alt={product?.name ?? ""}
                className="w-full h-full object-cover"
              />
            </div>
            {imageUrls.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {imageUrls.map((img, idx) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? "border-primary" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{product?.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <Rating value={product?.rating ?? 0} size="md" showCount reviewCount={product?.review_count ?? 0} />
              <span className="text-sm text-foreground/40">|</span>
              <span className={`text-sm font-medium ${inStock ? "text-green-500" : "text-destructive"}`}>
                {stockQuery.isLoading ? "Checking stock..." : inStock ? "In Stock" : "Out of Stock"}
              </span>

              <button
                type="button"
                className={cn(
                  "ml-auto inline-flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-secondary/10 transition",
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

            {variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3">Variant</h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-sm transition-colors",
                        selectedVariantId === v.id
                          ? "border-primary text-primary bg-primary/5"
                          : "border-border hover:bg-secondary/10 text-foreground/70"
                      )}
                    >
                      {v.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">KSh {effectivePrice.toLocaleString()}</span>
            </div>

            {description && <p className="text-foreground/70 leading-relaxed mb-6">{description}</p>}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  className="w-10 h-11 flex items-center justify-center hover:bg-secondary/10 transition-colors disabled:opacity-50"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <button
                  className="w-10 h-11 flex items-center justify-center hover:bg-secondary/10 transition-colors"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {qtyInCart > 0 ? (
                <div className="flex-1 flex items-center justify-between gap-3 rounded-lg border border-border h-11 px-4">
                  <span className="text-sm text-foreground/70">In cart: {qtyInCart}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-md border border-border hover:bg-secondary/10"
                      onClick={handleCartMinus}
                      disabled={upsertMeCartItem.isPending || removeMeCartItem.isPending}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-md border border-border hover:bg-secondary/10"
                      onClick={handleCartPlus}
                      disabled={!inStock || upsertMeCartItem.isPending}
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition h-11 px-6 text-sm ${
                    added
                      ? "bg-green-500 text-white"
                      : inStock
                        ? "bg-primary text-white hover:opacity-90"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleAddToCart}
                  disabled={!inStock || !selectedVariantId || upsertMeCartItem.isPending}
                >
                  {added ? "Added!" : "Add to Cart"}
                </button>
              )}
            </div>

            <button
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg font-medium transition h-11 px-6 text-sm border border-border hover:bg-secondary/10 disabled:opacity-50"
              onClick={handleBuyNow}
              disabled={!inStock || !selectedVariantId}
            >
              Buy Now
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} hideAddToCart />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

const cn = (...classes: Array<string | false | undefined | null>) => classes.filter(Boolean).join(" ");

export default ProductDetailPage;