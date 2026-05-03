import { Link } from "react-router-dom";

type Category = { id: string | number; name: string; slug?: string };

const CategorySidebar = ({ categories }: { categories: Category[] }) => {
  return (
    <aside className="hidden lg:flex lg:col-span-3 flex-col h-full min-h-0">
      <div className="h-full min-h-0 rounded-xl border border-border bg-background overflow-hidden flex flex-col">
        <div className="px-4 py-2.5 border-b border-border shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Categories</div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto py-1">
          {categories.map((c) => (
            <Link
              key={String(c.id)}
              to={`/products?category_id=${c.id}`}
              className="group flex items-center justify-between px-4 py-1.5 text-foreground/70 hover:bg-muted/50 hover:text-primary transition-colors"
            >
              <span className="text-xs truncate">{c.name}</span>
              <svg
                className="w-3 h-3 text-foreground/20 group-hover:text-primary/50 flex-shrink-0 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
          <Link
            to="/products"
            className="flex items-center justify-center gap-1 text-[11px] font-semibold text-primary/70 hover:text-primary py-2.5 border-t border-border mt-1 transition-colors"
          >
            View all categories
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebar;