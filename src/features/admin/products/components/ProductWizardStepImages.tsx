import { useMemo } from "react";
import { useProductWizardStore } from "@/features/admin/products/store/productWizardStore";
import { cn } from "@/shared/utils/cn";

export const ProductWizardStepImages = ({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) => {
  const images = useProductWizardStore((s) => s.draft.images);
  const addImages = useProductWizardStore((s) => s.addImages);
  const removeImage = useProductWizardStore((s) => s.removeImage);
  const setPrimaryImage = useProductWizardStore((s) => s.setPrimaryImage);
  const moveImage = useProductWizardStore((s) => s.moveImage);

  const sorted = useMemo(() => [...images].sort((a, b) => a.sortOrder - b.sortOrder), [images]);

  const canContinue = sorted.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Product images</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Upload multiple images, reorder them, and choose a primary image. At least one image is required.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
        <label className="inline-flex items-center gap-2">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length === 0) return;
              addImages(files);
              e.currentTarget.value = "";
            }}
          />
          <span className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90 cursor-pointer">
            Upload images
          </span>
        </label>

        <div className="text-xs text-foreground/50">{sorted.length} image{sorted.length === 1 ? "" : "s"}</div>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-secondary/5 p-10 text-center">
          <div className="text-base font-semibold">No images yet</div>
          <div className="text-sm text-foreground/60 mt-1">Upload at least one image to continue.</div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map((img, idx) => (
            <div key={img.id} className={cn("rounded-2xl border border-border overflow-hidden bg-background shadow-sm")}>
              <div className="relative aspect-square bg-secondary/10">
                <img src={img.previewUrl} alt="Upload preview" className="absolute inset-0 w-full h-full object-cover" />
                {img.isPrimary && (
                  <div className="absolute top-2 left-2 text-[11px] font-semibold px-2 py-1 rounded-full bg-primary text-white">
                    Primary
                  </div>
                )}
              </div>

              <div className="p-3 space-y-2">
                <div className="text-xs text-foreground/50 line-clamp-1">{img.file.name}</div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-medium disabled:opacity-50"
                    disabled={idx === 0}
                    onClick={() => moveImage(img.id, "up")}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-medium disabled:opacity-50"
                    disabled={idx === sorted.length - 1}
                    onClick={() => moveImage(img.id, "down")}
                  >
                    Down
                  </button>

                  <button
                    type="button"
                    className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-medium"
                    onClick={() => setPrimaryImage(img.id)}
                  >
                    Set primary
                  </button>

                  <button
                    type="button"
                    className="h-9 px-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition text-xs font-medium"
                    onClick={() => removeImage(img.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
          disabled={!canContinue}
          onClick={onNext}
          className="h-11 px-6 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};