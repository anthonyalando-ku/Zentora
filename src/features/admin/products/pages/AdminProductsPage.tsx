import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { ProductSearchBox } from "@/features/admin/products/components/ProductSearchBox";
import { AdminProductsTable } from "@/features/admin/products/components/AdminProductsTable";
import { useAdminProducts } from "@/features/admin/products/hooks/useAdminProducts";
import { useDeleteAdminProduct } from "@/features/admin/products/hooks/useAdminProductMutations";

const AdminProductsPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 20,
    status: "",
    q: "",
    in_stock_only: false,
    discount_only: false,
    is_featured: false,
  });

  const query = useAdminProducts({
    page: filters.page,
    page_size: filters.page_size,
    status: filters.status || undefined,
    q: filters.q || undefined,
    in_stock_only: filters.in_stock_only || undefined,
    discount_only: filters.discount_only || undefined,
    is_featured: filters.is_featured || undefined,
  });

  const del = useDeleteAdminProduct();

  const data = query.data;
  const rows = useMemo(() => data?.items ?? [], [data?.items]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.size)) : 1;

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Products"
        subtitle="Search, review, and manage products."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
        ]}
        action={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            New Product
          </Link>
        }
      />

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-6">
            <ProductSearchBox
              value={filters.q}
              onChange={(q) => setFilters((s) => ({ ...s, q, page: 1 }))}
            />
          </div>

          <div className="lg:col-span-3">
            <label className="text-xs font-medium text-foreground/60">Status</label>
            <select
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={filters.status}
              onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value, page: 1 }))}
            >
              <option value="">All</option>
              <option value="active">active</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
            </select>
          </div>

          <div className="lg:col-span-3 flex gap-2">
            <button
              type="button"
              className="flex-1 h-11 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-medium"
              onClick={() =>
                setFilters({
                  page: 1,
                  page_size: 20,
                  status: "",
                  q: "",
                  in_stock_only: false,
                  discount_only: false,
                  is_featured: false,
                })
              }
            >
              Reset
            </button>
            <button
              type="button"
              className="flex-1 h-11 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold"
              onClick={() => query.refetch()}
            >
              Refresh
            </button>
          </div>

          <div className="lg:col-span-12 flex flex-wrap items-center gap-3 pt-1">
            {[
              { key: "in_stock_only", label: "In stock only" },
              { key: "discount_only", label: "Discount only" },
              { key: "is_featured", label: "Featured only" },
            ].map((t) => (
              <label key={t.key} className="inline-flex items-center gap-2 text-sm text-foreground/70">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={(filters as any)[t.key]}
                  onChange={(e) => setFilters((s) => ({ ...s, [t.key]: e.target.checked, page: 1 }))}
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {query.isLoading ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">
          Loading products…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-10 text-center">
          <div className="text-base font-semibold">No products found</div>
          <div className="text-sm text-foreground/60 mt-1">Try adjusting filters or create a new product.</div>
          <Link
            to="/admin/products/new"
            className="mt-4 inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            Create Product
          </Link>
        </div>
      ) : (
        <>
          <AdminProductsTable rows={rows} deleting={del.isPending} onDelete={(id) => del.mutateAsync(id)} />

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-foreground/60">
              Page <span className="font-semibold text-foreground">{data?.page ?? 1}</span> of{" "}
              <span className="font-semibold text-foreground">{totalPages}</span> • Total{" "}
              <span className="font-semibold text-foreground">{data?.total ?? 0}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-10 px-4 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-medium disabled:opacity-50"
                disabled={(data?.page ?? 1) <= 1}
                onClick={() => setFilters((s) => ({ ...s, page: Math.max(1, s.page - 1) }))}
              >
                Prev
              </button>
              <button
                type="button"
                className="h-10 px-4 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-medium disabled:opacity-50"
                disabled={(data?.page ?? 1) >= totalPages}
                onClick={() => setFilters((s) => ({ ...s, page: s.page + 1 }))}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProductsPage;