import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";

export type ComboboxOption = {
  value: string | number;
  label: string;
  meta?: string;
};

export const Combobox = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  isLoading,
  disabled,
  emptyText = "No results.",
  createLabel,
  onCreate,
  error,
  required,
}: {
  label: string;
  placeholder?: string;
  value: string | number | null;
  onChange: (v: string | number | null) => void;
  options: ComboboxOption[];
  isLoading?: boolean;
  disabled?: boolean;
  emptyText?: string;
  createLabel?: (q: string) => string;
  onCreate?: (q: string) => void | Promise<void>;
  error?: string;
  required?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selected = useMemo(() => options.find((o) => String(o.value) === String(value)) ?? null, [options, value]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((o) => o.label.toLowerCase().includes(s) || (o.meta ?? "").toLowerCase().includes(s));
  }, [options, q]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
  }, [open, q]);

  const select = (opt: ComboboxOption) => {
    onChange(opt.value);
    setOpen(false);
    setQ("");
  };

  return (
    <div ref={rootRef} className="w-full">
      <div className="flex items-end justify-between gap-3">
        <label className="text-xs font-medium text-foreground/60">
          {label} {required ? "*" : ""}
        </label>

        {selected ? (
          <button
            type="button"
            className="text-xs font-semibold text-foreground/50 hover:text-foreground"
            onClick={() => onChange(null)}
            disabled={disabled}
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className={cn("relative mt-1", disabled && "opacity-70 pointer-events-none")}>
        <button
          type="button"
          className={cn(
            "w-full h-11 rounded-xl border bg-background px-3 text-sm flex items-center justify-between gap-3",
            error ? "border-destructive/50" : "border-border",
            "focus:outline-none focus:ring-2 focus:ring-primary/20"
          )}
          onClick={() => {
            setOpen((v) => !v);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          aria-expanded={open}
        >
          <span className={cn("truncate", selected ? "text-foreground" : "text-foreground/50")}>
            {selected?.label ?? placeholder ?? "Select…"}
          </span>
          <svg className="w-4 h-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-50 left-0 right-0 mt-2 rounded-2xl border border-border bg-background shadow-xl overflow-hidden">
            <div className="p-3 border-b border-border">
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type to search…"
                className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={async (e) => {
                  if (e.key === "Escape") setOpen(false);
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((i) => Math.max(0, i - 1));
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const opt = filtered[activeIndex];
                    if (opt) select(opt);
                    else if (onCreate && q.trim()) await onCreate(q.trim());
                  }
                }}
              />
              {isLoading && <div className="mt-2 text-xs text-foreground/50">Loading…</div>}
            </div>

            <div className="max-h-72 overflow-auto p-2">
              {filtered.length === 0 ? (
                <div className="p-3 text-sm text-foreground/60">
                  {emptyText}
                  {onCreate && q.trim() ? (
                    <div className="mt-3">
                      <button
                        type="button"
                        className="h-9 px-3 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90"
                        onClick={() => onCreate(q.trim())}
                      >
                        {createLabel ? createLabel(q.trim()) : `Create "${q.trim()}"`}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((opt, idx) => (
                    <button
                      key={`${String(opt.value)}::${opt.label}`}
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => select(opt)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-xl border transition",
                        idx === activeIndex ? "border-primary/30 bg-primary/10" : "border-transparent hover:bg-secondary/10"
                      )}
                    >
                      <div className="text-sm font-medium text-foreground">{opt.label}</div>
                      {opt.meta ? <div className="text-xs text-foreground/50 mt-0.5">{opt.meta}</div> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {onCreate && filtered.length > 0 && q.trim() ? (
              <div className="p-3 border-t border-border bg-secondary/5 flex items-center justify-between gap-3">
                <div className="text-xs text-foreground/50 truncate">Can’t find it?</div>
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 text-xs font-semibold"
                  onClick={() => onCreate(q.trim())}
                >
                  {createLabel ? createLabel(q.trim()) : `Create "${q.trim()}"`}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
};