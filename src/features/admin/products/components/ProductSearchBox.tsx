import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { useProductSuggestions } from "@/features/admin/products/hooks/useProductSuggestions";

export const ProductSearchBox = ({
  value,
  onChange,
  placeholder = "Search products by name or code…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement | null>(null);

  const suggestionsQuery = useProductSuggestions(value);
  const suggestions = suggestionsQuery.data?.suggestions ?? [];

  const grouped = useMemo(() => {
    const out = {
      product: [] as typeof suggestions,
      category: [] as typeof suggestions,
      brand: [] as typeof suggestions,
      query: [] as typeof suggestions,
    };
    for (const s of suggestions) out[s.Type].push(s);
    return out;
  }, [suggestions]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const t = value.trim();
    setOpen(t.length > 0);
    setActiveIndex(-1);
  }, [value]);

  const pick = (text: string) => {
    onChange(text);
    setOpen(false);
  };

  const flat = suggestions;

  return (
    <div ref={ref} className="relative">
      <label className="text-xs font-medium text-foreground/60">Search</label>
      <div className="mt-1 relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.trim() && setOpen(true)}
          onKeyDown={(e) => {
            if (!open || flat.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, -1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              const s = activeIndex >= 0 ? flat[activeIndex] : null;
              if (s) pick(s.Text);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          className="w-full h-11 rounded-xl border border-border bg-background pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-background shadow-xl overflow-hidden">
          {suggestionsQuery.isLoading ? (
            <div className="p-4 text-sm text-foreground/60">Searching…</div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-sm text-foreground/60">No suggestions</div>
          ) : (
            <div className="max-h-80 overflow-auto p-2">
              {(["product", "category", "brand", "query"] as const).map((k) => {
                const list = grouped[k];
                if (!list || list.length === 0) return null;
                return (
                  <div key={k} className="mb-2 last:mb-0">
                    <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-foreground/50">
                      {k}
                    </div>
                    {list.map((s) => {
                      const idx = flat.findIndex((x) => x === s);
                      return (
                        <button
                          key={`${s.Type}:${s.ReferenceID}:${s.Text}`}
                          type="button"
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-secondary/10 transition",
                            idx === activeIndex && "bg-secondary/10"
                          )}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => pick(s.Text)}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">{s.Text}</span>
                            <span className="text-xs text-foreground/50">{s.Type}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};