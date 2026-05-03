import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Skeleton } from "@/shared/components/ui";

type Category = {
  id: string | number;
  name: string;
  subcategories?: Array<{ id: string | number; name: string }>;
};

const categoryAccents: string[] = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-cyan-50 text-cyan-700 border-cyan-200",
];

const getCategoryAccent = (name: string) => {
  const idx =
    Math.abs(name.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
    categoryAccents.length;
  return categoryAccents[idx];
};

const CategoryMarketplaceSection = ({
  categories,
  isLoading,
}: {
  categories: Category[];
  isLoading?: boolean;
}) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const visibleCategories = useMemo(() => categories.slice(0, 12), [categories]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Shop by Category</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Browse all departments</p>
        </div>
        <Link
          to="/products"
          className="text-xs font-medium text-primary hover:text-primary/80 transition flex items-center gap-1"
        >
          View all
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {visibleCategories.map((category) => {
            const accent = getCategoryAccent(category.name);

            const words = category.name.split(" ").filter(Boolean);

            const firstInitial = words[0]?.charAt(0).toUpperCase();

            let secondInitial = "";
            for (let i = 1; i < words.length; i++) {
              const char = words[i].charAt(0);
              if (/^[A-Za-z0-9]$/.test(char)) {
                secondInitial = char.toUpperCase();
                break;
              }
            }

            const initials = secondInitial ? firstInitial + secondInitial : firstInitial;

            return (
              <div
                key={String(category.id)}
                className="relative"
                onMouseEnter={() => setActiveCategory(category)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  to={`/products?category_id=${category.id}`}
                  title={category.name}
                  className="flex flex-col items-center justify-center text-center gap-2.5 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-muted/30 hover:shadow-sm transition-all h-[88px] px-2"
                >
                  {/* Two-letter monogram */}
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold tracking-wide flex-shrink-0 ${accent}`}
                  >
                    {initials}
                  </div>
                  <span className="text-[11px] font-medium text-foreground/75 truncate w-full leading-none">
                    {category.name}
                  </span>
                </Link>

                {/* Subcategory dropdown */}
                {activeCategory?.id === category.id &&
                  category.subcategories &&
                  category.subcategories.length > 0 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[400px] bg-background border border-border rounded-xl shadow-xl p-4 z-50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
                          {category.name}
                        </h3>
                        <Link
                          to={`/products?category_id=${category.id}`}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          View all
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={String(sub.id)}
                            to={`/products?subcategory_id=${sub.id}`}
                            className="text-xs text-foreground/65 hover:text-primary truncate py-1 border-b border-border/50 last:border-0"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategoryMarketplaceSection;