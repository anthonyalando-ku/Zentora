import type { AdminCategory } from "@/features/admin/catalog/shared/adminCatalogApi";
import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { CategoriesTable } from "@/features/admin/catalog/categories/components/CategoriesTable";
import { CreateCategoryForm } from "@/features/admin/catalog/categories/components/CreateCategoryForm";
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/features/admin/catalog/categories/hooks/useCategories";

const AdminCategoriesPage = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const update = useUpdateCategory();

  const query = useCategories();
  const create = useCreateCategory();
  const del = useDeleteCategory();

  const rows = useMemo(() => query.data ?? [], [query.data]);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Categories"
        subtitle="Create and manage product categories."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Catalog", href: "/admin/catalog/categories" },
          { label: "Categories", href: "/admin/catalog/categories" },
        ]}
        action={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            New Category
          </button>
        }
      />

      {query.isLoading ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">
          Loading categories…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-10 text-center">
          <div className="text-base font-semibold">No categories</div>
          <div className="text-sm text-foreground/60 mt-1">Create your first category to organize products.</div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            Create Category
          </button>
        </div>
      ) : (
        <CategoriesTable onEdit={setEditing} rows={rows} deleting={del.isPending} onDelete={(id) => del.mutateAsync(id)} />
      )}

      <AdminModal open={open} title="New Category" subtitle="Add a category to your catalog." onClose={() => { if (!create.isPending) setOpen(false); }}>
        <CreateCategoryForm
          isSubmitting={create.isPending}
          onSubmit={async (values) => {
            await create.mutateAsync({
              name: values.name,
              slug: values.slug || undefined,
              parent_id: values.parent_id || undefined,
              image_url: values.image_url,
              image: values.image,
            });
            setOpen(false);
          }}
        />
      </AdminModal>
      <AdminModal open={editing !== null} title="Edit Category" onClose={() => { if (!update.isPending) setEditing(null); }}>
        {editing && <CreateCategoryForm key={editing.id} initialCategory={editing} isSubmitting={update.isPending} onSubmit={async (input) => { await update.mutateAsync({id: editing.id, input}); setEditing(null); }} />}
      </AdminModal>
    </div>
  );
};

export default AdminCategoriesPage;
