import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { useAttributes } from "@/features/admin/catalog/attributes/hooks/useAttributes";
import {
  useAttributeValues,
  useCreateAttributeValue,
  useDeleteAttributeValue,
} from "@/features/admin/catalog/attributes/hooks/useAttributeValues";
import { AttributeValuesTable } from "@/features/admin/catalog/attributes/components/AttributeValuesTable";
import { CreateAttributeValueForm } from "@/features/admin/catalog/attributes/components/CreateAttributeValueForm";

const AdminAttributeValuesPage = () => {
  const { id } = useParams<{ id: string }>();
  const attributeId = id ? Number(id) : undefined;

  const [open, setOpen] = useState(false);

  const attributesQuery = useAttributes();
  const valuesQuery = useAttributeValues(attributeId);

  const create = useCreateAttributeValue(attributeId as number);
  const del = useDeleteAttributeValue(attributeId as number);

  const attribute = useMemo(() => {
    const list = attributesQuery.data ?? [];
    return list.find((a: any) => a.id === attributeId);
  }, [attributesQuery.data, attributeId]);

  const rows = useMemo(() => valuesQuery.data ?? [], [valuesQuery.data]);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={attribute ? `Attribute: ${attribute.name}` : "Attribute Values"}
        subtitle="Create and manage values for this attribute."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Catalog", href: "/admin/catalog/attributes" },
          { label: "Attributes", href: "/admin/catalog/attributes" },
          { label: "Values", href: `/admin/catalog/attributes/${id}` },
        ]}
        action={
          <div className="inline-flex items-center gap-2">
            <Link
              to="/admin/catalog/attributes"
              className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
            >
              Back
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
              disabled={valuesQuery.isLoading || typeof attributeId !== "number"}
            >
              New Value
            </button>
          </div>
        }
      />

      {valuesQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">
          Loading values…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-10 text-center">
          <div className="text-base font-semibold">No values</div>
          <div className="text-sm text-foreground/60 mt-1">Add values like Small, Medium, Large.</div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            Create Value
          </button>
        </div>
      ) : (
        <AttributeValuesTable rows={rows} deleting={del.isPending} onDelete={(valueId) => del.mutateAsync(valueId)} />
      )}

      <AdminModal open={open} title="New Attribute Value" subtitle="Add a value to this attribute." onClose={() => setOpen(false)}>
        <CreateAttributeValueForm
          isSubmitting={create.isPending}
          onSubmit={async (values) => {
            await create.mutateAsync({
              value: values.value,
              slug: values.slug || undefined,
              sort_order: values.sort_order ?? 0,
            });
            setOpen(false);
          }}
        />
      </AdminModal>
    </div>
  );
};

export default AdminAttributeValuesPage;