import { useMemo } from "react";
import { MainLayout } from "@/shared/layouts";
import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useDiscoveryFeed } from "@/features/discovery/hooks/useDiscoveryFeed";
import HeroMarketplace from "../components/HeroMarketPlace";
// import PromoStack from "../components/PromoStack";
import CategoryGrid from "../components/CategoryGrid";
import FeedSection from "../components/FeedSection";
import TrustBadges from "../components/TrustBadges";
import { FloatingActions } from "@/shared/layouts/components/FloatingActions";
import type { DiscoveryFeedType } from "@/core/api/services/discovery";
import { useAuthStore } from "@/features/auth/store/authStore";

const HomePage = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // ── Discovery feeds — hooks called in a fixed order ─────────────────────────
  const trendingQ    = useDiscoveryFeed("trending", 12);
  const dealsQ       = useDiscoveryFeed("deals", 12);
  const bestSellersQ = useDiscoveryFeed("best_sellers", 12);
  const newArrivalsQ = useDiscoveryFeed("new_arrivals", 12);
  const featuredQ    = useDiscoveryFeed("featured", 12);
  const editorialQ   = useDiscoveryFeed("editorial", 12);
  const recommendedQ = useDiscoveryFeed("recommended", 12);

  const feeds = useMemo(
    () =>
      [
        { type: "trending",     query: trendingQ },
        { type: "deals",        query: dealsQ },
        { type: "best_sellers", query: bestSellersQ },
        { type: "new_arrivals", query: newArrivalsQ },
        { type: "featured",     query: featuredQ },
        { type: "editorial",    query: editorialQ },
        { type: "recommended",  query: recommendedQ },
      ] as const,
    [trendingQ, dealsQ, bestSellersQ, newArrivalsQ, featuredQ, editorialQ, recommendedQ]
  );

  const visibleFeeds = useMemo(() => {
    if (isAuthenticated) return feeds;
    return feeds.filter((f) => f.type !== "recommended");
  }, [feeds, isAuthenticated]);

  const sortedFeeds = useMemo(() => {
    return [...visibleFeeds].sort((a, b) => {
      const aLoading = a.query.isLoading || a.query.isFetching;
      const bLoading = b.query.isLoading || b.query.isFetching;
      if (aLoading || bLoading) return 0;

      const aCount = a.query.data?.items?.length ?? 0;
      const bCount = b.query.data?.items?.length ?? 0;

      const aSmall = aCount < 6;
      const bSmall = bCount < 6;

      if (aSmall === bSmall) return 0;
      return aSmall ? 1 : -1;
    });
  }, [
    visibleFeeds,
    ...visibleFeeds.map((f) => f.query.data?.items?.length),
    ...visibleFeeds.map((f) => f.query.isLoading),
    ...visibleFeeds.map((f) => f.query.isFetching),
  ]);

  return (
    <MainLayout>
      <div className="bg-background">

        {/* 1. Hero carousel — full-width, image-led */}
        <HeroMarketplace />

        {/* 2. Editorial promo banners (4-card row on desktop) */}
        {/* <PromoStack /> */}

        {/* 3. Trust strip — credibility anchor right after the promos */}
        <div className="pt-4 md:pt-6">
          <TrustBadges />
        </div>

        {/* 4. Discovery feeds — Trending, Deals, Best sellers, etc. */}
        {sortedFeeds.map((feed) => (
          <FeedSection
            key={feed.type}
            feedType={feed.type as DiscoveryFeedType}
            items={feed.query.data?.items}
            isLoading={feed.query.isLoading || feed.query.isFetching}
            isError={feed.query.isError}
          />
        ))}

        {/* 5. Shop-by-category grid (kept for discoverability — the hero
              sidebar is gone, but categories also live in the mobile menu /
              desktop "All Categories" pill). */}
        <CategoryGrid categories={categories ?? []} isLoading={categoriesLoading} />

        <div className="h-6" />
      </div>

      {/* 6. Floating contact actions */}
      <FloatingActions
        phoneNumber="+254795974591"
        phoneDisplay="+254 795 974591"
        whatsappNumber="254795974591"
      />
    </MainLayout>
  );
};

export default HomePage;
