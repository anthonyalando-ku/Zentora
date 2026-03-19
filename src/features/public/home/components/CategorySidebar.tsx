import { Link } from "react-router-dom";

const CategorySidebar = ({ categories }: { categories: Array<{ id: string | number; name: string }>;}) => {
    return (
        <aside className="hidden lg:block lg:col-span-3">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <div className="text-sm font-semibold text-foreground">Categories</div>
              <div className="text-xs text-foreground/60 mt-0.5">Browse departments</div>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2 pr-1 scrollbar-thin">
              {categories.map((c) => (
                <Link
                  key={String(c.id)}
                  to={`/products?category_id=${c.id}`}
                  className="group flex items-center justify-between px-3 py-2 rounded-xl text-sm text-foreground/80 hover:bg-secondary/10 hover:text-primary transition-colors"
                >
                  <span className="line-clamp-1">{c.name}</span>
                  <svg
                    className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </aside>
    );
};

export default CategorySidebar;