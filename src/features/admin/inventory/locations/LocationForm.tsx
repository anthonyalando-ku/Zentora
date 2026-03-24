import { useForm } from "react-hook-form";
import type { InventoryLocation } from "@/features/admin/inventory/api/adminInventoryApi";

export type LocationFormValues = {
  name: string;
  location_code: string;
  is_active: boolean;
};

export const LocationForm = ({
  initial,
  isSubmitting,
  onSubmit,
}: {
  initial?: InventoryLocation | null;
  isSubmitting: boolean;
  onSubmit: (values: LocationFormValues) => Promise<void> | void;
}) => {
  const { register, handleSubmit, formState } = useForm<LocationFormValues>({
    defaultValues: {
      name: initial?.name ?? "",
      location_code: initial?.location_code?.Valid ? initial.location_code.String : "",
      is_active: initial?.is_active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-foreground/60">Name *</label>
        <input
          className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          {...register("name", { required: "Name is required" })}
          placeholder="e.g. Main Warehouse"
        />
        {formState.errors.name?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.name.message}</p>}
      </div>

      <div>
        <label className="text-xs font-medium text-foreground/60">Location code</label>
        <input
          className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          {...register("location_code")}
          placeholder="e.g. MAIN"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground/70">
        <input type="checkbox" className="accent-primary" {...register("is_active")} />
        Active
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition h-11 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : initial ? "Update Location" : "Create Location"}
      </button>
    </form>
  );
};