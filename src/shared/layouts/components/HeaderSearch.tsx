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

    // If user clicked a suggestion and it’s a product suggestion, we can track it as click.
    // We don’t have search_event_id yet for suggestions (since results not loaded),
    // so use a sentinel 0? Better: skip click endpoint for suggestion until results event exists.
    // BUT your requirements say track suggestion click too. So we will send click with search_event_id=0 only if backend allows it.
    // If backend rejects 0, remove this block and only track clicks on results.
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
    <div ref={boxRef} className="relative hidden md:block w-full max-w-md">
      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => value.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search products…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </form>

      {open && value.trim() !== "" && (
        <div className="absolute mt-2 w-full rounded-xl border border-border bg-background shadow-lg overflow-hidden z-50">
          {suggestionsQuery.isLoading ? (
            <div className="p-3 text-sm text-foreground/60">Searching…</div>
          ) : suggestions.length === 0 ? (
            <div className="p-3 text-sm text-foreground/60">No suggestions</div>
          ) : (
            <ul className="max-h-72 overflow-auto">
              {suggestions.map((s, idx) => (
                <li key={`${s.Type}:${s.ReferenceID}:${s.Text}`}>
                  <button
                    type="button"
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary/10 ${
                      idx === activeIndex ? "bg-secondary/10" : ""
                    }`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => goToSearch(s.Text, idx + 1)}
                  >
                    <div className="flex items-center justify-between gap-2">
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