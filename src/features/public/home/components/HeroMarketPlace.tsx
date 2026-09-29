import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { DiscoveryFeedItem } from "@/core/api/services/discovery";
import HeroCarousel, { type HeroSlide } from "./HeroCarousel";
import { StorefrontImage } from "@/shared/components/StorefrontImage";
// Copy stays configured in the frontend; artwork follows the matching live collection.
export default function HeroMarketplace({ featured = [], arrivals = [], bestSellers = [], loading, sideLoading = loading }: { featured?: DiscoveryFeedItem[]; arrivals?: DiscoveryFeedItem[]; bestSellers?: DiscoveryFeedItem[]; loading?: boolean; sideLoading?: boolean }) {
  const campaigns = [
    { id: "featured", badge: "Discover Zentora", title: "More finds. More possibilities.", subtitle: "For your home, your work and everything in between.", tone: "sand", items: featured, label: "Explore our picks" },
    { id: "new_arrivals", badge: "New arrivals", title: "Fresh finds. Newly arrived.", subtitle: "Take a fresh look at what's just joined the store.", tone: "sky", items: arrivals, label: "Shop new arrivals" },
    { id: "best_sellers", badge: "Best sellers", title: "Top picks. Chosen by shoppers.", subtitle: "Explore the products our customers are choosing.", tone: "mint", items: bestSellers, label: "Shop best sellers" },
  ];
  const slides: HeroSlide[] = campaigns.filter(c => c.items.length).map(c => ({ ...c, image: c.items.find(p => p.primary_image)?.primary_image, alt: c.items.find(p => p.primary_image)?.name, primary: { label: c.label, href: "/collections/" + c.id } }));
  const side = [{ item: arrivals[1] || arrivals[0], label: "Just arrived" }, { item: bestSellers[1] || bestSellers[0], label: "Best sellers" }].filter(p => p.item);
  return <div className={"store-hero-grid " + (!side.length && !sideLoading ? "store-hero-solo" : "")}>
    <HeroCarousel slides={slides.length ? slides : [{ id: "browse", badge: "Welcome to Zentora", title: "More finds. More possibilities.", subtitle: "Discover products for your everyday life, all in one place.", primary: { label: "Explore the store", href: "/products" } }]} />
    {/* Render side cards together once loaded; inserting one before the other shifts the mobile rail. */}
    {!sideLoading && side.length > 0 ? <div className="store-hero-side">{side.map(({item: p, label}, i) => <Link key={label} to={"/products/" + p.slug} className={"store-mini-promo store-tone-" + (i ? "sky" : "rose")}><div><span className="store-eyebrow">{label}</span><h2>{p.name}</h2><span className="store-text-link">Take a look <ArrowRight size={15} /></span></div><StorefrontImage src={p.primary_image} alt={p.name} /></Link>)}</div> : sideLoading && <div className="store-hero-side" aria-label="Loading featured products" aria-busy="true"><div className="store-skeleton" /><div className="store-skeleton" /></div>}
  </div>;
}
