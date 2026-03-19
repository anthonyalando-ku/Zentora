import CategorySidebar from "./CategorySidebar";
import HeroCarousel from "./HeroCarousel";
import PromoStack from "./PromoStack";
import { useMemo } from "react";

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


  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: Category sidebar */}
        <CategorySidebar categories={categories}  />

        {/* CENTER: Carousel */}
        <HeroCarousel slides={slides} className="lg:col-span-6" />

        {/* RIGHT: Promo stack */}
        <PromoStack  />
      </div>
    </section>
  );
};  

export default HeroMarketplace;