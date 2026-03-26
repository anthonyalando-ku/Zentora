import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Skeleton } from "@/shared/components/ui";

type Category = {
  id: string | number;
  name: string;
  subcategories?: Array<{ id: string | number; name: string }>;
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

  const getCategoryColor = (name: string) => {
    const colors = [
      "bg-primary/10 text-primary",
      "bg-secondary/10 text-secondary",
      "bg-emerald-500/10 text-emerald-600",
      "bg-orange-500/10 text-orange-600",
      "bg-indigo-500/10 text-indigo-600",
      "bg-pink-500/10 text-pink-600",
    ];
    const idx = Math.abs(name.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % colors.length;
    return colors[idx];
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Shop by Category</h2>
          <p className="text-sm text-muted-foreground mt-1">Explore departments and discover products faster</p>
        </div>

        <Link to="/categories" className="text-sm font-medium text-primary hover:text-secondary transition">
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[104px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visibleCategories.map((category) => {
            const color = getCategoryColor(category.name);

            return (
              <div
                key={String(category.id)}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  to={`/products?category_id=${category.id}`}
                  className="block rounded-xl border border-border bg-background hover:shadow-md transition p-4"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold ${color}`}>
                      {category.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="text-sm font-medium line-clamp-2">{category.name}</span>

                    {category.subcategories && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {category.subcategories
                          .slice(0, 2)
                          .map((s) => s.name)
                          .join(" • ")}
                      </div>
                    )}
                  </div>
                </Link>

                {activeCategory?.id === category.id &&
                  category.subcategories &&
                  category.subcategories.length > 0 && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[520px] bg-background border border-border rounded-xl shadow-xl p-6 z-50"
                    >
                      <h3 className="font-semibold text-sm mb-4">{category.name} Categories</h3>

                      <div className="grid grid-cols-2 gap-3">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={String(sub.id)}
                            to={`/products?subcategory_id=${sub.id}`}
                            className="text-sm text-foreground/80 hover:text-primary hover:underline"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <Link to={`/products?category_id=${category.id}`} className="text-sm font-medium text-primary">
                          View all {category.name}
                        </Link>
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