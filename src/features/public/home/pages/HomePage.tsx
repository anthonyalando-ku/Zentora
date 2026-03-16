import { Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { Badge } from "@/shared/components/ui";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useDiscoveryFeed } from "@/features/discovery/hooks/useDiscoveryFeed";
import type { Product } from "@/shared/types/product";
import type { DiscoveryFeedItem, DiscoveryFeedType } from "@/core/api/services/discovery";

const feedTitle: Record<DiscoveryFeedType, string> = {
  trending: "Trending",
  best_sellers: "Best Sellers",
  recommended: "Recommended",
  deals: "Deals",
  new_arrivals: "New Arrivals",
  highly_rated: "Highly Rated",
  most_wishlisted: "Most Wishlisted",
  also_viewed: "Also Viewed",
  featured: "Featured",
  editorial: "Editorial",
  category: "Category",
};

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
    category: "electronics", // placeholder only; homepage card doesn't use category label
    images: [],
    thumbnail: item.primary_image ?? "https://picsum.photos/seed/zentora-fallback/600/600",
    rating: item.rating ?? 0,
    reviewCount: item.review_count ?? 0,
    inStock: inventoryStatusToInStock(item.inventory_status),
    tags: [],
  };
};

const FeedSection = ({ feedType, items }: { feedType: DiscoveryFeedType; items: DiscoveryFeedItem[] | undefined }) => {
  if (!items || items.length === 0) return null;

  const subtitle =
    feedType === "trending"
      ? "Popular items customers are buying"
      : feedType === "deals"
        ? "Limited-time discounts & hot offers"
        : feedType === "best_sellers"
          ? "Top-selling picks across the store"
          : feedType === "new_arrivals"
            ? "Freshly added products you’ll love"
            : "Handpicked products just for you";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl border border-border bg-background shadow-sm">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">{feedTitle[feedType]}</h2>
              <p className="text-sm text-foreground/60 mt-1">{subtitle}</p>
            </div>

            <Link
              to={`/products?feed_type=${feedType}`}
              className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors"
            >
              Show More
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Dense marketplace grid */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => {
              const product = mapDiscoveryItemToProduct(item);
              return (
                <div
                  key={product.slug}
                  className="transform transition-all hover:-translate-y-1 hover:shadow-lg rounded-2xl"
                >
                  <ProductCard product={product} hideAddToCart showWishlist />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const { data: categories } = useCategories();

  const trending = useDiscoveryFeed("trending", 8);
  const bestSellers = useDiscoveryFeed("best_sellers", 8);
  const newArrivals = useDiscoveryFeed("new_arrivals", 8);
  const deals = useDiscoveryFeed("deals", 8);

  return (
    <MainLayout>
      {/* Page base */}
      <div className="bg-background">
        {/* Promotional Banner (top of page) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="relative overflow-hidden rounded-2xl shadow-sm border border-border bg-gradient-to-r from-primary to-primary/80">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[280px] md:min-h-[320px]">
              {/* Left content */}
              <div className="p-6 sm:p-8 md:p-12">
                <Badge variant="sale" className="mb-4">
                  Limited Time Offer
                </Badge>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3">
                  Up to 50% Off Electronics
                </h2>

                <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                  Grab the latest gadgets at half the price. Offer ends this weekend!
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/products?category=electronics"
                    className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-11 px-5 text-sm bg-white text-primary hover:bg-white/95"
                  >
                    Shop Electronics
                  </Link>

                  <Link
                    to="/products?feed_type=deals"
                    className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-11 px-5 text-sm border border-white/30 text-white hover:bg-white/10"
                  >
                    View Deals
                  </Link>
                </div>
              </div>

              {/* Right decorative image */}
              <div className="relative hidden md:block h-full">
                <div className="absolute inset-0 opacity-20">
                  <img
                    src="https://picsum.photos/seed/banner-promo/900/700"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-primary/10 to-primary/60" />
                <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-white/10" />
                <div className="absolute -right-12 -top-16 w-56 h-56 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </section>

        {/* Shop By Category (grid, not horizontal scroll) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">Shop by Category</h2>
              <p className="text-sm text-foreground/60 mt-1">Browse popular departments</p>
            </div>
            <Link
              to="/products"
              className="text-sm font-medium text-primary hover:text-secondary transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(categories ?? []).map((category) => (
                <Link
                  key={String(category.id)}
                  to={`/products?category_id=${category.id}`}
                  className="group rounded-xl border border-border bg-background hover:shadow-md hover:-translate-y-1 transition-all p-4"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/5 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                      <img
                        src={category.image_url ?? "https://picsum.photos/seed/zentora-category/400/300"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="text-sm font-medium text-foreground line-clamp-2">{category.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Product feeds in desired order */}
        <FeedSection feedType="trending" items={trending.data?.items} />
        <FeedSection feedType="deals" items={deals.data?.items} />
        <FeedSection feedType="best_sellers" items={bestSellers.data?.items} />
        <FeedSection feedType="new_arrivals" items={newArrivals.data?.items} />

        {/* Trust badges */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">Why shop with us</h2>
                <p className="text-sm text-foreground/60 mt-1">Fast delivery, secure payments, and easy returns</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🚚", title: "Free Delivery", desc: "On orders over KSh 5,000" },
                { icon: "🔄", title: "Easy Returns", desc: "30-day return policy" },
                { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
                { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-background p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-foreground">{item.title}</div>
                      <div className="text-xs text-foreground/60 mt-1">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage;