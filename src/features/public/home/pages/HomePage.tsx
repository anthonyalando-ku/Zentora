import { useMemo } from "react";
import { MainLayout } from "@/shared/layouts";
import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useDiscoveryFeed } from "@/features/discovery/hooks/useDiscoveryFeed";
import HeroMarketplace from "../components/HeroMarketPlace";
import CategoryGrid from "../components/CategoryGrid";
import FeedSection from "../components/FeedSection";
import TrustBadges from "../components/TrustBadges";
import type { DiscoveryFeedType } from "@/core/api/services/discovery";

const HomePage = () => {
  const { data: categories } = useCategories();

  const feeds = [
    { type: "trending", query: useDiscoveryFeed("trending", 12) },
    { type: "deals", query: useDiscoveryFeed("deals", 12) },
    { type: "best_sellers", query: useDiscoveryFeed("best_sellers", 12) },
    { type: "new_arrivals", query: useDiscoveryFeed("new_arrivals", 12) },
    { type: "featured", query: useDiscoveryFeed("featured", 12) },
    { type: "editorial", query: useDiscoveryFeed("editorial", 12) },
    { type: "recommended", query: useDiscoveryFeed("recommended", 12) },
  ];

  // Hero sidebar categories
  const heroCategories = useMemo(
    () => (categories ?? []).slice(0, 18).map((c) => ({ id: c.id, name: c.name })),
    [categories]
  );

  // Sort feeds: those with < 6 items go to bottom
  const sortedFeeds = useMemo(() => {
    return [...feeds].sort((a, b) => {
      const aCount = a.query.data?.items?.length ?? 0;
      const bCount = b.query.data?.items?.length ?? 0;

      const aSmall = aCount < 6;
      const bSmall = bCount < 6;

      if (aSmall === bSmall) return 0;
      return aSmall ? 1 : -1;
    });
  }, feeds.map((f) => f.query.data?.items?.length));

  return (
    <MainLayout>
      <div className="bg-background">
        {/* HERO */}
        <HeroMarketplace categories={heroCategories} />

        {/* Product feeds */}
        {sortedFeeds.map((feed) => (
          <FeedSection
            key={feed.type}
            feedType={feed.type as DiscoveryFeedType} 
            items={feed.query.data?.items}
          />
        ))}

        {/* Category grid */}
        <CategoryGrid categories={categories ?? []} />

        {/* Trust badges */}
        <TrustBadges />

        <div className="h-4" />
      </div>
    </MainLayout>
  );
};

export default HomePage;