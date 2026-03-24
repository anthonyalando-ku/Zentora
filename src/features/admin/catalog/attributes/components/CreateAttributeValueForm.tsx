import { useForm } from "react-hook-form";

export type CreateAttributeValueValues = {
  value: string;
  slug?: string;
  sort_order?: number;
};

export const CreateAttributeValueForm = ({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: CreateAttributeValueValues) => Promise<void> | void;
  isSubmitting: boolean;
}) => {
  const { register, handleSubmit, formState } = useForm<CreateAttributeValueValues>({
    defaultValues: { value: "", slug: "", sort_order: 0 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-foreground/60">Value *</label>
        <input
          className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          {...register("value", { required: "Value is required" })}
          placeholder="e.g. Small"
        />
        {formState.errors.value?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.value.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-foreground/60">Slug</label>
          <input
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("slug")}
            placeholder="e.g. small"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-foreground/60">Sort order</label>
          <input
            type="number"
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("sort_order", { valueAsNumber: true })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition h-11 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : "Create Value"}
      </button>
    </form>
  );
};