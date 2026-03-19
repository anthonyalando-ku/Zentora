import { useMemo } from "react";
import { MainLayout } from "@/shared/layouts";
import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useDiscoveryFeed } from "@/features/discovery/hooks/useDiscoveryFeed";
import HeroMarketplace from "../components/HeroMarketPlace";
import CategoryGrid from "../components/CategoryGrid";
import FeedSection from "../components/FeedSection";
import TrustBadges from "../components/TrustBadges";

const HomePage = () => {
  const { data: categories } = useCategories();

  const trending = useDiscoveryFeed("trending", 12);
  const bestSellers = useDiscoveryFeed("best_sellers", 12);
  const newArrivals = useDiscoveryFeed("new_arrivals", 12);
  const deals = useDiscoveryFeed("deals", 12);

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
        <TrustBadges />

        {/* Footer spacing */}
        <div className="h-4" />
      </div>
    </MainLayout>
  );
};

export default HomePage;