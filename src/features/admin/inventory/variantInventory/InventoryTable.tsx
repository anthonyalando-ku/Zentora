import { AdminTable, AdminTableHead, AdminTd, AdminTh, AdminTr } from "@/features/admin/shared/components/AdminTable";
import { ConfirmDangerButton } from "@/features/admin/shared/components/ConfirmDangerButton";
import type { VariantInventoryRow } from "@/features/admin/inventory/api/adminInventoryApi";

export const InventoryTable = ({
  rows,
  onAdjust,
  onReserve,
  onRelease,
  onDelete,
  busy,
}: {
  rows: VariantInventoryRow[];
  onAdjust: (row: VariantInventoryRow) => void;
  onReserve: (row: VariantInventoryRow) => Promise<void> | void;
  onRelease: (row: VariantInventoryRow) => Promise<void> | void;
  onDelete: (row: VariantInventoryRow) => Promise<void> | void;
  busy: boolean;
}) => {
  return (
    <AdminTable>
      <table className="min-w-full">
        <AdminTableHead>
          <tr>
            <AdminTh>Location</AdminTh>
            <AdminTh>Code</AdminTh>
            <AdminTh>Available</AdminTh>
            <AdminTh>Reserved</AdminTh>
            <AdminTh>Incoming</AdminTh>
            <AdminTh>Updated</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </tr>
        </AdminTableHead>
        <tbody>
          {rows.map((r) => (
            <AdminTr key={`${r.location_id}`}>
              <AdminTd>
                <div className="font-medium">{r.location_name ?? `Location #${r.location_id}`}</div>
                <div className="text-xs text-foreground/50">Location ID: {r.location_id}</div>
              </AdminTd>
              <AdminTd className="text-foreground/70">{r.location_code?.Valid ? r.location_code.String : "—"}</AdminTd>
              <AdminTd className="font-semibold">{r.available_qty}</AdminTd>
              <AdminTd className="text-foreground/70">{r.reserved_qty}</AdminTd>
              <AdminTd className="text-foreground/70">{r.incoming_qty}</AdminTd>
              <AdminTd className="text-foreground/70">{new Date(r.updated_at).toLocaleString()}</AdminTd>
              <AdminTd className="text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl font-medium transition h-9 px-3 text-xs border border-border hover:bg-secondary/10"
                    onClick={() => onAdjust(r)}
                    disabled={busy}
                  >
                    Adjust
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl font-medium transition h-9 px-3 text-xs border border-border hover:bg-secondary/10"
                    onClick={() => onReserve(r)}
                    disabled={busy}
                  >
                    Reserve
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl font-medium transition h-9 px-3 text-xs border border-border hover:bg-secondary/10"
                    onClick={() => onRelease(r)}
                    disabled={busy}
                  >
                    Release
                  </button>

                  <ConfirmDangerButton
                    disabled={busy}
                    confirmText={`Delete inventory item for ${r.location_name ?? `location #${r.location_id}`}?`}
                    onConfirm={() => onDelete(r)}
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