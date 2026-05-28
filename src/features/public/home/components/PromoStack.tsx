import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

// ─────────────────────────────────────────────────────────────────────────────
// PromoStack — repurposed as an editorial promo BANNER ROW.
//
// Previously this was a small icon+text stack column inside the hero. The new
// homepage shows it as a row of full-image cards directly below the hero:
//   • 1 col on mobile
//   • 2 cols on tablet
//   • 4 cols on desktop
//
// The cards are image-led — drop in your campaign creatives (one PNG/JPG per
// card, ideally portrait 4:5) and the card chrome stays out of the way.
// Optional `title` / `subtitle` overlay if you want text rendered by the app
// instead of being baked into the image.
// ─────────────────────────────────────────────────────────────────────────────

export type PromoBanner = {
  id: string;
  /** Full-bleed creative for the card. Ideally portrait (4:5) and ≥800px wide. */
  image: string;
  alt: string;
  href: string;
  /** Optional overlay title (rendered when image has no baked-in text). */
  title?: string;
  /** Optional overlay subtitle. */
  subtitle?: string;
  /** Optional fallback background tint shown while the image loads. */
  fallbackBg?: string;
};

const DEFAULT_BANNERS: PromoBanner[] = [
  {
    id: "mega-sale",
    image: "https://picsum.photos/seed/zentora-mega-sale/800/1000",
    alt: "Mega sale — up to 50% off",
    href: "/products?feed_type=deals",
    title: "Mega Sale",
    subtitle: "Up to 50% off",
    fallbackBg: "#bfe16f",
  },
  {
    id: "free-delivery",
    image: "https://picsum.photos/seed/zentora-delivery/800/1000",
    alt: "Free delivery on orders over KSh 10,000",
    href: "/info/delivery",
    title: "Free Delivery",
    subtitle: "Orders over KSh 10,000",
    fallbackBg: "#9bd1f0",
  },
  {
    id: "seasonal",
    image: "https://picsum.photos/seed/zentora-seasonal/800/1000",
    alt: "Seasonal collection",
    href: "/products?feed_type=featured",
    title: "Seasonal Picks",
    subtitle: "Up to 30% off",
    fallbackBg: "#2f5d3a",
  },
  {
    id: "fresh-start",
    image: "https://picsum.photos/seed/zentora-fresh-start/800/1000",
    alt: "Fresh start sale",
    href: "/products?feed_type=new_arrivals",
    title: "Fresh Start",
    subtitle: "New arrivals weekly",
    fallbackBg: "#e8e2cd",
  },
];

type PromoStackProps = {
  banners?: PromoBanner[];
  /** Render overlay text even if the image already has baked-in copy. Default: false. */
  showOverlayText?: boolean;
  className?: string;
};

const PromoStack = ({
  banners = DEFAULT_BANNERS,
  showOverlayText = false,
  className,
}: PromoStackProps) => {
  if (!banners || banners.length === 0) return null;

  return (
    <section
      className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 md:pt-5",
        className
      )}
      aria-label="Promotions"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {banners.map((b) => (
          <PromoCard key={b.id} banner={b} showOverlayText={showOverlayText} />
        ))}
      </div>
    </section>
  );
};

const PromoCard = ({
  banner,
  showOverlayText,
}: {
  banner: PromoBanner;
  showOverlayText: boolean;
}) => {
  return (
    <Link
      to={banner.href}
      aria-label={banner.alt}
      className="group relative block overflow-hidden rounded-2xl aspect-[4/5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{ backgroundColor: banner.fallbackBg ?? "#eee" }}
    >
      <img
        src={banner.image}
        alt={banner.alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      {/* Soft top→bottom gradient for legibility when overlay text is on */}
      {showOverlayText && (banner.title || banner.subtitle) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
      )}

      {/* Optional overlay copy */}
      {showOverlayText && (banner.title || banner.subtitle) && (
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          {banner.subtitle && (
            <div className="text-[10.5px] font-bold uppercase tracking-[0.15em] opacity-90 mb-1">
              {banner.subtitle}
            </div>
          )}
          {banner.title && (
            <div className="text-lg font-extrabold leading-tight tracking-tight">
              {banner.title}
            </div>
          )}
        </div>
      )}

      {/* Subtle border on hover so the card lifts visually */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 group-hover:ring-black/15 transition-colors pointer-events-none" />
    </Link>
  );
};

export default PromoStack;
