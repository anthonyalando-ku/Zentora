import { useMemo } from "react";
import { MainLayout } from "@/shared/layouts";
import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useDiscoveryFeed } from "@/features/discovery/hooks/useDiscoveryFeed";
import HeroMarketplace from "../components/HeroMarketPlace";
import CategoryGrid from "../components/CategoryGrid";
import FeedSection from "../components/FeedSection";
import TrustBadges from "../components/TrustBadges";
import type { DiscoveryFeedType } from "@/core/api/services/discovery";
import { useAuthStore } from "@/features/auth/store/authStore";

const HomePage = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Call hooks unconditionally in a fixed order
  const trendingQ = useDiscoveryFeed("trending", 12);
  const dealsQ = useDiscoveryFeed("deals", 12);
  const bestSellersQ = useDiscoveryFeed("best_sellers", 12);
  const newArrivalsQ = useDiscoveryFeed("new_arrivals", 12);
  const featuredQ = useDiscoveryFeed("featured", 12);
  const editorialQ = useDiscoveryFeed("editorial", 12);
  const recommendedQ = useDiscoveryFeed("recommended", 12); // always call, but render only if authed

  const feeds = useMemo(
    () =>
      [
        { type: "trending", query: trendingQ },
        { type: "deals", query: dealsQ },
        { type: "best_sellers", query: bestSellersQ },
        { type: "new_arrivals", query: newArrivalsQ },
        { type: "featured", query: featuredQ },
        { type: "editorial", query: editorialQ },
        { type: "recommended", query: recommendedQ },
      ] as const,
    [trendingQ, dealsQ, bestSellersQ, newArrivalsQ, featuredQ, editorialQ, recommendedQ]
  );

  const visibleFeeds = useMemo(() => {
    // Filter recommended at render time, not hook-call time
    if (isAuthenticated) return feeds;
    return feeds.filter((f) => f.type !== "recommended");
  }, [feeds, isAuthenticated]);

  const heroCategories = useMemo(
    () => (categories ?? []).slice(0, 18).map((c) => ({ id: c.id, name: c.name })),
    [categories]
  );

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
    // keep sort stable while still updating when data changes
    ...visibleFeeds.map((f) => f.query.data?.items?.length),
    ...visibleFeeds.map((f) => f.query.isLoading),
    ...visibleFeeds.map((f) => f.query.isFetching),
  ]);

  return (
    <MainLayout>
      <div className="bg-background">
        <HeroMarketplace categories={heroCategories} />

        {sortedFeeds.map((feed) => (
          <FeedSection
            key={feed.type}
            feedType={feed.type as DiscoveryFeedType}
            items={feed.query.data?.items}
            isLoading={feed.query.isLoading || feed.query.isFetching}
            isError={feed.query.isError}
          />
        ))}

        <CategoryGrid categories={categories ?? []} isLoading={categoriesLoading} />

        <TrustBadges />

        <div className="h-4" />
      </div>
    </MainLayout>
  );
};

export default HomePage;