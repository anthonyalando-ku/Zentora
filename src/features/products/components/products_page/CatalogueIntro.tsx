import { Link } from "react-router-dom";
import { Truck, MessageCircle, ShoppingBag } from "lucide-react";
import { CategoryImage } from "@/features/catalog/CategoryImage";
import type { CatalogCategory } from "@/core/api/services/catalogProducts";

export function CatalogueIntro({ query, category }: { query?: string; category?: CatalogCategory }) {
  return <div className="catalogue-intro">
    <div className="catalogue-intro-copy">
      <span className="store-eyebrow">{query ? "Find your next favourite" : category ? "Explore the collection" : "Explore the Zentora store"}</span>
      <h1>{query ? `Results for “${query}”` : category?.name || "All Products"}</h1>
      <p>{query ? "Discover products that match what you're looking for." : "Everyday finds for your home, your work and your life. Explore something for every day."}</p>
    </div>
    {category && <div className="catalogue-intro-art"><CategoryImage src={category.image_url} alt={category.name} className="catalogue-intro-image" fallback={<ShoppingBag size={68} strokeWidth={1} aria-hidden="true"/>}/></div>}
    <div className="catalogue-intro-services"><Link to="/help"><Truck aria-hidden="true"/><span><strong>Delivery across Kenya</strong><small>Charges confirmed separately</small></span></Link><Link to="/contact"><MessageCircle aria-hidden="true"/><span><strong>Need a hand choosing?</strong><small>Talk to our team</small></span></Link></div>
  </div>;
}
