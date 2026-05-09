import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCartStore } from "@/features/cart/store/cartStore";

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

// ─── Extracted components ─────────────────────────────────────────────────────
import { ProductDetailSeo } from "../utils/useProductDetailSeo";
import { ProductGallery } from "../components/product_details/ProductGallery";
import { ProductInfo } from "../components/product_details/ProductInfo";
import { BuyBox } from "../components/product_details/BuyBox";
import { MobileStickyBar } from "../components/product_details/MobileStickyBar";
import { RelatedProducts } from "../components/product_details/RelatedProducts";
import { ChevronRightIcon } from "../components/product_details/icons";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const inventoryStatusToInStock = (s: string | undefined) =>
  s === "in_stock" || s === "low_stock";

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

const buildWhatsAppUrl = (name: string, price: number, slug: string) => {
  const phone = "254795974591";
  const text = `Hi Zentora, I'm interested in: ${name} (KSh ${price}) - ${window.location.origin}/products/${slug}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // ── Data ──
  const productQuery = useProductDetail(slug);
  const product = productQuery.data;
  const productId = product?.id;

  const variantsQuery = useProductVariants(productId);
  const variants = variantsQuery.data ?? [];

  // ── Selection state ──
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!variants.length || selectedVariantId !== undefined) return;
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
    return (meCartQuery.data?.items ?? [])
      .find((i) => i.product_id === productId && i.variant_id === selectedVariantId) ?? null;
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
    return (wishlistQuery.data?.items ?? [])
      .some((i) => i.product_id === productId && i.variant_id === selectedVariantId);
  }, [isAuthenticated, wishlistQuery.data, productId, selectedVariantId]);

  // ── Related ──
  const categoryIdForRelated = product?.categories?.[0]?.id;
  const relatedQuery = useRelatedProducts(categoryIdForRelated);
  const related = useMemo(() => {
    return (relatedQuery.data?.items ?? [])
      .filter((i) => i.slug !== product?.slug)
      .slice(0, 12)
      .map(mapDiscoveryItemToProduct);
  }, [relatedQuery.data, product?.slug]);

  // ── Derived display values ──
  const description = product?.description?.Valid ? product.description.String : "";
  const shortDescription = product?.short_description?.Valid ? product.short_description.String : "";
  const tags = (product?.tags ?? []).map((t) => t.name);
  const attributeValues = product?.attribute_values ?? [];

  const discountPercent = (() => {
    const original = Number(product?.base_price ?? 0);
    if (!original || original <= effectivePrice) return 0;
    return Math.round(((original - effectivePrice) / original) * 100);
  })();

  // ── Handlers ──
  const handleAddToCart = async () => {
    if (!product || !productId || !selectedVariantId || !inStock) return;
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
      if (authCartItem) await removeMeCartItem.mutateAsync(authCartItem.id);
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

  // ── Loading / not found ──
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

  const canonicalUrl = `${window.location.origin}/products/${product.slug}`;
  const whatsAppUrl = buildWhatsAppUrl(product.name, effectivePrice, product.slug);

  // ── Shared qty callbacks ──
  const onDecrement = () => setQuantity((q) => Math.max(1, q - 1));
  const onIncrement = () => setQuantity((q) => q + 1);

  return (
    <MainLayout>
      {/* ── All SEO: title, meta, OG, Twitter, JSON-LD ── */}
      <ProductDetailSeo
        name={product.name}
        slug={product.slug}
        description={description}
        shortDescription={shortDescription}
        brand={product.brand_id?.Valid ? String(product.brand_id.Int64) : undefined}
        categories={product.categories ?? []}
        imageUrls={imageUrls}
        price={effectivePrice}
        basePrice={Number(product.base_price)}
        currency="KES"
        inStock={inStock}
        sku={selectedVariant?.sku}
        rating={product.rating ?? 0}
        reviewCount={product.review_count ?? 0}
        isActive={product.status === "active"}
      />

      <div className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 lg:pt-6 lg:pb-16">

          {/* ── Breadcrumb ── */}
          <nav
            className="flex items-center gap-1.5 text-xs text-foreground/50 mb-5 overflow-x-auto whitespace-nowrap"
            aria-label="Breadcrumb"
          >
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

          {/* ── Main 12-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">

            {/* Gallery */}
            <ProductGallery
              imageUrls={imageUrls}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
              productName={product.name}
              discountPercent={discountPercent}
              isFeatured={product.is_featured}
              isDigital={product.is_digital}
              isWished={isWished}
              isAuthenticated={isAuthenticated}
              wishlistPending={toggleWishlist.isPending}
              selectedVariantId={selectedVariantId}
              canonicalUrl={canonicalUrl}
              whatsAppUrl={whatsAppUrl}
              onToggleWishlist={handleToggleWishlist}
            />

            {/* Info + tabs */}
            <ProductInfo
              productName={product.name}
              categories={product.categories ?? []}
              rating={product.rating ?? 0}
              reviewCount={product.review_count ?? 0}
              basePrice={Number(product.base_price)}
              effectivePrice={effectivePrice}
              discountPercent={discountPercent}
              shortDescription={shortDescription}
              description={description}
              tags={tags}
              attributeValues={attributeValues}
              variants={variants}
              selectedVariantId={selectedVariantId}
              activeTab={activeTab}
              isWished={isWished}
              isAuthenticated={isAuthenticated}
              wishlistPending={toggleWishlist.isPending}
              stockLoading={stockQuery.isLoading}
              inStock={inStock}
              availableQty={availableQty}
              selectedVariantSku={selectedVariant?.sku}
              onSelectVariant={setSelectedVariantId}
              onSetActiveTab={setActiveTab}
              onToggleWishlist={handleToggleWishlist}
            />

            {/* Desktop buy box */}
            <BuyBox
              effectivePrice={effectivePrice}
              quantity={quantity}
              qtyInCart={qtyInCart}
              inStock={inStock}
              stockLoading={stockQuery.isLoading}
              availableQty={availableQty}
              added={added}
              isWished={isWished}
              isAuthenticated={isAuthenticated}
              wishlistPending={toggleWishlist.isPending}
              selectedVariantId={selectedVariantId}
              upsertPending={upsertMeCartItem.isPending}
              removePending={removeMeCartItem.isPending}
              productName={product.name}
              productSlug={product.slug}
              whatsAppUrl={whatsAppUrl}
              onDecrement={onDecrement}
              onIncrement={onIncrement}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onCartMinus={handleCartMinus}
              onCartPlus={handleCartPlus}
              onToggleWishlist={handleToggleWishlist}
            />

          </div>

          {/* Related products */}
          <RelatedProducts
            products={related}
            categoryIdForLink={categoryIdForRelated}
          />

        </div>

        {/* Mobile sticky bar */}
        <MobileStickyBar
          effectivePrice={effectivePrice}
          quantity={quantity}
          inStock={inStock}
          added={added}
          selectedVariantId={selectedVariantId}
          upsertPending={upsertMeCartItem.isPending}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />

      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;