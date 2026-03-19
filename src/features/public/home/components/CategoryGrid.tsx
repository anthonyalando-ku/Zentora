import { Link } from "react-router-dom";
import { useRef } from "react";

const CategoryGrid = ({
  categories,
}: {
  categories: Array<{ id: string | number; name: string; image_url?: string | null }>;
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const visibleCategories = (categories ?? []).slice(0, 20);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = 300;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
            Shop by Category
          </h2>
          <p className="text-sm text-foreground/60 mt-1">
            Browse popular departments
          </p>
        </div>

        <Link
          to="/categories"
          className="text-sm font-medium text-primary hover:text-secondary transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Wrapper (visually different from product cards) */}
      <div className="relative rounded-2xl border border-border bg-gradient-to-b from-secondary/5 to-background shadow-sm p-4 sm:p-6">

        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background border border-border shadow hover:bg-secondary/10 items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background border border-border shadow hover:bg-secondary/10 items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="
            flex gap-4 overflow-x-auto pb-3 px-6 sm:px-10
            scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent
          "
        >
          {visibleCategories.map((category) => (
            <Link
              key={String(category.id)}
              to={`/products?category_id=${category.id}`}
              className="group shrink-0 w-[90px] sm:w-[110px]"
            >
              <div className="flex flex-col items-center text-center gap-2">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/5 group-hover:bg-primary/10 transition flex items-center justify-center">
                  <img
                    src={
                      category.image_url ??
                      "https://picsum.photos/seed/zentora-category/200/200"
                    }
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <span className="text-xs sm:text-sm font-medium text-foreground line-clamp-2">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;