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

  const feeds = [
    { type: "trending", query: useDiscoveryFeed("trending", 12) },
    { type: "deals", query: useDiscoveryFeed("deals", 12) },
    { type: "best_sellers", query: useDiscoveryFeed("best_sellers", 12) },
    { type: "new_arrivals", query: useDiscoveryFeed("new_arrivals", 12) },
    { type: "featured", query: useDiscoveryFeed("featured", 12) },
    { type: "editorial", query: useDiscoveryFeed("editorial", 12) },

    // Recommended should be only for logged in users
    ...(isAuthenticated ? [{ type: "recommended", query: useDiscoveryFeed("recommended", 12) }] : []),
  ];

  // Hero sidebar categories
  const heroCategories = useMemo(
    () => (categories ?? []).slice(0, 18).map((c) => ({ id: c.id, name: c.name })),
    [categories]
  );

  // Sort feeds: those with < 6 items go to bottom.
  // If still loading, keep order stable (don’t reorder while loading).
  const sortedFeeds = useMemo(() => {
    return [...feeds].sort((a, b) => {
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
  }, [isAuthenticated, ...feeds.map((f) => f.query.data?.items?.length), ...feeds.map((f) => f.query.isLoading)]);

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