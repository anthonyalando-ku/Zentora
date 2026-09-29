import { MainLayout } from "@/shared/layouts";
import { useCategories } from "@/features/catalog/hooks/useCategories";
import { useDiscoveryFeed } from "@/features/discovery/hooks/useDiscoveryFeed";
import { useAuthStore } from "@/features/auth/store/authStore";
import { FloatingActions } from "@/shared/layouts/components/FloatingActions";
import type { DiscoveryFeedType } from "@/core/api/services/discovery";
import HeroMarketplace from "../components/HeroMarketPlace";
import CategoryGrid from "../components/CategoryGrid";
import FeedSection from "../components/FeedSection";
import TrustBadges from "../components/TrustBadges";
import { Merchandising, CategoryPromotions } from "../components/Merchandising";
function Collection({ type, spotlight = false }: { type: DiscoveryFeedType; spotlight?: boolean }) {
  const query = useDiscoveryFeed(type, 6);
  return <FeedSection feedType={type} items={query.data?.items} isLoading={query.isLoading} isError={query.isError} onRetry={() => void query.refetch()} spotlight={spotlight} />;
}
export default function HomePage() {
  const categories = useCategories();
  const authenticated = useAuthStore(s => s.isAuthenticated);
  const featured = useDiscoveryFeed("featured", 6);
  const arrivals = useDiscoveryFeed("new_arrivals", 6);
  const bestSellers = useDiscoveryFeed("best_sellers", 6);
  const deals = useDiscoveryFeed("deals", 6);
  return <MainLayout><div className="store-home"><div className="store-shell">
    <HeroMarketplace featured={featured.data?.items} arrivals={arrivals.data?.items} bestSellers={bestSellers.data?.items} loading={featured.isLoading || arrivals.isLoading || bestSellers.isLoading} sideLoading={arrivals.isLoading || bestSellers.isLoading} />
    <TrustBadges />
    <CategoryGrid categories={categories.data ?? []} isLoading={categories.isLoading} isError={categories.isError} onRetry={() => void categories.refetch()} />
    <Merchandising deals={deals.data?.items} />
    <Collection type="trending" />
    <CategoryPromotions categories={categories.data ?? []} />
    <Collection type="new_arrivals" />
    <Collection type="best_sellers" spotlight />
    <Collection type="editorial" />
    {authenticated && <Collection type="recommended" />}
  </div></div><FloatingActions phoneNumber="+254795974591" phoneDisplay="+254 795 974591" whatsappNumber="254795974591" /></MainLayout>;
}
