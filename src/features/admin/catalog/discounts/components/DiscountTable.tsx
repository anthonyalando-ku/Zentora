import { AdminTable, AdminTableHead, AdminTd, AdminTh, AdminTr } from "@/features/admin/shared/components/AdminTable";
import { ConfirmDangerButton } from "@/features/admin/shared/components/ConfirmDangerButton";
import type { Discount } from "@/features/admin/catalog/discounts/api/adminDiscountsApi";

const fmtNull = (v: any) => (v?.Valid ? String(v.String ?? v.Int64 ?? v.Float64 ?? v.Time) : "—");
const fmtMoneyNull = (v: any) => (v?.Valid ? Number(v.Float64).toLocaleString() : "—");
const fmtDateNull = (v: any) => (v?.Valid ? new Date(v.Time).toLocaleString() : "—");

export const DiscountTable = ({
  rows,
  onEdit,
  onTargets,
  onDelete,
  deleting,
}: {
  rows: Discount[];
  onEdit: (d: Discount) => void;
  onTargets: (d: Discount) => void;
  onDelete: (id: number) => Promise<void> | void;
  deleting: boolean;
}) => {
  return (
    <AdminTable>
      <table className="min-w-full">
        <AdminTableHead>
          <tr>
            <AdminTh>Name</AdminTh>
            <AdminTh>Code</AdminTh>
            <AdminTh>Type</AdminTh>
            <AdminTh>Value</AdminTh>
            <AdminTh>Min Order</AdminTh>
            <AdminTh>Starts</AdminTh>
            <AdminTh>Ends</AdminTh>
            <AdminTh>Active</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </tr>
        </AdminTableHead>
        <tbody>
          {rows.map((d) => (
            <AdminTr key={d.id}>
              <AdminTd>
                <div className="font-medium text-foreground">{d.name}</div>
                <div className="text-xs text-foreground/50">ID: {d.id}</div>
              </AdminTd>
              <AdminTd className="text-foreground/70">{fmtNull(d.code)}</AdminTd>
              <AdminTd className="text-foreground/70">{d.discount_type}</AdminTd>
              <AdminTd className="text-foreground/70">
                {d.discount_type === "percentage" ? `${d.value}%` : d.value.toLocaleString()}
              </AdminTd>
              <AdminTd className="text-foreground/70">{fmtMoneyNull(d.min_order_amount)}</AdminTd>
              <AdminTd className="text-foreground/70">{fmtDateNull(d.starts_at)}</AdminTd>
              <AdminTd className="text-foreground/70">{fmtDateNull(d.ends_at)}</AdminTd>
              <AdminTd>
                <span
                  className={[
                    "text-xs font-semibold px-2.5 py-1 rounded-full border",
                    d.is_active ? "bg-green-500/10 border-green-500/20 text-green-700" : "bg-secondary/10 border-border text-foreground/60",
                  ].join(" ")}
                >
                  {d.is_active ? "Active" : "Inactive"}
                </span>
              </AdminTd>
              <AdminTd className="text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl font-medium transition h-9 px-3 text-xs border border-border hover:bg-secondary/10"
                    onClick={() => onEdit(d)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl font-medium transition h-9 px-3 text-xs border border-border hover:bg-secondary/10"
                    onClick={() => onTargets(d)}
                  >
                    Targets
                  </button>
                  <ConfirmDangerButton
                    disabled={deleting}
                    confirmText={`Delete discount "${d.name}"?`}
                    onConfirm={() => onDelete(d.id)}
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