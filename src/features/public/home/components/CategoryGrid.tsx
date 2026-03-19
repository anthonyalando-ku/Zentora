import { Link } from "react-router-dom";

const CategoryGrid = ({
  categories,
}: {
  categories: Array<{ id: string | number; name: string; image_url?: string | null }>;
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">Shop by Category</h2>
          <p className="text-sm text-foreground/60 mt-1">Browse popular departments</p>
        </div>
        <Link to="/products" className="text-sm font-medium text-primary hover:text-secondary transition-colors">
          View all
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(categories ?? []).map((category) => (
            <Link
              key={String(category.id)}
              to={`/products?category_id=${category.id}`}
              className="group rounded-2xl border border-border bg-background hover:shadow-md hover:-translate-y-1 transition-all p-4"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/5 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                  <img
                    src={category.image_url ?? "https://picsum.photos/seed/zentora-category/400/300"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="text-sm font-medium text-foreground line-clamp-2">{category.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};



export default CategoryGrid;