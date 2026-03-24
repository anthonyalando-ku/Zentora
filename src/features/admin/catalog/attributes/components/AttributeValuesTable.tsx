import { AdminTable, AdminTableHead, AdminTd, AdminTh, AdminTr } from "@/features/admin/shared/components/AdminTable";
import { ConfirmDangerButton } from "@/features/admin/shared/components/ConfirmDangerButton";
import type { AdminAttributeValue } from "@/features/admin/catalog/shared/adminCatalogApi";

export const AttributeValuesTable = ({
  rows,
  onDelete,
  deleting,
}: {
  rows: AdminAttributeValue[];
  onDelete: (id: number) => Promise<void> | void;
  deleting: boolean;
}) => {
  return (
    <AdminTable>
      <table className="min-w-full">
        <AdminTableHead>
          <tr>
            <AdminTh>Value</AdminTh>
            <AdminTh>Slug</AdminTh>
            <AdminTh>Sort</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </tr>
        </AdminTableHead>

        <tbody>
          {rows.map((v) => (
            <AdminTr key={v.id}>
              <AdminTd>
                <div className="font-medium text-foreground">{v.value}</div>
                <div className="text-xs text-foreground/50">ID: {v.id}</div>
              </AdminTd>
              <AdminTd className="text-foreground/70">{v.slug ?? "—"}</AdminTd>
              <AdminTd className="text-foreground/70">{v.sort_order ?? 0}</AdminTd>
              <AdminTd className="text-right">
                <ConfirmDangerButton
                  disabled={deleting}
                  confirmText={`Delete value "${v.value}"?`}
                  onConfirm={() => onDelete(v.id)}
                />
              </AdminTd>
            </AdminTr>
          ))}
        </tbody>
      </table>
    </AdminTable>
  );
};