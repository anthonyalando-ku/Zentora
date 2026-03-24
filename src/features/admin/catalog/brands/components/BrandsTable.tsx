import { AdminTable, AdminTableHead, AdminTd, AdminTh, AdminTr } from "@/features/admin/shared/components/AdminTable";
import { ConfirmDangerButton } from "@/features/admin/shared/components/ConfirmDangerButton";
import type { AdminBrand } from "@/features/admin/catalog/shared/adminCatalogApi";

export const BrandsTable = ({
  rows,
  onDelete,
  deleting,
}: {
  rows: AdminBrand[];
  onDelete: (id: number) => Promise<void> | void;
  deleting: boolean;
}) => {
  return (
    <AdminTable>
      <table className="min-w-full">
        <AdminTableHead>
          <tr>
            <AdminTh>Name</AdminTh>
            <AdminTh>Slug</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </tr>
        </AdminTableHead>
        <tbody>
          {rows.map((b) => (
            <AdminTr key={b.id}>
              <AdminTd>
                <div className="font-medium text-foreground">{b.name}</div>
                <div className="text-xs text-foreground/50">ID: {b.id}</div>
              </AdminTd>
              <AdminTd className="text-foreground/70">{b.slug ?? "—"}</AdminTd>
              <AdminTd className="text-right">
                <ConfirmDangerButton
                  disabled={deleting}
                  confirmText={`Delete brand "${b.name}"?`}
                  onConfirm={() => onDelete(b.id)}
                />
              </AdminTd>
            </AdminTr>
          ))}
        </tbody>
      </table>
    </AdminTable>
  );
};