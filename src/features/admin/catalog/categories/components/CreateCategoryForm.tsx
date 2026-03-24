import { useForm } from "react-hook-form";

export type CreateCategoryValues = {
  name: string;
  slug?: string;
  parent_id?: number;
};

export const CreateCategoryForm = ({
  defaultParentId,
  onSubmit,
  isSubmitting,
}: {
  defaultParentId?: number;
  onSubmit: (values: CreateCategoryValues) => Promise<void> | void;
  isSubmitting: boolean;
}) => {
  const { register, handleSubmit, formState } = useForm<CreateCategoryValues>({
    defaultValues: { name: "", slug: "", parent_id: defaultParentId },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-foreground/60">Name *</label>
          <input
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("name", { required: "Name is required" })}
            placeholder="e.g. Electronics"
          />
          {formState.errors.name?.message && (
            <p className="mt-1 text-xs text-destructive">{formState.errors.name.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-foreground/60">Slug</label>
          <input
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("slug")}
            placeholder="e.g. electronics"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-foreground/60">Parent ID (optional)</label>
          <input
            type="number"
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("parent_id", { valueAsNumber: true })}
            placeholder="e.g. 12"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition h-11 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : "Create Category"}
      </button>
    </form>
  );
};