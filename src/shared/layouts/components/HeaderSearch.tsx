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
    const trimmed = value.trim();
    setOpen(trimmed.length > 0);
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
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
      } catch {
        // ignore
      }
    }

    navigate({
      pathname: "/products",
      search: `?${createSearchParams({ query: q }).toString()}`,
    });

    setOpen(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToSearch(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        goToSearch(value);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = activeIndex >= 0 ? suggestions[activeIndex] : undefined;
      if (picked) goToSearch(picked.Text);
      else goToSearch(value);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full max-w-2xl">
      <form onSubmit={onSubmit} className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => value.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search products…"
          className="w-full rounded-full border border-border bg-secondary/10 px-12 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-10 px-4 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {open && value.trim() !== "" && (
        <div className="absolute mt-2 w-full rounded-2xl border border-border bg-background shadow-xl overflow-hidden z-50">
          {suggestionsQuery.isLoading ? (
            <div className="p-4 text-sm text-foreground/60">Searching…</div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-sm text-foreground/60">No suggestions</div>
          ) : (
            <ul className="max-h-72 overflow-auto p-2">
              {suggestions.map((s, idx) => (
                <li key={`${s.Type}:${s.ReferenceID}:${s.Text}`}>
                  <button
                    type="button"
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm hover:bg-secondary/10 ${
                      idx === activeIndex ? "bg-secondary/10" : ""
                    }`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => goToSearch(s.Text, idx + 1)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{s.Text}</span>
                      <span className="text-xs text-foreground/50">{s.Type}</span>
                    </div>
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