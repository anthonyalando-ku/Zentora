import { Link } from "react-router-dom";
import { ArrowRight, Flame, Sparkles, TrendingUp } from "lucide-react";
import { feedTitle } from "../utils/constants";
import { mapDiscoveryItemToProduct } from "../utils/mapDiscoveryItem";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { DiscoveryFeedType, DiscoveryFeedItem } from "@/core/api/services/discovery";
export default function FeedSection({ feedType, items = [], isLoading, isError, onRetry, spotlight = false }: { feedType: DiscoveryFeedType; items?: DiscoveryFeedItem[]; isLoading?: boolean; isError?: boolean; onRetry?: () => void; spotlight?: boolean }) {
  if (!isLoading && !isError && !items.length) return null;
  const Icon = feedType === "trending" ? Flame : feedType === "best_sellers" ? TrendingUp : Sparkles;
  return <section className={"store-section " + (spotlight ? "store-spotlight" : "")} aria-labelledby={"feed-" + feedType}><div className="store-section-heading"><div><h2 id={"feed-" + feedType}><Icon size={23} aria-hidden="true" />{feedTitle[feedType]}</h2>{spotlight && <p>Explore the customer favourites</p>}</div><Link to={"/collections/" + feedType}>See all <ArrowRight size={16} /></Link></div>
    {isLoading ? <div className="store-product-grid" aria-busy="true" aria-label={"Loading " + feedTitle[feedType]}>{Array.from({ length: 6 }, (_, i) => <div className="store-skeleton h-72" key={i} />)}</div> : isError && !items.length ? <div className="store-empty">We couldn't load these products. <button onClick={onRetry}>Try again</button></div> : <div className="store-product-grid">{items.slice(0, 6).map(item => <ProductCard key={item.product_id} hideAddToCart variant="storefront" product={mapDiscoveryItemToProduct(item)} />)}</div>}
  </section>;
}
