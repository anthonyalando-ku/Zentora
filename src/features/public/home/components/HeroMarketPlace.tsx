import CategorySidebar from "./CategorySidebar";
import HeroCarousel, { type HeroSlide } from "./HeroCarousel";
import { Link } from "react-router-dom";
import { useMemo } from "react";

type Category = { id: string | number; name: string };

// ── Slides (unchanged) ────────────────────────────────────────────────────────
const SLIDES: HeroSlide[] = [
  {
    id: "electronics-sale",
    badge: "Limited Time",
    title: "Up to 40% Off Electronics",
    subtitle: "Tablets, power banks, smart devices — all at unbeatable prices.",
    cta1: { label: "Shop Electronics", href: "/products?category_id=1" },
    cta2: { label: "View All Deals",   href: "/products?feed_type=deals" },
    image: "https://ik.imagekit.io/anthonyalando/zentora/1777811160903854627_modio_e7SgN-nvr.webp",
    gradient: "from-sky-700 to-cyan-600",
  },
  {
    id: "mobile-devices",
    badge: "New Arrivals",
    title: "Latest Mobile Devices",
    subtitle: "Smartphones, tablets and accessories — fresh stock in this week.",
    cta1: { label: "Shop Mobiles",   href: "/products?category_id=28" },
    cta2: { label: "See What's New", href: "/products?feed_type=new_arrivals" },
    image: "https://ik.imagekit.io/anthonyalando/zentora/1777811160903854627_modio_e7SgN-nvr.webp",
    gradient: "from-violet-700 to-indigo-600",
  },
  {
    id: "car-accessories",
    badge: "Top Picks",
    title: "Accessories & Home Tools",
    subtitle: "Jump starters, compressors and must-have gear for every driver.",
    cta1: { label: "Shop Car Gear",  href: "/products?category_id=23" },
    cta2: { label: "Best Sellers",   href: "/products?feed_type=best_sellers" },
    image: "https://ik.imagekit.io/anthonyalando/zentora/1777401459718981424_car_jump_primary_Iu-MLWqVU.webp",
    gradient: "from-slate-700 to-zinc-600",
  },
  {
    id: "kitchen-home",
    badge: "Home & Kitchen",
    title: "Appliances for Every Home",
    subtitle: "Upgrade your kitchen and living space — quality at the right price.",
    cta1: { label: "Shop Kitchen",  href: "/products?category_id=12" },
    cta2: { label: "Home & Living", href: "/products?category_id=13" },
    image: "https://ik.imagekit.io/anthonyalando/zentora/1777811160903854627_modio_e7SgN-nvr.webp",
    gradient: "from-emerald-700 to-teal-600",
  },
];

// ── PromoStack ────────────────────────────────────────────────────────────────
//
// Three cards with deliberately different visual weights:
//
//   Card 1 — DEALS     ~50% height  gradient hero card with pulsing live dot
//   Card 2 — ARRIVALS  ~27% height  clean card with shimmer top border + icon
//   Card 3 — SELLERS   ~23% height  compact card with star icon
//
// Each has its own hover personality — not identical clones.

const ArrowIcon = () => (
  <svg
    className="w-3.5 h-3.5 shrink-0 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200"
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const PromoStack = () => (
  <aside
    className="hidden lg:flex flex-col lg:col-span-3 gap-2 h-full min-h-0"
    aria-label="Featured sections"
  >

    {/* ── Card 1: Daily Deals ────────────────────────────────────────────── */}
    {/* ~half the height, gradient fill, strong visual presence */}
    <Link
      to="/products?feed_type=deals"
      className="relative flex-[3] rounded-2xl overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      aria-label="Daily Deals"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-500 to-red-700 transition-all duration-500 group-hover:from-red-500 group-hover:to-rose-400" />

      {/* Diagonal stripe texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 1px,transparent 10px)",
        }}
        aria-hidden="true"
      />

      {/* Decorative circles top-right */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/[0.08] group-hover:scale-110 transition-transform duration-500 pointer-events-none" aria-hidden="true" />
      <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-white/[0.06] pointer-events-none" aria-hidden="true" />

      {/* Content — flex column that fills the card height exactly */}
      <div className="relative z-10 h-full flex flex-col justify-between p-3.5">
        {/* Top: badge + title + subtitle */}
        <div className="min-h-0">
          {/* Pulsing live indicator */}
          <span className="inline-flex items-center gap-1.5 mb-1.5">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-70" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-red-100/90">
              Live
            </span>
          </span>

          <h3 className="text-[1.25rem] font-extrabold text-white leading-[1.1] tracking-tight">
            Daily<br />Deals
          </h3>
          <p className="text-[10px] text-red-100/70 mt-1 leading-relaxed">
            New discounts every day
          </p>
        </div>

        {/* Bottom CTA — always anchored to the card floor */}
        <div className="flex items-center justify-between pt-1 shrink-0">
          <span className="text-[10px] font-semibold text-white/60 tracking-wide">
            Shop now
          </span>
          <div className="w-7 h-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center group-hover:bg-white/25 group-hover:scale-110 group-hover:border-white/30 transition-all duration-300">
            <svg className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>

    {/* ── Card 2: New Arrivals ───────────────────────────────────────────── */}
    {/* Medium weight — shimmer border on hover, green accent icon */}
    <Link
      to="/products?feed_type=new_arrivals"
      className="relative flex-[2] rounded-2xl overflow-hidden border border-border bg-background group hover:border-emerald-400/40 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
      aria-label="New Arrivals"
    >
      {/* Subtle green wash */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.04] transition-colors duration-300 pointer-events-none" />

      {/* Shimmer top line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 h-full flex items-center gap-3 px-4">
        {/* Icon */}
        <div className="shrink-0 w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center group-hover:bg-emerald-500/18 group-hover:scale-105 group-hover:border-emerald-400/30 transition-all duration-300">
          <svg className="w-[18px] h-[18px] text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
            New Arrivals
          </div>
          <div className="text-[11px] text-foreground/40 mt-0.5 truncate">
            Just landed this week
          </div>
        </div>

        <ArrowIcon />
      </div>
    </Link>

    {/* ── Card 3: Best Sellers ───────────────────────────────────────────── */}
    {/* Compact, amber star, minimal */}
    <Link
      to="/products?feed_type=best_sellers"
      className="relative flex-[2] rounded-2xl overflow-hidden border border-border bg-background group hover:border-amber-400/40 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      aria-label="Best Sellers"
    >
      <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/[0.04] transition-colors duration-300 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 h-full flex items-center gap-3 px-4">
        {/* Star icon */}
        <div className="shrink-0 w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center group-hover:bg-amber-500/18 group-hover:scale-105 group-hover:border-amber-400/30 transition-all duration-300">
          <svg className="w-[18px] h-[18px] text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
            Best Sellers
          </div>
          <div className="text-[11px] text-foreground/40 mt-0.5 truncate">
            Top customer picks
          </div>
        </div>

        <ArrowIcon />
      </div>
    </Link>

  </aside>
);

// ─────────────────────────────────────────────────────────────────────────────

const HeroMarketplace = ({ categories }: { categories: Category[] }) => {
  const slides = useMemo(() => SLIDES, []);

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3"
      aria-label="Featured promotions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:h-[360px] xl:h-[380px] min-h-0">
        <CategorySidebar categories={categories} />
        <HeroCarousel slides={slides} className="lg:col-span-6 h-full min-h-0" interval={6500} />
        <PromoStack />
      </div>
    </section>
  );
};

export default HeroMarketplace;