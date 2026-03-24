import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminPageHeader } from "@/features/admin/shared/components/AdminPageHeader";
import { UpsertInventoryModal } from "@/features/admin/inventory/variantInventory/UpsertInventoryModal";
import { AdjustStockModal } from "@/features/admin/inventory/variantInventory/AdjustStockModal";
import { InventoryTable } from "@/features/admin/inventory/variantInventory/InventoryTable";
import {
  useAdjustStock,
  useDeleteInventoryItem,
  useInventoryByVariant,
  useReleaseStock,
  useReserveStock,
  useStockSummary,
  useUpsertInventoryItem,
} from "@/features/admin/inventory/hooks/useVariantInventory";
import type { VariantInventoryRow } from "@/features/admin/inventory/api/adminInventoryApi";

const askQty = (label: string) => {
  const v = prompt(label, "1");
  if (!v) return null;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
};

const VariantInventoryPage = () => {
  const { variantId } = useParams<{ variantId: string }>();
  const id = variantId ? Number(variantId) : undefined;

  const [openUpsert, setOpenUpsert] = useState(false);
  const [openAdjust, setOpenAdjust] = useState(false);
  const [adjustRow, setAdjustRow] = useState<VariantInventoryRow | null>(null);

  const invQuery = useInventoryByVariant(id);
  const stockQuery = useStockSummary(id);

  const upsert = useUpsertInventoryItem(id as number);
  const adjust = useAdjustStock(id as number);
  const reserve = useReserveStock(id as number);
  const release = useReleaseStock(id as number);
  const del = useDeleteInventoryItem(id as number);

  const rows = useMemo(() => invQuery.data ?? [], [invQuery.data]);

  const busy = upsert.isPending || adjust.isPending || reserve.isPending || release.isPending || del.isPending;

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={`Variant Inventory${id ? ` — #${id}` : ""}`}
        subtitle="Manage stock across locations for this variant."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Inventory", href: "/admin/inventory/locations" },
          { label: "Variant", href: id ? `/admin/inventory/variant/${id}` : "/admin/inventory/variant" },
        ]}
        action={
          <div className="inline-flex items-center gap-2">
            <Link
              to="/admin/inventory/locations"
              className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
            >
              Locations
            </Link>
            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
              title="Product pages not implemented yet"
            >
              View Product
            </Link>
            <button
              type="button"
              onClick={() => setOpenUpsert(true)}
              className="inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
              disabled={!id || busy}
            >
              Upsert Inventory
            </button>
          </div>
        }
      />

      {/* Stock summary */}
      <div className="rounded-2xl border border-border bg-background shadow-sm p-5">
        {stockQuery.isLoading ? (
          <div className="text-sm text-foreground/60">Loading stock summary…</div>
        ) : stockQuery.data ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="text-xs text-foreground/60">Available</div>
              <div className="text-2xl font-bold text-primary mt-1">{stockQuery.data.available_qty}</div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="text-xs text-foreground/60">Reserved</div>
              <div className="text-2xl font-bold text-foreground mt-1">{stockQuery.data.reserved_qty}</div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="text-xs text-foreground/60">Incoming</div>
              <div className="text-2xl font-bold text-foreground mt-1">{stockQuery.data.incoming_qty}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-foreground/60">No stock summary.</div>
        )}
      </div>

      {/* Inventory table */}
      {invQuery.isLoading ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-6 text-sm text-foreground/60">Loading inventory…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-10 text-center">
          <div className="text-base font-semibold">No inventory records</div>
          <div className="text-sm text-foreground/60 mt-1">Upsert inventory to add stock for this variant at a location.</div>
          <button
            type="button"
            onClick={() => setOpenUpsert(true)}
            className="mt-4 inline-flex items-center justify-center rounded-xl font-semibold transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
            disabled={!id || busy}
          >
            Upsert Inventory
          </button>
        </div>
      ) : (
        <InventoryTable
          rows={rows}
          busy={busy}
          onAdjust={(row) => {
            setAdjustRow(row);
            setOpenAdjust(true);
          }}
          onReserve={async (row) => {
            const qty = askQty("Reserve qty:");
            if (!qty) return;
            await reserve.mutateAsync({ location_id: row.location_id, qty });
          }}
          onRelease={async (row) => {
            const qty = askQty("Release qty:");
            if (!qty) return;
            await release.mutateAsync({ location_id: row.location_id, qty });
          }}
          onDelete={async (row) => {
            await del.mutateAsync({ location_id: row.location_id });
          }}
        />
      )}

      <UpsertInventoryModal
        open={openUpsert}
        onClose={() => setOpenUpsert(false)}
        isSubmitting={upsert.isPending}
        onSubmit={async (values) => {
          await upsert.mutateAsync(values);
          setOpenUpsert(false);
        }}
      />

      <AdjustStockModal
        open={openAdjust}
        onClose={() => {
          setOpenAdjust(false);
          setAdjustRow(null);
        }}
        isSubmitting={adjust.isPending}
        locationName={adjustRow?.location_name}
        onSubmit={async (values) => {
          if (!adjustRow) return;
          await adjust.mutateAsync({ location_id: adjustRow.location_id, delta: values.delta });
          setOpenAdjust(false);
          setAdjustRow(null);
        }}
      />
    </div>
  );
};

export default VariantInventoryPage;