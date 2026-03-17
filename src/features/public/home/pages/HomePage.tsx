import { useEffect, useMemo, useState } from "react";
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-2xl border border-border bg-background shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-border">
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

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => {
              const product = mapDiscoveryItemToProduct(item);
              return (
                <div key={product.slug} className="transform transition-all hover:-translate-y-1 hover:shadow-lg rounded-2xl">
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

/** HERO: Category sidebar + Carousel + Promo stack (UI only) */
const HeroMarketplace = ({
  categories,
}: {
  categories: Array<{ id: string | number; name: string }>;
}) => {
  const slides = useMemo(
    () => [
      {
        id: "s1",
        badge: "Limited Time Offer",
        title: "Up to 50% Off Electronics",
        subtitle: "Grab the latest gadgets at half the price. Offer ends this weekend!",
        cta1: { label: "Shop Electronics", href: "/products?category=electronics" },
        cta2: { label: "View Deals", href: "/products?feed_type=deals" },
        image: "https://picsum.photos/seed/hero-slide-1/1200/700",
        gradient: "from-primary to-primary/80",
      },
      {
        id: "s2",
        badge: "New Season",
        title: "Fresh Arrivals This Week",
        subtitle: "Discover new products curated for you. Updated daily.",
        cta1: { label: "New Arrivals", href: "/products?feed_type=new_arrivals" },
        cta2: { label: "Best Sellers", href: "/products?feed_type=best_sellers" },
        image: "https://picsum.photos/seed/hero-slide-2/1200/700",
        gradient: "from-primary/90 to-secondary/60",
      },
      {
        id: "s3",
        badge: "Trending Now",
        title: "Top Picks Customers Love",
        subtitle: "Browse trending items and popular deals in minutes.",
        cta1: { label: "Trending", href: "/products?feed_type=trending" },
        cta2: { label: "Shop All", href: "/products" },
        image: "https://picsum.photos/seed/hero-slide-3/1200/700",
        gradient: "from-secondary/80 to-primary/80",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(t);
  }, [slides.length]);

  const active = slides[index];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: Category sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <div className="text-sm font-semibold text-foreground">Categories</div>
              <div className="text-xs text-foreground/60 mt-0.5">Browse departments</div>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2 pr-1 scrollbar-thin">
              {categories.map((c) => (
                <Link
                  key={String(c.id)}
                  to={`/products?category_id=${c.id}`}
                  className="group flex items-center justify-between px-3 py-2 rounded-xl text-sm text-foreground/80 hover:bg-secondary/10 hover:text-primary transition-colors"
                >
                  <span className="line-clamp-1">{c.name}</span>
                  <svg
                    className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER: Carousel */}
        <div className="lg:col-span-6">
          <div className={`relative overflow-hidden rounded-2xl shadow-sm border border-border bg-gradient-to-r ${active.gradient}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[240px] md:min-h-[360px]">
              <div className="p-6 sm:p-8 md:p-10 relative z-10">
                <Badge variant="sale" className="mb-4">
                  {active.badge}
                </Badge>

                <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
                  {active.title}
                </h2>

                <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                  {active.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to={active.cta1.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-11 px-5 text-sm bg-white text-primary hover:bg-white/95"
                  >
                    {active.cta1.label}
                  </Link>

                  <Link
                    to={active.cta2.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-11 px-5 text-sm border border-white/30 text-white hover:bg-white/10"
                  >
                    {active.cta2.label}
                  </Link>
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute inset-0 opacity-25">
                  <img src={active.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/0 to-black/10" />
              </div>
            </div>

            {/* Arrows */}
            <button
              type="button"
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-black/10 hover:bg-black/20 text-white transition"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            >
              <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-black/10 hover:bg-black/20 text-white transition"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
            >
              <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={[
                    "h-2 rounded-full transition-all",
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Promo stack */}
        <aside className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {[
              {
                title: "Fast Delivery",
                desc: "Get items delivered quickly",
                icon: "🚚",
                href: "/products?feed_type=trending",
              },
              {
                title: "Secure Payments",
                desc: "Protected checkout experience",
                icon: "🔒",
                href: "/account",
              },
              {
                title: "Daily Deals",
                desc: "Limited-time offers everyday",
                icon: "🔥",
                href: "/products?feed_type=deals",
              },
            ].map((p) => (
              <Link
                key={p.title}
                to={p.href}
                className="rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition p-4 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-xl">
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground">{p.title}</div>
                  <div className="text-xs text-foreground/60 mt-1">{p.desc}</div>
                </div>
                <svg className="w-4 h-4 ml-auto text-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

const CategoryGrid = ({
  categories,
}: {
  categories: Array<{ id: string | number; name: string; image_url?: string | null }>;
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">Shop by Category</h2>
          <p className="text-sm text-foreground/60 mt-1">Browse popular departments</p>
        </div>
        <Link to="/products" className="text-sm font-medium text-primary hover:text-secondary transition-colors">
          View all
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(categories ?? []).map((category) => (
            <Link
              key={String(category.id)}
              to={`/products?category_id=${category.id}`}
              className="group rounded-2xl border border-border bg-background hover:shadow-md hover:-translate-y-1 transition-all p-4"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/5 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                  <img
                    src={category.image_url ?? "https://picsum.photos/seed/zentora-category/400/300"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="text-sm font-medium text-foreground line-clamp-2">{category.name}</div>
              </div>
            </Link>
          ))}
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

  // For hero sidebar: keep it simple and safe (no logic changes)
  const heroCategories = useMemo(
    () => (categories ?? []).slice(0, 18).map((c) => ({ id: c.id, name: c.name })),
    [categories]
  );

  return (
    <MainLayout>
      <div className="bg-background">
        {/* HERO (marketplace) */}
        <HeroMarketplace categories={heroCategories} />

        {/* Product feeds */}
        <FeedSection feedType="trending" items={trending.data?.items} />
        <FeedSection feedType="deals" items={deals.data?.items} />
        <FeedSection feedType="best_sellers" items={bestSellers.data?.items} />
        <FeedSection feedType="new_arrivals" items={newArrivals.data?.items} />

        {/* Category grid moved BELOW feeds */}
        <CategoryGrid categories={categories ?? []} />

        {/* Trust badges */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <div key={i} className="rounded-xl border border-border bg-background p-4 hover:shadow-sm transition-shadow">
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

        {/* Footer spacing */}
        <div className="h-4" />
      </div>
    </MainLayout>
  );
};

export default HomePage;