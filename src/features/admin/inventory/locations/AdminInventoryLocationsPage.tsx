import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { LocationTable } from "@/features/admin/inventory/locations/LocationTable";
import { LocationForm } from "@/features/admin/inventory/locations/LocationForm";
import {
  useCreateLocation,
  useDeleteLocation,
  useInventoryLocations,
  useUpdateLocation,
} from "@/features/admin/inventory/hooks/useInventoryLocations";
import type { InventoryLocation } from "@/features/admin/inventory/api/adminInventoryApi";

const AdminInventoryLocationsPage = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryLocation | null>(null);

  const query = useInventoryLocations();
  const create = useCreateLocation();
  const update = useUpdateLocation();
  const del = useDeleteLocation();

  const rows = useMemo(() => query.data ?? [], [query.data]);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Inventory Locations"
        subtitle="Manage warehouses/branches for stock tracking."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Inventory", href: "/admin/inventory/locations" },
          { label: "Locations", href: "/admin/inventory/locations" },
        ]}
        action={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            New Location
          </button>
        }
      />

      {query.isLoading ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">Loading locations…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-10 text-center">
          <div className="text-base font-semibold">No locations</div>
          <div className="text-sm text-foreground/60 mt-1">Create a location to start tracking stock.</div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            Create Location
          </button>
        </div>
      ) : (
        <LocationTable
          rows={rows}
          deleting={del.isPending}
          onEdit={(loc) => {
            setEditing(loc);
            setOpen(true);
          }}
          onDelete={(id) => del.mutateAsync(id)}
        />
      )}

      <AdminModal
        open={open}
        title={editing ? "Edit Location" : "New Location"}
        subtitle={editing ? "Update location details." : "Add a new inventory location."}
        onClose={() => setOpen(false)}
      >
        <LocationForm
          initial={editing}
          isSubmitting={create.isPending || update.isPending}
          onSubmit={async (values) => {
            if (editing) {
              await update.mutateAsync({
                id: editing.id,
                body: {
                  name: values.name,
                  location_code: values.location_code.trim() || undefined,
                  is_active: values.is_active,
                },
              });
            } else {
              await create.mutateAsync({
                name: values.name,
                location_code: values.location_code.trim() || undefined,
                is_active: values.is_active,
              });
            }
            setOpen(false);
            setEditing(null);
          }}
        />
      </AdminModal>
    </div>
  );
};

export default AdminInventoryLocationsPage;