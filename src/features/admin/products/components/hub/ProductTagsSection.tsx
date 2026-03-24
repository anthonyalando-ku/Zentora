import { useState } from "react";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
import { useProductTags, useRemoveProductTag, useSetProductTags } from "@/features/admin/products/hooks/useAdminProductHub";

export const ProductTagsSection = ({ productId, slug }: { productId: number; slug: string }) => {
  const tagsQuery = useProductTags(productId);
  const rmTag = useRemoveProductTag(slug, productId);
  const setTags = useSetProductTags(slug, productId);

  const [open, setOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tagNames, setTagNames] = useState<string[]>([]);

  const tags = tagsQuery.data ?? [];

  const openModal = () => {
    setTagNames(tags.map((t) => t.name));
    setTagInput("");
    setOpen(true);
  };

  return (
    <ProductHubSection
      title="Tags"
      description="Tags are freeform labels (replace-all supported)."
      action={
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
        >
          Manage
        </button>
      }
    >
      {tagsQuery.isLoading ? (
        <div className="text-sm text-foreground/60">Loading tags…</div>
      ) : tagsQuery.isError ? (
        <div className="text-sm text-destructive">Failed to load tags.</div>
      ) : tags.length === 0 ? (
        <div className="text-sm text-foreground/60">No tags.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/5 px-3 py-1 text-xs">
              <span className="font-medium">{t.name}</span>
              <button
                type="button"
                className="w-5 h-5 rounded-full hover:bg-secondary/10 disabled:opacity-50"
                onClick={() => rmTag.mutateAsync(t.id)}
                disabled={rmTag.isPending}
                aria-label="Remove tag"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <AdminModal open={open} title="Manage tags" subtitle="Replace all tags for this product." onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const t = tagInput.trim();
                  if (!t) return;
                  setTagNames((prev) => (prev.some((x) => x.toLowerCase() === t.toLowerCase()) ? prev : [...prev, t]));
                  setTagInput("");
                }
              }}
              className="flex-1 h-10 rounded-xl border border-border bg-background px-3 text-sm"
              placeholder="Type tag and press Enter"
            />
            <button
              type="button"
              className="h-10 px-4 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-medium"
              onClick={() => {
                const t = tagInput.trim();
                if (!t) return;
                setTagNames((prev) => (prev.some((x) => x.toLowerCase() === t.toLowerCase()) ? prev : [...prev, t]));
                setTagInput("");
              }}
            >
              Add
            </button>
          </div>

          {tagNames.length === 0 ? (
            <div className="text-sm text-foreground/60">No tags.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tagNames.map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/5 px-3 py-1 text-xs">
                  <span className="font-medium">{t}</span>
                  <button type="button" className="w-5 h-5 rounded-full hover:bg-secondary/10" onClick={() => setTagNames((p) => p.filter((x) => x !== t))}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            disabled={setTags.isPending}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
            onClick={async () => {
              await setTags.mutateAsync(tagNames);
              setOpen(false);
            }}
          >
            {setTags.isPending ? "Saving…" : "Save tags"}
          </button>
        </div>
      </AdminModal>
    </ProductHubSection>
  );
};