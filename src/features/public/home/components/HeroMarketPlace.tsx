import HeroCarousel, { type HeroSlide } from "./HeroCarousel";

// ─────────────────────────────────────────────────────────────────────────────
// Slide deck — all titles ~4 words, subtitles ~8–10 words for visual
// consistency across slides at every breakpoint.
// ─────────────────────────────────────────────────────────────────────────────
const SLIDES: HeroSlide[] = [
  {
    id: "new-arrivals",
    badge: "New Arrivals",
    title: "Fresh Picks Just Landed",
    subtitle: "Appliances, organisers & everyday essentials — just in.",
    image: "https://ik.imagekit.io/anthonyalando/zentora/1779699654949217736_Heavy_Duty_Adjustable_Fridge___Washing_Machine_Stand_Base__3__YICZ1Xrbt.webp?updatedAt=1779699655532",
    tone: "mint",
    primary:   { label: "Shop now",      href: "/products?feed_type=new_arrivals" },
    secondary: { label: "Explore deals", href: "/products?feed_type=deals" },
  },
  {
    id: "electronics-sale",
    badge: "Limited Time",
    title: "Up to 40% Off Electronics",
    subtitle: "Tablets, power banks & smart devices at great prices.",
    image: "https://ik.imagekit.io/anthonyalando/zentora/1779697820394930023_Modio_M75_Kids_Tablet_7_Inch_WiFi_Edition_U7-pmRZ-S.webp?updatedAt=1779697820965",
    tone: "sky",
    primary:   { label: "Shop electronics", href: "/products?category_id=1" },
    secondary: { label: "All deals",        href: "/products?feed_type=deals" },
  },
  {
    id: "kitchen-home",
    badge: "Home & Kitchen",
    title: "Appliances for Every Home",
    subtitle: "Upgrade your kitchen & living space affordably.",
    image: "https://ik.imagekit.io/anthonyalando/zentora/1779699253944920236_Signature_SG-HS360D_Commercial_Blender_1800W___5L_Jar_LczYDG5VW.webp?updatedAt=1779699254572",
    tone: "peach",
    primary:   { label: "Shop kitchen",  href: "/products?category_id=12" },
    secondary: { label: "Home & living", href: "/products?category_id=13" },
  },
  {
    id: "car-accessories",
    badge: "Top Picks",
    title: "Car Accessories & Tools",
    subtitle: "Jump starters, compressors & must-have driver gear.",
    image: "https://ik.imagekit.io/anthonyalando/zentora/1778499696260723538_jump-starter-type-2-4_oICndqL8j.webp?updatedAt=1778499696849",
    tone: "sand",
    primary:   { label: "Shop car gear",  href: "/products?category_id=23" },
    secondary: { label: "Best sellers",   href: "/products?feed_type=best_sellers" },
  },
];

const HeroMarketplace = () => {
  return (
    <section
      className="max-w-7xl mx-auto w-full overflow-hidden px-4 sm:px-6 lg:px-8 pt-4 md:pt-6"
      aria-label="Featured"
    >
      <HeroCarousel slides={SLIDES} interval={6500} />
    </section>
  );
};

export default HeroMarketplace;