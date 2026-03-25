import { Link } from "react-router-dom";
import { useState } from "react";

type Category = {
  id: string | number;
  name: string;
  subcategories?: { id: string | number; name: string }[];
};

const colorPalette = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-yellow-100 text-yellow-600",
  "bg-indigo-100 text-indigo-600",
  "bg-teal-100 text-teal-600",
];

const getCategoryColor = (name: string) => {
  const index = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

const CategoryMarketplaceSection = ({
  categories,
}: {
  categories: Category[];
}) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const visibleCategories = (categories ?? []).slice(0, 12);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">

      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Shop by Category
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Explore departments and discover products faster
          </p>
        </div>

        <Link
          to="/categories"
          className="text-sm font-medium text-primary hover:text-secondary transition"
        >
          View all
        </Link>
      </div>

      {/* Category Grid */}
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

              {/* Category Card */}
              <Link
                to={`/products?category_id=${category.id}`}
                className="block rounded-xl border border-border bg-background
                           hover:shadow-md transition p-4"
              >

                <div className="flex flex-col items-center text-center gap-3">

                  {/* Icon Avatar */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center
                    text-lg font-semibold ${color}`}
                  >
                    {category.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <span className="text-sm font-medium line-clamp-2">
                    {category.name}
                  </span>

                  {/* Subcategory preview */}
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

              {/* Mega Navigation Panel */}
              {activeCategory?.id === category.id &&
                category.subcategories &&
                category.subcategories.length > 0 && (

                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4
                             w-[520px] bg-background border border-border
                             rounded-xl shadow-xl p-6 z-50"
                >

                  <h3 className="font-semibold text-sm mb-4">
                    {category.name} Categories
                  </h3>

                  <div className="grid grid-cols-2 gap-3">

                    {category.subcategories.map((sub) => (
                      <Link
                        key={String(sub.id)}
                        to={`/products?subcategory_id=${sub.id}`}
                        className="text-sm text-foreground/80
                                   hover:text-primary hover:underline"
                      >
                        {sub.name}
                      </Link>
                    ))}

                  </div>

                  <div className="mt-4 pt-4 border-t border-border">

                    <Link
                      to={`/products?category_id=${category.id}`}
                      className="text-sm font-medium text-primary"
                    >
                      View all {category.name}
                    </Link>

                  </div>

                </div>
              )}

            </div>
          );
        })}

      </div>

    </section>
  );
};

export default CategoryMarketplaceSection;

