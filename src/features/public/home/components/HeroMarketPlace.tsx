import CategorySidebar from "./CategorySidebar";
import HeroCarousel from "./HeroCarousel";
import { Link } from "react-router-dom";
import { useMemo } from "react";

type Category = { id: string | number; name: string };

const promos = [
  {
    label: "Daily Deals",
    desc: "Limited-time offers",
    bg: "bg-background border-border hover:border-red-300/60",
    href: "/products?feed_type=deals",
    accentBar: "bg-red-500",
    textColor: "text-foreground",
  },
  {
    label: "New Arrivals",
    desc: "Just landed",
    bg: "bg-background border-border hover:border-green-300/60",
    href: "/products?feed_type=new_arrivals",
    accentBar: "bg-green-500",
    textColor: "text-foreground",
  },
  {
    label: "Best Sellers",
    desc: "Top picks",
    bg: "bg-background border-border hover:border-amber-300/60",
    href: "/products?feed_type=best_sellers",
    accentBar: "bg-amber-500",
    textColor: "text-foreground",
  },
];

const HeroMarketplace = ({ categories }: { categories: Category[] }) => {
  const slides = useMemo(
    () => [
      {
        id: "s1",
        badge: "Limited Time",
        title: "Up to 50% Off Electronics",
        subtitle: "Grab the latest gadgets at unbeatable prices.",
        cta1: { label: "Shop Electronics", href: "/products?category=electronics" },
        cta2: { label: "View Deals", href: "/products?feed_type=deals" },
        image: "https://picsum.photos/seed/hero-slide-1/1200/700",
        gradient: "from-primary to-primary/80",
      },
      {
        id: "s2",
        badge: "New Season",
        title: "Fresh Arrivals This Week",
        subtitle: "Discover new products curated just for you.",
        cta1: { label: "New Arrivals", href: "/products?feed_type=new_arrivals" },
        cta2: { label: "Best Sellers", href: "/products?feed_type=best_sellers" },
        image: "https://picsum.photos/seed/hero-slide-2/1200/700",
        gradient: "from-primary/90 to-secondary/60",
      },
      {
        id: "s3",
        badge: "Trending Now",
        title: "Top Customer Picks",
        subtitle: "Browse trending items and popular deals.",
        cta1: { label: "See Trending", href: "/products?feed_type=trending" },
        cta2: { label: "Shop All", href: "/products" },
        image: "https://picsum.photos/seed/hero-slide-3/1200/700",
        gradient: "from-secondary/80 to-primary/80",
      },
    ],
    []
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:h-[360px] xl:h-[380px] min-h-0">

        {/* Categories sidebar */}
        <CategorySidebar categories={categories} />

        {/* Hero carousel — takes 6 cols */}
        <HeroCarousel slides={slides} className="lg:col-span-6 h-full min-h-0" />

        {/* Promo stack — takes 3 cols */}
        <aside className="hidden lg:flex flex-col lg:col-span-3 gap-2.5 h-full min-h-0">
          {promos.map((p) => (
            <Link
              key={p.label}
              to={p.href}
              className={`flex-1 rounded-xl border ${p.bg} px-4 flex items-center gap-3 hover:shadow-sm transition-all group`}
            >
              <div className={`w-1 self-stretch rounded-full ${p.accentBar} my-3 flex-shrink-0`} />
              <div className="flex-1 min-w-0 py-3">
                <div className="text-sm font-semibold text-foreground leading-tight">{p.label}</div>
                <div className="text-xs text-foreground/45 mt-0.5">{p.desc}</div>
              </div>
              <svg
                className="w-4 h-4 text-foreground/20 group-hover:text-foreground/50 flex-shrink-0 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </aside>

      </div>
    </section>
  );
};

export default HeroMarketplace;