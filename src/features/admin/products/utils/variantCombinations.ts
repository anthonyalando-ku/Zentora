import type { VariantDraft } from "@/features/admin/products/store/productWizardStore";

const cartesian = (arrays: number[][]): number[][] => {
  if (arrays.length === 0) return [];
  return arrays.reduce<number[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
    [[]]
  );
};

// ─── SKU helpers ──────────────────────────────────────────────────────────────

/**
 * Shorten a label to a readable slug segment, max `maxLen` chars.
 */
const slugSegment = (label: string, maxLen = 6): string => {
  const clean = label.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return clean.slice(0, maxLen);
};


const comboHash = (valueIds: number[]): string => {
  let h = 0x811c9dc5;
  for (const v of valueIds) {
    h ^= v & 0xff;          h = (Math.imul(h, 0x01000193)) >>> 0;
    h ^= (v >>> 8) & 0xff;  h = (Math.imul(h, 0x01000193)) >>> 0;
    h ^= (v >>> 16) & 0xff; h = (Math.imul(h, 0x01000193)) >>> 0;
    h ^= (v >>> 24) & 0xff; h = (Math.imul(h, 0x01000193)) >>> 0;
  }
  return h.toString(36).toUpperCase().padStart(5, "0").slice(-5);
};

const buildSku = (labels: string[], valueIds: number[]): string => {
  const segments = labels
    .slice(0, 4)
    .map((l) => slugSegment(l, 6))
    .filter(Boolean);

  const hash = comboHash(valueIds); // no sort — order matters

  return segments.length > 0
    ? `${segments.join("-")}-${hash}`
    : hash;
};

// ─── Main export ──────────────────────────────────────────────────────────────

export const buildVariantDrafts = (args: {
  dimensionAttributeIds: number[];
  selectedValueIdsByAttribute: Record<number, number[]>;
  valueIdToLabel: Record<number, string>;
  basePrice: number | null;
  defaultLocationId: number | null;
}): VariantDraft[] => {
  const valueGroups: number[][] = args.dimensionAttributeIds.map(
    (attrId) => args.selectedValueIdsByAttribute[attrId] ?? []
  );
  if (valueGroups.some((g) => g.length === 0)) return [];

  const combos = cartesian(valueGroups);

  return combos.map((combo) => {
    const labels = combo.map((vid) => args.valueIdToLabel[vid] ?? String(vid));
    const name   = labels.join(" / ");
    const sku    = buildSku(labels, combo);

    return {
      temp_id: `tmp_${combo.join("_")}`,
      name,
      sku,
      price:               args.basePrice,
      weight:              null,
      is_active:           true,
      attribute_value_ids: combo,
      quantity:            0,
      location_id:         args.defaultLocationId,
    };
  });
};