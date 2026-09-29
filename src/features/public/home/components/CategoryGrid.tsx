import { CategoryImage } from "@/features/catalog/CategoryImage";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { CatalogCategory } from "@/core/api/services/catalogProducts";
export function CategoryArtwork({ category }: { category: Pick<CatalogCategory, "name" | "image_url"> }) {
  const words = category.name.trim().split(/\s+/).filter(word => /^[A-Za-z0-9]/.test(word));
  const initials = words.slice(0, 2).map(word => word[0]).join("").toUpperCase();
  const tone = ["sky", "mint", "sand", "rose", "lilac"][Array.from(category.name).reduce((sum, c) => sum + c.charCodeAt(0), 0) % 5];
  return <CategoryImage src={category.image_url} alt={category.name} className="store-category-art" fallback={<div className={"store-category-art store-category-initials store-tone-" + tone}>{initials}</div>} />;
}
export default function CategoryGrid({ categories, isLoading, isError, onRetry }: { categories: CatalogCategory[]; isLoading?: boolean; isError?: boolean; onRetry?: () => void }) {
  return <section className="store-section" aria-labelledby="categories-heading"><div className="store-section-heading"><div><h2 id="categories-heading">Shop by category</h2><p>A world of finds, all in one place</p></div><Link to="/products">View all categories <ArrowRight size={16} /></Link></div>
    {isLoading ? <div className="store-category-grid" aria-label="Loading categories" aria-busy="true">{Array.from({ length: 10 }, (_, i) => <div key={i} className="store-skeleton h-36" />)}</div> : isError && !categories.length ? <div className="store-empty">Categories couldn't load. <button onClick={onRetry}>Try again</button></div> : !categories.length ? <div className="store-empty">Explore our latest products <Link to="/products">Browse the store →</Link></div> : <div className="store-category-grid">{categories.slice(0, 10).map(category => <Link key={category.id} to={"/products?category_id=" + category.id} className="store-category-card"><CategoryArtwork category={category} /><span>{category.name}</span></Link>)}</div>}
  </section>;
}
