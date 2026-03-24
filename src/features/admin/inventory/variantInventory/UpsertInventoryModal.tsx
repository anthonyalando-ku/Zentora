import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { useInventoryLocations, useCreateLocation } from "@/features/admin/inventory/hooks/useInventoryLocations";
import type { InventoryLocation } from "@/features/admin/inventory/api/adminInventoryApi";

type Values = {
  location_id: number;
  available_qty: number;
  reserved_qty: number;
  incoming_qty: number;
};

export const UpsertInventoryModal = ({
  open,
  onClose,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (values: Values) => Promise<void> | void;
}) => {
  const locationsQuery = useInventoryLocations();
  const createLocation = useCreateLocation();

  const [openCreateLoc, setOpenCreateLoc] = useState(false);
  const [newLocName, setNewLocName] = useState("");
  const [newLocCode, setNewLocCode] = useState("");

  const locations = useMemo(() => (locationsQuery.data ?? []).filter((l) => l.is_active), [locationsQuery.data]);

  const { register, handleSubmit, formState, setValue, watch } = useForm<Values>({
    defaultValues: {
      location_id: locations[0]?.id ?? 0,
      available_qty: 0,
      reserved_qty: 0,
      incoming_qty: 0,
    },
  });

  const selectedLocationId = watch("location_id");

  const submit = async (v: Values) => {
    if (!v.location_id || v.location_id <= 0) return;
    await onSubmit(v);
  };

  const createNewLocation = async () => {
    if (!newLocName.trim()) return;
    const created = await createLocation.mutateAsync({
      name: newLocName.trim(),
      location_code: newLocCode.trim() || undefined,
      is_active: true,
    });
    setOpenCreateLoc(false);
    setNewLocName("");
    setNewLocCode("");
    // select the created location
    setValue("location_id", (created as InventoryLocation).id);
  };

  return (
    <AdminModal open={open} title="Upsert Inventory Item" subtitle="Set exact quantities for this variant at a location." onClose={onClose}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <div className="flex items-end justify-between gap-3">
              <label className="text-xs font-medium text-foreground/60">Location *</label>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => setOpenCreateLoc(true)}
              >
                Create new location
              </button>
            </div>

            <select
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("location_id", { valueAsNumber: true })}
              value={selectedLocationId}
              onChange={(e) => setValue("location_id", Number(e.target.value))}
            >
              <option value={0}>Select location…</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} {l.location_code?.Valid ? `(${l.location_code.String})` : ""}
                </option>
              ))}
            </select>
            {formState.errors.location_id?.message && <p className="mt-1 text-xs text-destructive">{formState.errors.location_id.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/60">Available qty</label>
            <input
              type="number"
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("available_qty", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/60">Reserved qty</label>
            <input
              type="number"
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("reserved_qty", { valueAsNumber: true })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-foreground/60">Incoming qty</label>
            <input
              type="number"
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("incoming_qty", { valueAsNumber: true })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition h-11 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save Inventory"}
        </button>
      </form>

      {/* Inline create location modal */}
      <AdminModal
        open={openCreateLoc}
        title="Create Location"
        subtitle="Create a new inventory location and select it automatically."
        onClose={() => setOpenCreateLoc(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground/60">Name *</label>
            <input
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
              placeholder="e.g. Westlands Branch"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60">Location code</label>
            <input
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={newLocCode}
              onChange={(e) => setNewLocCode(e.target.value)}
              placeholder="e.g. WEST"
            />
          </div>

          <button
            type="button"
            disabled={createLocation.isPending}
            className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition h-11 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
            onClick={createNewLocation}
          >
            {createLocation.isPending ? "Creating…" : "Create Location"}
          </button>
        </div>
      </AdminModal>
    </AdminModal>
  );
};