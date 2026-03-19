import { Link } from "react-router-dom";

type Category = { id: string | number; name: string };

const CategorySidebar = ({ categories }: { categories: Category[] }) => {
  return (
    <aside className="hidden lg:block lg:col-span-3 h-full min-h-0">
      <div className="h-full min-h-0 rounded-2xl border border-border bg-background shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <div className="text-sm font-semibold text-foreground">Categories</div>
          <div className="text-xs text-foreground/60">Browse departments</div>
        </div>

        {/*  This is the scroll container */}
        <div className="flex-1 min-h-0 overflow-y-auto p-2 pr-1">
          {categories.map((c) => (
            <Link
              key={String(c.id)}
              to={`/products?category_id=${c.id}`}
              className="group flex items-center justify-between px-3 py-2 rounded-xl text-sm text-foreground/80 hover:bg-secondary/10 hover:text-primary transition"
            >
              <span className="line-clamp-1">{c.name}</span>
              <svg
                className="w-4 h-4 text-foreground/30 group-hover:text-primary"
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