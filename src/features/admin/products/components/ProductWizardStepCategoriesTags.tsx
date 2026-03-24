import { useMemo, useState } from "react";
import { useCategories } from "@/features/admin/catalog/categories/hooks/useCategories";
import { cn } from "@/shared/utils/cn";

export const ProductWizardStepCategoriesTags = ({
  defaultCategoryIds,
  defaultTags,
  onBack,
  onNext,
}: {
  defaultCategoryIds: number[];
  defaultTags: string[];
  onBack: () => void;
  onNext: (v: { category_ids: number[]; tag_names: string[] }) => void;
}) => {
  const categoriesQuery = useCategories();
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>(defaultCategoryIds);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c: any) => String(c.name).toLowerCase().includes(q) || String(c.id).includes(q));
  }, [categories, search]);

  const toggle = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    setTags((prev) => {
      const exists = prev.some((x) => x.toLowerCase() === t.toLowerCase());
      if (exists) return prev;
      return [...prev, t];
    });
    setTagInput("");
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const next = () => {
    if (selected.length === 0) {
      setError("Select at least one category.");
      return;
    }
    setError(null);
    onNext({ category_ids: selected, tag_names: tags });
  };

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Categories & Tags</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Categories are required. Tags are optional (created automatically by the backend).
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="rounded-2xl border border-border p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Categories *</div>
              <div className="text-xs text-foreground/50 mt-0.5">Select one or more</div>
            </div>
            <div className="text-xs text-foreground/50">{selected.length} selected</div>
          </div>

          <div className="mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mt-3 max-h-72 overflow-auto pr-1">
            {categoriesQuery.isLoading ? (
              <div className="p-3 text-sm text-foreground/60">Loading categories…</div>
            ) : filtered.length === 0 ? (
              <div className="p-3 text-sm text-foreground/60">No categories found.</div>
            ) : (
              <div className="space-y-1">
                {filtered.map((c: any) => {
                  const checked = selected.includes(Number(c.id));
                  return (
                    <button
                      key={String(c.id)}
                      type="button"
                      onClick={() => toggle(Number(c.id))}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl border transition text-sm",
                        checked ? "border-primary/30 bg-primary/10" : "border-border hover:bg-secondary/10"
                      )}
                    >
                      <span className="font-medium text-foreground line-clamp-1">{c.name}</span>
                      <span className={cn("text-xs", checked ? "text-primary font-semibold" : "text-foreground/50")}>
                        #{c.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="rounded-2xl border border-border p-4">
          <div>
            <div className="text-sm font-semibold">Tags</div>
            <div className="text-xs text-foreground/50 mt-0.5">Press Enter to add</div>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="e.g. best seller"
              className="flex-1 h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={addTag}
              className="h-10 px-4 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-medium"
            >
              Add
            </button>
          </div>

          {tags.length === 0 ? (
            <div className="mt-4 text-sm text-foreground/60">No tags yet.</div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/5 px-3 py-1 text-xs">
                  <span className="font-medium">{t}</span>
                  <button
                    type="button"
                    className="w-5 h-5 rounded-full hover:bg-secondary/10"
                    aria-label="Remove tag"
                    onClick={() => removeTag(t)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="h-11 px-6 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-medium"
        >
          Back
        </button>

        <button
          type="button"
          onClick={next}
          className="h-11 px-6 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};