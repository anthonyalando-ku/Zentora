import { useState } from "react";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { ConfirmDangerButton } from "@/features/admin/shared/components/ConfirmDangerButton";
import { ProductHubSection } from "@/features/admin/products/components/hub/ProductHubSection";
import type { ProductImage } from "@/features/admin/products/api/adminProductHubApi";
import { useAddProductImage, useDeleteProductImage, useProductImages, useSetPrimaryProductImage } from "@/features/admin/products/hooks/useAdminProductHub";

export const ProductImagesSection = ({ productId, slug }: { productId: number; slug: string }) => {
  const imagesQuery = useProductImages(productId);
  const addImage = useAddProductImage(slug, productId);
  const delImage = useDeleteProductImage(slug, productId);
  const setPrimary = useSetPrimaryProductImage(slug, productId);

  const [openUpload, setOpenUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const images = (imagesQuery.data ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);

  return (
    <ProductHubSection
      title="Images"
      description="Upload images, set primary image."
      action={
        <button
          type="button"
          onClick={() => setOpenUpload(true)}
          className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
        >
          Add image
        </button>
      }
    >
      {imagesQuery.isLoading ? (
        <div className="text-sm text-foreground/60">Loading images…</div>
      ) : imagesQuery.isError ? (
        <div className="text-sm text-destructive">Failed to load images.</div>
      ) : images.length === 0 ? (
        <div className="text-sm text-foreground/60">No images yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((img: ProductImage) => (
            <div key={img.id} className="rounded-2xl border border-border overflow-hidden">
              <div className="relative aspect-square bg-secondary/10">
                <img src={img.image_url} alt="Product" className="absolute inset-0 w-full h-full object-cover" />
                {img.is_primary && (
                  <div className="absolute top-2 left-2 text-[11px] font-semibold px-2 py-1 rounded-full bg-primary text-white">
                    Primary
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-medium disabled:opacity-50"
                  onClick={() => setPrimary.mutateAsync(img.id)}
                  disabled={setPrimary.isPending}
                >
                  Set primary
                </button>
                <ConfirmDangerButton
                  disabled={delImage.isPending}
                  confirmText="Delete this image?"
                  onConfirm={() => delImage.mutateAsync(img.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={openUpload} title="Upload image" subtitle="Add a new image to this product." onClose={() => setOpenUpload(false)}>
        <div className="space-y-4">
          <input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
          <button
            type="button"
            disabled={!uploadFile || addImage.isPending}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
            onClick={async () => {
              if (!uploadFile) return;
              await addImage.mutateAsync({ file: uploadFile, is_primary: false, sort_order: 0 });
              setUploadFile(null);
              setOpenUpload(false);
            }}
          >
            {addImage.isPending ? "Uploading…" : "Upload"}
          </button>
        </div>
      </AdminModal>
    </ProductHubSection>
  );
};