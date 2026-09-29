import { useState } from "react";
import { useForm } from "react-hook-form";
import type { AdminCategory, CategoryInput } from "@/features/admin/catalog/shared/adminCatalogApi";
import { CategoryImage } from "@/features/catalog/CategoryImage";
import { categoryImageUrl } from "@/features/catalog/categoryImageUrl";

export type CreateCategoryValues = CategoryInput;
export const CreateCategoryForm = ({ defaultParentId, initialCategory, onSubmit, isSubmitting }: {
 defaultParentId?: number;
 initialCategory?: AdminCategory;
 onSubmit: (values: CreateCategoryValues) => Promise<void> | void;
 isSubmitting: boolean;
}) => {
 const { register, handleSubmit, formState } = useForm<CreateCategoryValues>({ defaultValues: {
 name: initialCategory?.name ?? "", slug: initialCategory?.slug ?? "",
 parent_id: initialCategory?.parent_id?.Valid ? initialCategory.parent_id.Int64 : defaultParentId,
 }});
 const [mode,setMode] = useState<"keep"|"upload"|"url"|"remove">("keep");
 const [file,setFile] = useState<File|null>(null);
 const [url,setUrl] = useState(initialCategory?.image_url ?? "");
 const [error,setError] = useState("");
 const [submitting,setSubmitting] = useState(false);
 const busy = isSubmitting || submitting;
 const submit = async (values: CreateCategoryValues) => {
  setError("");
  if (mode === "upload" && (!file || file.size > 8 * 1024 * 1024 || !["image/jpeg","image/png","image/gif","image/webp"].includes(file.type))) {
   setError("Choose a JPEG, PNG, GIF or WebP image up to 8 MB."); return;
  }
  if (mode === "url" && !categoryImageUrl(url)) { setError("Enter a valid HTTP or HTTPS image URL."); return; }
  setSubmitting(true);
  try {
   await onSubmit({ ...values,
    parent_id: Number.isFinite(values.parent_id) ? values.parent_id : initialCategory ? 0 : undefined,
    ...(mode === "url" ? {image_url:url.trim()} : mode === "remove" ? {image_url:""} : {}),
    ...(mode === "upload" && file ? {image:file} : {}),
   });
  } catch (e) { setError(e instanceof Error ? e.message : "Could not save category. Please try again."); }
  finally { setSubmitting(false); }
 };
 const fallback = <span className="w-20 h-20 rounded-lg border border-border flex items-center justify-center text-xs text-foreground/60">No image</span>;
 return <form onSubmit={handleSubmit(submit)} className="space-y-4 max-h-[65vh] overflow-y-auto">
  <fieldset disabled={busy} className="space-y-4">
   <label className="block text-xs font-medium">Name *
    <input className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm" {...register("name",{required:"Name is required"})} />
   </label>
   {formState.errors.name?.message && <p className="text-xs text-destructive">{formState.errors.name.message}</p>}
   <label className="block text-xs font-medium">Slug
    <input readOnly={Boolean(initialCategory)} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm" {...register("slug")} />
   </label>
   <label className="block text-xs font-medium">Parent ID (optional)
    <input type="number" min="1" className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm" {...register("parent_id",{valueAsNumber:true})} />
   </label>
   <div className="space-y-3">
    <label className="block text-xs font-medium">Category image (optional)
     <select value={mode} onChange={(e)=>setMode(e.target.value as typeof mode)} className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm">
      <option value="keep">{initialCategory ? "Keep current image" : "No image"}</option>
      <option value="upload">Upload an image</option>
      <option value="url">Use image URL</option>
      {initialCategory && <option value="remove">Remove image</option>}
     </select>
    </label>
    {mode === "upload" ? <label className="block text-xs">JPEG, PNG, GIF or WebP, up to 8 MB
     <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="block mt-2" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
    </label> : <CategoryImage src={mode === "remove" ? null : mode === "url" ? url : initialCategory?.image_url} alt="Category preview" className="w-20 h-20" fallback={fallback} />}
    {mode === "url" && <label className="block text-xs">Image URL<input type="url" value={url} onChange={(e)=>setUrl(e.target.value)} maxLength={2048} placeholder="https://?" className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm" /></label>}
   </div>
  </fieldset>
  {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  <button type="submit" disabled={busy} className="w-full h-11 rounded-xl bg-primary text-white font-semibold disabled:opacity-50">{busy ? "Saving?" : initialCategory ? "Save changes" : "Create Category"}</button>
 </form>;
};
