import { SearchIcon } from "./icons";

export const ProductsGridSkeleton = ({ count = 20 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border bg-background overflow-hidden" aria-hidden="true">
        <div className="aspect-square bg-foreground/6 animate-pulse" />
        <div className="p-3 space-y-2">
          <div className="h-3 w-4/5 bg-foreground/8 rounded animate-pulse" style={{ animationDelay: `${i * 30}ms` }} />
          <div className="h-3 w-2/3 bg-foreground/8 rounded animate-pulse" style={{ animationDelay: `${i * 30 + 80}ms` }} />
          <div className="h-4 w-1/2 bg-foreground/10 rounded animate-pulse" style={{ animationDelay: `${i * 30 + 160}ms` }} />
        </div>
      </div>
    ))}
  </div>
);

/** Smaller inline skeleton for the catalog blend section below a feed */
export const InlineCatalogSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border bg-background overflow-hidden" aria-hidden="true">
        <div className="aspect-square bg-foreground/6 animate-pulse" style={{ animationDelay: `${i * 40}ms` }} />
        <div className="p-3 space-y-2">
          <div className="h-3 w-4/5 bg-foreground/8 rounded animate-pulse" style={{ animationDelay: `${i * 40 + 60}ms` }} />
          <div className="h-3 w-2/3 bg-foreground/8 rounded animate-pulse" style={{ animationDelay: `${i * 40 + 120}ms` }} />
          <div className="h-4 w-1/2 bg-foreground/10 rounded animate-pulse" style={{ animationDelay: `${i * 40 + 180}ms` }} />
        </div>
      </div>
    ))}
  </div>
);

export const EmptyState = ({
  isSearchMode,
  onClearFilters,
  feedLabel,
}: {
  isSearchMode: boolean;
  onClearFilters: () => void;
  /** When set, shows a feed-specific fallback message */
  feedLabel?: string;
}) => {
  const isFeedFallback = Boolean(feedLabel);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-foreground/30">
        {isFeedFallback ? (
          // Compass / explore icon
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0v2m0 16v2M2 12h2m16 0h2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5l-3 3-3 3 3-3 3-3z" />
          </svg>
        ) : (
          <SearchIcon />
        )}
      </div>

      {isFeedFallback ? (
        <>
          <h3 className="text-base font-semibold text-foreground mb-1">
            No {feedLabel} right now
          </h3>
          <p className="text-sm text-foreground/50 max-w-xs mb-5">
            Nothing to show in this section at the moment — browse our full catalog instead.
          </p>
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 rounded-xl px-4 py-2 hover:bg-primary/5 transition-colors"
          >
            Explore all products →
          </button>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-foreground mb-1">No products found</h3>
          <p className="text-sm text-foreground/50 max-w-xs mb-5">
            {isSearchMode
              ? "Try a different search term or browse all products."
              : "Try removing some filters to see more results."}
          </p>
          {!isSearchMode && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary border border-primary/30 rounded-xl px-4 py-2 hover:bg-primary/5 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </>
      )}
    </div>
  );
};