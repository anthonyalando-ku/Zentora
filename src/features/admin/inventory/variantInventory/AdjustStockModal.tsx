import { useForm } from "react-hook-form";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";

type Values = { delta: number };

export const AdjustStockModal = ({
  open,
  onClose,
  isSubmitting,
  locationName,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  locationName?: string;
  onSubmit: (values: Values) => Promise<void> | void;
}) => {
  const { register, handleSubmit } = useForm<Values>({
    defaultValues: { delta: 0 },
  });

  return (
    <AdminModal open={open} title="Adjust Stock" subtitle={locationName ? `Location: ${locationName}` : "Adjust available quantity"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground/60">Delta *</label>
          <input
            type="number"
            className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("delta", { valueAsNumber: true })}
            placeholder="e.g. 10 or -5"
          />
          <p className="mt-2 text-xs text-foreground/50">Use positive numbers to add stock and negative numbers to subtract.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition h-11 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Apply Adjustment"}
        </button>
      </form>
    </AdminModal>
  );
};