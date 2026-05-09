import { cn } from "@/shared/utils/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

type PaginationProps = {
  page: number;
  totalPages: number;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSetPage: (p: number) => void;
};

export const Pagination = ({
  page,
  totalPages,
  canNext,
  onPrev,
  onNext,
  onSetPage,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-5 border-t border-border">
      <button
        className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
        onClick={onPrev}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 text-center text-sm text-foreground/30">…</span>
        ) : (
          <button
            key={p}
            className={cn(
              "h-9 w-9 rounded-lg text-sm font-semibold transition-colors",
              page === p
                ? "bg-primary text-white shadow-sm"
                : "border border-border hover:bg-muted text-foreground/70 hover:text-foreground"
            )}
            onClick={() => onSetPage(p as number)}
            aria-current={page === p ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};