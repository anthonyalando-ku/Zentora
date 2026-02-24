import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { cn } from "@/shared/utils/cn";
import { mockProducts, mockCategories } from "@/shared/constants/mockProducts";
import { ProductCard } from "../components/ProductCard";
import type { ProductCategory } from "@/shared/types/product";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

const ITEMS_PER_PAGE = 8;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const categoryParam = searchParams.get("category") as ProductCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(categoryParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...mockProducts];
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.reverse();
        break;
    }
    return result;
  }, [selectedCategory, priceRange, minRating, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCategoryChange = (cat: ProductCategory | null) => {
    setSelectedCategory(cat);
    setPage(1);
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  return (
    <MainLayout>
      {/* Page header */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">Products</span>
          </nav>
          <h1 className="text-2xl font-bold text-foreground">All Products</h1>
          <p className="text-foreground/50 text-sm mt-1">{filtered.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              minRating={minRating}
              onRatingChange={setMinRating}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary/10 transition-colors"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 4a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1z" />
                </svg>
                Filters
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-foreground/50 hidden sm:block">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as SortOption); setPage(1); }}
                  className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden mb-6 p-4 border border-border rounded-2xl">
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  minRating={minRating}
                  onRatingChange={setMinRating}
                />
              </div>
            )}

            {/* Product Grid */}
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-foreground/50 text-sm mb-6">Try adjusting your filters</p>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
                  onClick={() => { setSelectedCategory(null); setPriceRange([0, 200000]); setMinRating(0); }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  className="p-2 rounded-lg border border-border hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                      page === i + 1
                        ? "bg-primary text-white"
                        : "border border-border hover:bg-secondary/10"
                    )}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="p-2 rounded-lg border border-border hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Filter Sidebar Component
type FilterSidebarProps = {
  selectedCategory: ProductCategory | null;
  onCategoryChange: (cat: ProductCategory | null) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
};

const FilterSidebar = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
}: FilterSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-2">
          <button
            className={cn(
              "w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
              !selectedCategory ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary/10 text-foreground/70"
            )}
            onClick={() => onCategoryChange(null)}
          >
            All Categories
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              className={cn(
                "w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
                selectedCategory === cat.slug ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary/10 text-foreground/70"
              )}
              onClick={() => onCategoryChange(cat.slug as ProductCategory)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-foreground/50">
            <span>KSh {priceRange[0].toLocaleString()}</span>
            <span>KSh {priceRange[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={0}
            max={200000}
            step={1000}
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-primary"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
              className="w-full text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Min"
            />
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
              className="w-full text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              className={cn(
                "w-full flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors",
                minRating === rating ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary/10 text-foreground/70"
              )}
              onClick={() => onRatingChange(rating)}
            >
              {rating === 0 ? (
                "Any Rating"
              ) : (
                <>
                  <span className="text-yellow-400">{"★".repeat(Math.floor(rating))}</span>
                  <span>& up</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
