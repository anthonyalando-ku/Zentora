import { AdminTable, AdminTableHead, AdminTd, AdminTh, AdminTr } from "@/features/admin/shared/components/AdminTable";
import { ConfirmDangerButton } from "@/features/admin/shared/components/ConfirmDangerButton";
import type { InventoryLocation } from "@/features/admin/inventory/api/adminInventoryApi";

export const LocationTable = ({
  rows,
  onEdit,
  onDelete,
  deleting,
}: {
  rows: InventoryLocation[];
  onEdit: (row: InventoryLocation) => void;
  onDelete: (id: number) => Promise<void> | void;
  deleting: boolean;
}) => {
  return (
    <AdminTable>
      <table className="min-w-full">
        <AdminTableHead>
          <tr>
            <AdminTh>Name</AdminTh>
            <AdminTh>Location Code</AdminTh>
            <AdminTh>Active</AdminTh>
            <AdminTh>Created At</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </tr>
        </AdminTableHead>

        <tbody>
          {rows.map((l) => (
            <AdminTr key={l.id}>
              <AdminTd>
                <div className="font-medium">{l.name}</div>
                <div className="text-xs text-foreground/50">ID: {l.id}</div>
              </AdminTd>
              <AdminTd className="text-foreground/70">{l.location_code?.Valid ? l.location_code.String : "—"}</AdminTd>
              <AdminTd>
                <span
                  className={[
                    "text-xs font-semibold px-2.5 py-1 rounded-full border",
                    l.is_active ? "bg-green-500/10 border-green-500/20 text-green-700" : "bg-secondary/10 border-border text-foreground/60",
                  ].join(" ")}
                >
                  {l.is_active ? "Active" : "Inactive"}
                </span>
              </AdminTd>
              <AdminTd className="text-foreground/70">{new Date(l.created_at).toLocaleString()}</AdminTd>
              <AdminTd className="text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl font-medium transition h-9 px-3 text-xs border border-border hover:bg-secondary/10"
                    onClick={() => onEdit(l)}
                  >
                    Edit
                  </button>
                  <ConfirmDangerButton
                    disabled={deleting}
                    confirmText={`Delete location "${l.name}"?`}
                    onConfirm={() => onDelete(l.id)}
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