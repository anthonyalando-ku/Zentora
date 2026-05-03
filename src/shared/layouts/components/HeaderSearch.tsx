import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useDebouncedValue } from "@/features/search/hooks/useDebouncedValue";
import { useSearchSuggestions } from "@/features/search/hooks/useSearchSuggestions";
import { useTrackSearchClick } from "@/features/search/hooks/useTrackSearchClick";
import { getDiscoverySessionId } from "@/features/search/utils/session";

export const HeaderSearch = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const debounced = useDebouncedValue(value, 300);
  const suggestionsQuery = useSearchSuggestions(debounced, 5);
  const suggestions = suggestionsQuery.data?.suggestions ?? [];

  const trackClick = useTrackSearchClick();
  const sessionId = useMemo(() => getDiscoverySessionId(), []);

  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpen(value.trim().length > 0);
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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
    setOpen(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToSearch(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") { e.preventDefault(); goToSearch(value); }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") { e.preventDefault(); goToSearch(activeIndex >= 0 ? suggestions[activeIndex].Text : value); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form onSubmit={onSubmit} className="flex items-stretch h-9">

        {/* Search input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/35 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={value}
            onChange={(e) => { setValue(e.target.value); setActiveIndex(-1); }}
            onFocus={() => value.trim() && setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search products…"
            className="h-full w-full pl-9 pr-3 text-sm border border-border border-r-0 rounded-l-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition"
          />
        </div>

        {/* Submit button — attached, square right edge */}
        <button
          type="submit"
          className="h-full px-5 rounded-r-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors border border-primary shrink-0"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {/* Suggestions dropdown */}
      {open && value.trim() !== "" && (
        <div className="absolute mt-1 w-full rounded-xl border border-border bg-background shadow-xl overflow-hidden z-50">
          {suggestionsQuery.isLoading ? (
            <div className="px-4 py-3 text-xs text-foreground/50">Searching…</div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-foreground/50">No suggestions found</div>
          ) : (
            <ul className="max-h-64 overflow-auto py-1">
              {suggestions.map((s, idx) => (
                <li key={`${s.Type}:${s.ReferenceID}:${s.Text}`}>
                  <button
                    type="button"
                    className={`w-full text-left flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-muted/60 transition-colors ${idx === activeIndex ? "bg-muted/60" : ""}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => goToSearch(s.Text, idx + 1)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <svg className="w-3.5 h-3.5 text-foreground/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="font-medium truncate">{s.Text}</span>
                    </div>
                    <span className="text-[11px] text-foreground/40 flex-shrink-0 capitalize">{s.Type}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};