import { CategoryImage } from "@/features/catalog/CategoryImage";
import { AdminTable, AdminTableHead, AdminTd, AdminTh, AdminTr } from "@/features/admin/shared/components/AdminTable";
import { ConfirmDangerButton } from "@/features/admin/shared/components/ConfirmDangerButton";
import type { AdminCategory } from "@/features/admin/catalog/shared/adminCatalogApi";

export const CategoriesTable = ({
  rows,
  onDelete,
  onEdit,
  deleting,
}: {
  rows: AdminCategory[];
  onEdit: (category: AdminCategory) => void;
  onDelete: (id: number) => Promise<void> | void;
  deleting: boolean;
}) => {
  return (
    <AdminTable>
      <table className="min-w-full">
        <AdminTableHead>
          <tr>
            <AdminTh>Image</AdminTh>
            <AdminTh>Name</AdminTh>
            <AdminTh>Slug</AdminTh>
            <AdminTh>Parent</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </tr>
        </AdminTableHead>

        <tbody>
          {rows.map((c) => (
            <AdminTr key={c.id}>
              <AdminTd><CategoryImage src={c.image_url} alt={c.name} fallback={<span className="text-xs text-foreground/50">No image</span>} /></AdminTd>
              <AdminTd>
                <div className="font-medium text-foreground">{c.name}</div>
                <div className="text-xs text-foreground/50">ID: {c.id}</div>
              </AdminTd>
              <AdminTd className="text-foreground/70">{c.slug ?? "—"}</AdminTd>
              <AdminTd className="text-foreground/70">{c.parent_id?.Int64 ?? "—"}</AdminTd>
              <AdminTd className="text-right">
                <button type="button" className="mr-3 text-sm text-primary" onClick={() => onEdit(c)}>Edit</button>
                <ConfirmDangerButton
                  disabled={deleting}
                  confirmText={`Delete category "${c.name}"?`}
                  onConfirm={() => onDelete(c.id)}
                />
              </AdminTd>
            </AdminTr>
          ))}
        </tbody>
      </table>
    </AdminTable>
  );
};