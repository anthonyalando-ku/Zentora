import { Link } from "react-router-dom";
import { ArrowRight, Tags, Truck, MessageCircle } from "lucide-react";
import { useBrands } from "@/features/catalog/hooks/useBrands";
import { useQuery } from "@tanstack/react-query";
import { deliveryApi, deliveryPolicyKey } from "@/core/api/services/delivery";
import type { CatalogCategory } from "@/core/api/services/catalogProducts";
import type { DiscoveryFeedItem } from "@/core/api/services/discovery";
import { StorefrontImage } from "@/shared/components/StorefrontImage";
import { CategoryArtwork } from "./CategoryGrid";

export function Merchandising({ deals = [] }: { deals?: DiscoveryFeedItem[] }) {
  const brands = useBrands();
  const policy = useQuery({ queryKey: deliveryPolicyKey, queryFn: deliveryApi.get, staleTime: 60_000, retry: 1 });
  const deal = deals.find(p => Number(p.discount) > 0 && Number(p.discount) <= 100);
  const activeBrands = brands.data?.filter(b => b.is_active !== false).slice(0, 6) ?? [];
  return <div className="store-merch-grid">
    {deal && <section className="store-deal store-tone-rose"><div><h2><Tags size={21} />Deals worth a look</h2><p>Discover current offers</p><Link className="store-text-link" to="/collections/deals">View all deals <ArrowRight size={16} /></Link></div>
      <Link to={`/products/${deal.slug}`} className="store-deal-product"><StorefrontImage src={deal.primary_image} alt={deal.name} /><span>{deal.name}</span><strong>KSh {deal.price.toLocaleString()}</strong></Link></section>}
    {activeBrands.length > 0 && <section className="store-brands store-tone-sky"><h2>Explore brands</h2><p>Find a name you know</p><div>{activeBrands.map(brand => <Link key={brand.id} to={`/products?brand_id=${brand.id}`}>{brand.name}</Link>)}</div></section>}
    <section className="store-service-card store-tone-mint"><h2>Shopping, made personal.</h2><div><Truck size={21} /><p><strong>Delivery across Kenya</strong><span>{policy.data?.message || "Delivery charges are confirmed separately and excluded from the order total."}</span></p></div><a href="https://wa.me/254795974591" target="_blank" rel="noreferrer"><MessageCircle size={20} />Ask us on WhatsApp <ArrowRight size={15} /></a></section>
  </div>;
}

export function CategoryPromotions({ categories }: { categories: CatalogCategory[] }) {
  if (!categories.length) return null;
  // Prefer uploaded category artwork; keep the existing initials fallback otherwise.
  const picks = [...categories.filter(c => c.image_url), ...categories.filter(c => !c.image_url)].slice(0, 2);
  return <div className="store-category-promos" aria-label="Explore departments">{picks.map((category, i) => <Link key={category.id} to={`/products?category_id=${category.id}`} className={`store-category-promo store-tone-${i ? "sky" : "sand"}`}><div><span className="store-eyebrow">Explore the collection</span><h2>{category.name}</h2><span className="store-cta">Shop this category <ArrowRight size={16} /></span></div><CategoryArtwork category={category} /></Link>)}</div>;
}
