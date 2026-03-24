import type { VariantDraft } from "@/features/admin/products/store/productWizardStore";

const cartesian = (arrays: number[][]): number[][] => {
  if (arrays.length === 0) return [];
  return arrays.reduce<number[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
    [[]]
  );
};

export const buildVariantDrafts = (args: {
  dimensionAttributeIds: number[];
  selectedValueIdsByAttribute: Record<number, number[]>;
  valueIdToLabel: Record<number, string>;
  basePrice: number | null;
  defaultLocationId: number | null;
}): VariantDraft[] => {
  const valueGroups: number[][] = args.dimensionAttributeIds.map((attrId) => args.selectedValueIdsByAttribute[attrId] ?? []);
  if (valueGroups.some((g) => g.length === 0)) return [];

  const combos = cartesian(valueGroups);

  return combos.map((combo) => {
    const labels = combo.map((vid) => args.valueIdToLabel[vid] ?? `#${vid}`);
    const name = labels.join(" - ");

    const temp_id = `tmp_${combo.join("_")}`;

    // SKU suggestion: NAME-like, later editable
    const sku = labels
      .join("-")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);

    return {
      temp_id,
      name,
      sku: sku || temp_id,
      price: args.basePrice,
      weight: null,
      is_active: true,
      attribute_value_ids: combo,
      quantity: 0,
      location_id: args.defaultLocationId,
    };
  });
};