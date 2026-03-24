import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { useBrands, useCreateBrand, useDeleteBrand } from "@/features/admin/catalog/brands/hooks/useBrands";
import { BrandsTable } from "@/features/admin/catalog/brands/components/BrandsTable";
import { CreateBrandForm } from "@/features/admin/catalog/brands/components/CreateBrandForm";

const AdminBrandsPage = () => {
  const [open, setOpen] = useState(false);

  const query = useBrands();
  const create = useCreateBrand();
  const del = useDeleteBrand();

  const rows = useMemo(() => query.data ?? [], [query.data]);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Brands"
        subtitle="Create and manage brands."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Catalog", href: "/admin/catalog/brands" },
          { label: "Brands", href: "/admin/catalog/brands" },
        ]}
        action={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            New Brand
          </button>
        }
      />

      {query.isLoading ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">
          Loading brands…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-10 text-center">
          <div className="text-base font-semibold">No brands</div>
          <div className="text-sm text-foreground/60 mt-1">Create a brand to assign products.</div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            Create Brand
          </button>
        </div>
      ) : (
        <BrandsTable rows={rows} deleting={del.isPending} onDelete={(id) => del.mutateAsync(id)} />
      )}

      <AdminModal open={open} title="New Brand" subtitle="Add a brand to your catalog." onClose={() => setOpen(false)}>
        <CreateBrandForm
          isSubmitting={create.isPending}
          onSubmit={async (values) => {
            await create.mutateAsync({
              name: values.name,
              slug: values.slug || undefined,
              logo_url: values.logo_url || undefined,
            });
            setOpen(false);
          }}
        />
      </AdminModal>
    </div>
  );
};

export default AdminBrandsPage;