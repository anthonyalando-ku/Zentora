import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { CategoriesTable } from "@/features/admin/catalog/categories/components/CategoriesTable";
import { CreateCategoryForm } from "@/features/admin/catalog/categories/components/CreateCategoryForm";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/features/admin/catalog/categories/hooks/useCategories";

const AdminCategoriesPage = () => {
  const [open, setOpen] = useState(false);

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
        <CategoriesTable rows={rows} deleting={del.isPending} onDelete={(id) => del.mutateAsync(id)} />
      )}

      <AdminModal open={open} title="New Category" subtitle="Add a category to your catalog." onClose={() => setOpen(false)}>
        <CreateCategoryForm
          isSubmitting={create.isPending}
          onSubmit={async (values) => {
            await create.mutateAsync({
              name: values.name,
              slug: values.slug || undefined,
              parent_id: values.parent_id || undefined,
            });
            setOpen(false);
          }}
        />
      </AdminModal>
    </div>
  );
};

export default AdminCategoriesPage;