import { Link } from "react-router-dom";
import { AdminTable, AdminTableHead, AdminTd, AdminTh, AdminTr } from "@/features/admin/shared/components/AdminTable";
import { ConfirmDangerButton } from "@/features/admin/shared/components/ConfirmDangerButton";
import type { AdminAttribute } from "@/features/admin/catalog/shared/adminCatalogApi";

export const AttributesTable = ({
  rows,
  onDelete,
  deleting,
}: {
  rows: AdminAttribute[];
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
          {rows.map((a) => (
            <AdminTr key={a.id}>
              <AdminTd>
                <div className="font-medium text-foreground">{a.name}</div>
                <div className="text-xs text-foreground/50">ID: {a.id}</div>
              </AdminTd>
              <AdminTd className="text-foreground/70">{a.slug ?? "—"}</AdminTd>
              <AdminTd className="text-right">
                <div className="inline-flex items-center gap-2">
                  <Link
                    to={`/admin/catalog/attributes/${a.id}`}
                    className="inline-flex items-center justify-center rounded-xl font-medium transition h-9 px-3 text-xs border border-border hover:bg-secondary/10"
                  >
                    Manage Values
                  </Link>
                  <ConfirmDangerButton
                    disabled={deleting}
                    confirmText={`Delete attribute "${a.name}"? This will remove its values too.`}
                    onConfirm={() => onDelete(a.id)}
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