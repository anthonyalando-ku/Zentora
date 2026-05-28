import HeroCarousel, { type HeroSlide } from "./HeroCarousel";

// ─────────────────────────────────────────────────────────────────────────────
// Slide deck. Swap copy / images / tones freely without touching the carousel.
// Image guidance: 1600×900 minimum, products on a light or transparent
// background. The pastel tone is rendered behind the image so a transparent
// PNG / WEBP gives the best edge blend.
// ─────────────────────────────────────────────────────────────────────────────
const SLIDES: HeroSlide[] = [
  {
    id: "new-arrivals",
    badge: "New Arrivals",
    title: "Fresh for a Smarter Home",
    subtitle: "Thoughtful picks that just landed — appliances, organisers and everyday essentials.",
    image: "https://ik.imagekit.io/anthonyalando/zentora/1779699654949217736_Heavy_Duty_Adjustable_Fridge___Washing_Machine_Stand_Base__3__YICZ1Xrbt.webp?updatedAt=1779699655532",
    tone: "mint",
    primary:   { label: "Shop now",      href: "/products?feed_type=new_arrivals" },
    secondary: { label: "Explore deals", href: "/products?feed_type=deals" },
  },
  {
    id: "electronics-sale",
    badge: "Limited time",
    title: "Up to 40% off Electronics",
    subtitle: "Tablets, power banks and smart devices — unbeatable prices this week.",
    image: "https://ik.imagekit.io/anthonyalando/zentora/1779697820394930023_Modio_M75_Kids_Tablet_7_Inch_WiFi_Edition_U7-pmRZ-S.webp?updatedAt=1779697820965",
    tone: "sky",
    primary:   { label: "Shop electronics", href: "/products?category_id=1" },
    secondary: { label: "View all deals",   href: "/products?feed_type=deals" },
  },
  {
    id: "kitchen-home",
    badge: "Home & Kitchen",
    title: "Appliances for Every Home",
    subtitle: "Upgrade your kitchen and living space — quality at the right price.",
    image: "https://ik.imagekit.io/anthonyalando/zentora/1779699253944920236_Signature_SG-HS360D_Commercial_Blender_1800W___5L_Jar_LczYDG5VW.webp?updatedAt=1779699254572",
    tone: "peach",
    primary:   { label: "Shop kitchen",  href: "/products?category_id=12" },
    secondary: { label: "Home & living", href: "/products?category_id=13" },
  },
  {
    id: "car-accessories",
    badge: "Top picks",
    title: "Accessories & Tools",
    subtitle: "Jump starters, compressors and must-have gear for every driver.",
    image: "https://ik.imagekit.io/anthonyalando/zentora/1778499696260723538_jump-starter-type-2-4_oICndqL8j.webp?updatedAt=1778499696849",
    tone: "sand",
    primary:   { label: "Shop car gear", href: "/products?category_id=23" },
    secondary: { label: "Best sellers",  href: "/products?feed_type=best_sellers" },
  },
];

/**
 * Slimmed-down hero. Previously this wrapped a 3-column grid
 * (CategorySidebar · HeroCarousel · PromoStack). Categories now live in the
 * mobile drawer / desktop "All Categories" pill, and the editorial promo
 * cards have been promoted to their own top-level section below the hero.
 */
const HeroMarketplace = () => {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6"
      aria-label="Featured"
    >
      <HeroCarousel slides={SLIDES} interval={6500} />
    </section>
  );
};

export default HeroMarketplace;
