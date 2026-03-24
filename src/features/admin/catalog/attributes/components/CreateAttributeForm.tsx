import { useForm } from "react-hook-form";

export type CreateAttributeValues = {
  name: string;
  slug?: string;
};

export const CreateAttributeForm = ({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: CreateAttributeValues) => Promise<void> | void;
  isSubmitting: boolean;
}) => {
  const { register, handleSubmit, formState } = useForm<CreateAttributeValues>({
    defaultValues: { name: "", slug: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-foreground/60">Name *</label>
        <input
          className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          {...register("name", { required: "Name is required" })}
          placeholder="e.g. Size"
        />
        {formState.errors.name?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.name.message}</p>}
      </div>

      <div>
        <label className="text-xs font-medium text-foreground/60">Slug</label>
        <input
          className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          {...register("slug")}
          placeholder="e.g. size"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition h-11 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : "Create Attribute"}
      </button>
    </form>
  );
};