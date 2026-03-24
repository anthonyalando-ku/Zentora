import { Link } from "react-router-dom";
import { AdminTable, AdminTableHead, AdminTd, AdminTh, AdminTr } from "@/features/admin/shared/components/AdminTable";
import { ConfirmDangerButton } from "@/features/admin/shared/components/ConfirmDangerButton";
import type { AdminProductListItem } from "@/features/admin/products/api/adminProductsApi";

const InventoryPill = ({ s }: { s: AdminProductListItem["inventory_status"] }) => {
  const cls =
    s === "in_stock"
      ? "bg-green-500/10 border-green-500/20 text-green-700"
      : s === "low_stock"
        ? "bg-amber-500/10 border-amber-500/20 text-amber-700"
        : "bg-destructive/10 border-destructive/20 text-destructive";
  const label = s === "in_stock" ? "In stock" : s === "low_stock" ? "Low stock" : "Out of stock";
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>;
};

export const AdminProductsTable = ({
  rows,
  deleting,
  onDelete,
}: {
  rows: AdminProductListItem[];
  deleting: boolean;
  onDelete: (id: number) => Promise<void> | void;
}) => {
  return (
    <AdminTable>
      <table className="min-w-full">
        <AdminTableHead>
          <tr>
            <AdminTh>Image</AdminTh>
            <AdminTh>Name</AdminTh>
            <AdminTh>Brand</AdminTh>
            <AdminTh>Category</AdminTh>
            <AdminTh>Price</AdminTh>
            <AdminTh>Rating</AdminTh>
            <AdminTh>Inventory</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh>Created</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </tr>
        </AdminTableHead>

        <tbody>
          {rows.map((p) => (
            <AdminTr key={p.slug}>
              <AdminTd>
                <div className="w-12 h-12 rounded-xl border border-border bg-secondary/10 overflow-hidden">
                  <img
                    src={p.primary_image ?? "https://picsum.photos/seed/zentora-admin-prod/96/96"}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </AdminTd>

              <AdminTd>
                <div className="font-medium text-foreground line-clamp-2">{p.name}</div>
                <div className="text-xs text-foreground/50 mt-0.5">/{p.slug}</div>
              </AdminTd>

              <AdminTd className="text-foreground/70">{p.brand ?? "—"}</AdminTd>
              <AdminTd className="text-foreground/70">{p.category ?? "—"}</AdminTd>

              <AdminTd className="font-semibold text-foreground">
                {p.price.toLocaleString()}
                {p.discount ? <span className="ml-2 text-xs text-secondary font-semibold">-{p.discount}%</span> : null}
              </AdminTd>

              <AdminTd className="text-foreground/70">
                {typeof p.rating === "number" ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="font-semibold">{p.rating.toFixed(1)}</span>
                    <span className="text-xs text-foreground/50">({p.review_count ?? 0})</span>
                  </span>
                ) : (
                  "—"
                )}
              </AdminTd>

              <AdminTd>
                <InventoryPill s={p.inventory_status} />
              </AdminTd>

              <AdminTd className="text-foreground/70">{p.status ?? "—"}</AdminTd>
              <AdminTd className="text-foreground/70">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</AdminTd>

              <AdminTd className="text-right">
                <div className="inline-flex items-center gap-2">
                  <Link
                    to={`/admin/products/${p.slug}`}
                    className="inline-flex items-center justify-center rounded-xl font-medium transition h-9 px-3 text-xs border border-border hover:bg-secondary/10"
                  >
                    View
                  </Link>

                  <Link
                    to={`/admin/products/${p.slug}`}
                    className="inline-flex items-center justify-center rounded-xl font-medium transition h-9 px-3 text-xs border border-border hover:bg-secondary/10"
                    title="Edit in product detail hub"
                  >
                    Edit
                  </Link>

                  <ConfirmDangerButton
                    disabled={deleting}
                    confirmText={`Delete product "${p.name}"? This cannot be undone.`}
                    onConfirm={() => onDelete(p.product_id)}
                  />
                </div>
              </AdminTd>
            </AdminTr>
          ))}
        </tbody>
      </table>
    </AdminTable>
  );
};