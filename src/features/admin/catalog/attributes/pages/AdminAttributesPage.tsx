import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { useAttributes, useCreateAttribute, useDeleteAttribute } from "@/features/admin/catalog/attributes/hooks/useAttributes";
import { AttributesTable } from "@/features/admin/catalog/attributes/components/AttributesTable";
import { CreateAttributeForm } from "@/features/admin/catalog/attributes/components/CreateAttributeForm";

const AdminAttributesPage = () => {
  const [open, setOpen] = useState(false);

  const query = useAttributes();
  const create = useCreateAttribute();
  const del = useDeleteAttribute();

  const rows = useMemo(() => query.data ?? [], [query.data]);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Attributes"
        subtitle="Create attributes like Size, Color, Material. Then add values per attribute."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Catalog", href: "/admin/catalog/attributes" },
          { label: "Attributes", href: "/admin/catalog/attributes" },
        ]}
        action={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            New Attribute
          </button>
        }
      />

      {query.isLoading ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">
          Loading attributes…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-10 text-center">
          <div className="text-base font-semibold">No attributes</div>
          <div className="text-sm text-foreground/60 mt-1">Create attributes to support product variants and filtering.</div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            Create Attribute
          </button>
        </div>
      ) : (
        <AttributesTable rows={rows} deleting={del.isPending} onDelete={(id) => del.mutateAsync(id)} />
      )}

      <AdminModal open={open} title="New Attribute" subtitle="Add an attribute like Size, Color, Material." onClose={() => setOpen(false)}>
        <CreateAttributeForm
          isSubmitting={create.isPending}
          onSubmit={async (values) => {
            await create.mutateAsync({
              name: values.name,
              slug: values.slug || undefined,
            });
            setOpen(false);
          }}
        />
      </AdminModal>
    </div>
  );
};

export default AdminAttributesPage;