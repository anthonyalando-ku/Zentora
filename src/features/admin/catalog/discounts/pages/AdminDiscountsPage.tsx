import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { AdminModal } from "@/features/admin/shared/components/AdminModal";
import { DiscountTable } from "@/features/admin/catalog/discounts/components/DiscountTable";
import { DiscountForm } from "@/features/admin/catalog/discounts/components/DiscountForm";
import { DiscountTargetsModal } from "@/features/admin/catalog/discounts/components/DiscountTargetsModal";
import { useDiscounts } from "@/features/admin/catalog/discounts/hooks/useDiscounts";
import { useCreateDiscount, useDeleteDiscount, useSetDiscountTargets, useUpdateDiscount } from "@/features/admin/catalog/discounts/hooks/useDiscountMutations";
import type { Discount, DiscountTargetInput } from "@/features/admin/catalog/discounts/api/adminDiscountsApi";

const toIsoOrUndefined = (dtLocal: string) => {
  // dtLocal like "2026-06-01T00:00"
  if (!dtLocal) return undefined;
  const d = new Date(dtLocal);
  if (!Number.isFinite(d.getTime())) return undefined;
  return d.toISOString();
};

const AdminDiscountsPage = () => {
  const [filter, setFilter] = useState({ active_only: false, code: "" });

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);

  const [openTargets, setOpenTargets] = useState(false);
  const [targetsDiscount, setTargetsDiscount] = useState<Discount | null>(null);

  const query = useDiscounts(filter);

  const create = useCreateDiscount();
  const update = useUpdateDiscount();
  const del = useDeleteDiscount();
  const setTargets = useSetDiscountTargets();

  const rows = useMemo(() => query.data ?? [], [query.data]);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Discounts"
        subtitle="Create discount rules and assign targets (category/brand supported)."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Catalog", href: "/admin/catalog/discounts" },
          { label: "Discounts", href: "/admin/catalog/discounts" },
        ]}
        action={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setOpenForm(true);
            }}
            className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            New Discount
          </button>
        }
      />

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-6">
            <label className="text-xs font-medium text-foreground/60">Search by code</label>
            <input
              className="mt-1 w-full h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={filter.code}
              onChange={(e) => setFilter((s) => ({ ...s, code: e.target.value }))}
              placeholder="e.g. SUMMER"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-medium text-foreground/60">Active only</label>
            <div className="mt-1 h-11 rounded-xl border border-border bg-background px-3 flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-primary"
                checked={filter.active_only}
                onChange={(e) => setFilter((s) => ({ ...s, active_only: e.target.checked }))}
              />
              <span className="text-sm text-foreground/70">Show active discounts</span>
            </div>
          </div>

          <div className="md:col-span-3 flex gap-2">
            <button
              type="button"
              className="flex-1 h-11 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-medium"
              onClick={() => setFilter({ active_only: false, code: "" })}
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
        </div>
      </div>

      {query.isLoading ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">
          Loading discounts…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-10 text-center">
          <div className="text-base font-semibold">No discounts</div>
          <div className="text-sm text-foreground/60 mt-1">Create a discount to run promotions.</div>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setOpenForm(true);
            }}
            className="mt-4 inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          >
            Create Discount
          </button>
        </div>
      ) : (
        <DiscountTable
          rows={rows}
          deleting={del.isPending}
          onDelete={(id) => del.mutateAsync(id)}
          onEdit={(d) => {
            setEditing(d);
            setOpenForm(true);
          }}
          onTargets={(d) => {
            setTargetsDiscount(d);
            setOpenTargets(true);
          }}
        />
      )}

      {/* Create/Edit Modal */}
      <AdminModal
        open={openForm}
        title={editing ? "Edit Discount" : "New Discount"}
        subtitle={editing ? "Update discount details." : "Create a discount rule."}
        onClose={() => setOpenForm(false)}
      >
        <DiscountForm
          initial={editing}
          isSubmitting={create.isPending || update.isPending}
          onSubmit={async (values) => {
            const body = {
              name: values.name,
              code: values.code.trim() ? values.code.trim() : undefined,
              discount_type: values.discount_type,
              value: Number(values.value),
              min_order_amount: values.min_order_amount === "" ? undefined : Number(values.min_order_amount),
              max_redemptions: values.max_redemptions === "" ? undefined : Number(values.max_redemptions),
              starts_at: values.starts_at ? toIsoOrUndefined(values.starts_at) : undefined,
              ends_at: values.ends_at ? toIsoOrUndefined(values.ends_at) : undefined,
              is_active: Boolean(values.is_active),
            };

            if (editing) {
              await update.mutateAsync({ id: editing.id, body });
            } else {
              await create.mutateAsync(body as any);
            }

            setOpenForm(false);
            setEditing(null);
          }}
        />
      </AdminModal>

      {/* Targets Modal */}
      <DiscountTargetsModal
        open={openTargets}
        discount={targetsDiscount}
        onClose={() => setOpenTargets(false)}
        isSaving={setTargets.isPending}
        onSave={async (targets: DiscountTargetInput[]) => {
          if (!targetsDiscount) return;
          await setTargets.mutateAsync({ id: targetsDiscount.id, targets });
        }}
      />
    </div>
  );
};

export default AdminDiscountsPage;