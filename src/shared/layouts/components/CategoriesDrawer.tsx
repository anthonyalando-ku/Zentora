import { useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

type CatalogCategoryLink = {
  id: string | number;
  slug?: string;
  name: string;
};

type CategoriesDrawerProps = {
  open: boolean;
  onClose: () => void;
  catalogCategories?: CatalogCategoryLink[];
};

/* -----------------------------
   Accent colors (deterministic)
------------------------------ */
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

/* -----------------------------
   Smart initials generator
------------------------------ */
const getInitials = (name: string) => {
  const words = name.split(" ").filter(Boolean);

  const first = words[0]?.charAt(0) ?? "";

  let second = "";

  for (let i = 1; i < words.length; i++) {
    const char = words[i].charAt(0);
    if (/^[A-Za-z0-9]$/.test(char)) {
      second = char;
      break;
    }
  }

  return (first + second).toUpperCase();
};

export const CategoriesDrawer = ({
  open,
  onClose,
  catalogCategories = [],
}: CategoriesDrawerProps) => {
  /* Lock scroll */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Escape close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[55]"
      role="dialog"
      aria-modal="true"
      aria-label="Categories"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close categories"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "absolute left-0 top-0 bottom-0",
          "w-[86%] max-w-[340px] bg-background shadow-2xl",
          "flex flex-col",
          "animate-in slide-in-from-left-12 duration-200"
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-widest text-foreground/40">
              Browse
            </div>
            <div className="text-[17px] font-bold text-foreground leading-tight">
              All Categories
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-muted text-foreground/70 hover:bg-muted/70"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-1">
          {catalogCategories.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-foreground/50">
              No categories available.
            </div>
          ) : (
            catalogCategories.map((c) => {
              const initials = getInitials(c.name);
              const accent = getCategoryAccent(c.name);

              return (
                <Link
                  key={String(c.id)}
                  to={`/products?category_id=${c.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 border-b border-border/40 hover:bg-muted/60 transition-colors"
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl border grid place-items-center",
                      "text-xs font-bold shadow-sm",
                      accent
                    )}
                  >
                    {initials}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {c.name}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-4 h-4 text-foreground/30 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6l6 6-6 6"
                    />
                  </svg>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3 flex-shrink-0">
          <Link
            to="/products"
            onClick={onClose}
            className="w-full h-10 inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground text-background text-[13px] font-semibold"
          >
            View all departments
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.4}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6l6 6-6 6"
              />
            </svg>
          </Link>
        </div>
      </aside>
    </div>
  );
};