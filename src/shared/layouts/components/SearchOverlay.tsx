import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { useDebouncedValue } from "@/features/search/hooks/useDebouncedValue";
import { useSearchSuggestions } from "@/features/search/hooks/useSearchSuggestions";
import { useTrackSearchClick } from "@/features/search/hooks/useTrackSearchClick";
import { getDiscoverySessionId } from "@/features/search/utils/session";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  trendingTerms?: string[];
};

const DEFAULT_TRENDING = [
  "Air fryer",
  "Hoodies",
  "Smart watch",
  "Sneakers",
  "Cooking pots",
  "LED lights",
];

/**
 * Top-sheet search overlay (mobile-first, but usable at any width).
 * Triggered by the mobile header search icon and the bottom-nav Search tab.
 *
 *  • Slides down from the top of the viewport
 *  • Locks body scroll while open
 *  • Closes on backdrop click, Cancel button, or Escape
 *  • Reuses the same search-suggestions data source as HeaderSearch
 */
export const SearchOverlay = ({
  open,
  onClose,
  trendingTerms = DEFAULT_TRENDING,
}: SearchOverlayProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [value, setValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const debounced = useDebouncedValue(value, 300);
  const suggestionsQuery = useSearchSuggestions(debounced, 6);
  const suggestions = suggestionsQuery.data?.suggestions ?? [];

  const trackClick = useTrackSearchClick();
  const sessionId = useMemo(() => getDiscoverySessionId(), []);

  // Reset + focus on open; clear on close
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(id);
    } else {
      setValue("");
      setActiveIndex(-1);
    }
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const goToSearch = async (term: string, clickedPosition?: number) => {
    const q = term.trim();
    if (!q) return;
    if (typeof clickedPosition === "number") {
      try {
        await trackClick.mutateAsync({
          search_event_id: 0,
          product_id: 0,
          position: clickedPosition,
          session_id: sessionId,
        });
      } catch { /* ignore */ }
    }
    navigate({ pathname: "/products", search: `?${createSearchParams({ query: q }).toString()}` });
    onClose();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToSearch(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) {
      if (e.key === "Enter") { e.preventDefault(); goToSearch(value); }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      goToSearch(activeIndex >= 0 ? suggestions[activeIndex].Text : value, activeIndex >= 0 ? activeIndex + 1 : undefined);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] animate-in fade-in duration-150"
      />

      {/* Sheet */}
      <div
        className={cn(
          "absolute left-0 right-0 top-0 bg-background shadow-2xl",
          "rounded-b-2xl overflow-hidden",
          "animate-in slide-in-from-top-8 duration-200",
        )}
      >
        {/* Input row */}
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 px-3 sm:px-4 py-3 border-b border-border"
        >
          <svg className="h-5 w-5 text-foreground/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => { setValue(e.target.value); setActiveIndex(-1); }}
            onKeyDown={onKeyDown}
            placeholder="Search products, brands and more…"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[15px] text-foreground placeholder:text-foreground/40 py-1.5"
          />
          {value && (
            <button
              type="button"
              onClick={() => { setValue(""); inputRef.current?.focus(); }}
              aria-label="Clear search"
              className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-muted text-foreground/60 hover:bg-muted/70"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 text-[13px] font-semibold text-primary"
          >
            Cancel
          </button>
        </form>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto">
          {value.trim() === "" ? (
            <div className="px-4 py-4">
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-foreground/40 mb-2.5">
                Trending searches
              </div>
              <div className="flex flex-wrap gap-1.5">
                {trendingTerms.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => goToSearch(t)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-muted text-foreground/75 border border-border hover:bg-muted/70 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : suggestionsQuery.isLoading ? (
            <div className="px-4 py-6 text-xs text-foreground/50 text-center">Searching…</div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-6 text-xs text-foreground/50 text-center">
              No matches for “{value}”. Press Enter to search anyway.
            </div>
          ) : (
            <ul className="py-1">
              {suggestions.map((s, idx) => (
                <li key={`${s.Type}:${s.ReferenceID}:${s.Text}`}>
                  <button
                    type="button"
                    onClick={() => goToSearch(s.Text, idx + 1)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      idx === activeIndex ? "bg-muted/70" : "hover:bg-muted/50"
                    )}
                  >
                    <svg className="w-4 h-4 text-foreground/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="11" cy="11" r="7" />
                      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
                    </svg>
                    <span className="flex-1 truncate text-foreground">{s.Text}</span>
                    <span className="text-[10.5px] font-semibold tracking-wider uppercase text-foreground/40">
                      {s.Type}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
