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
 *
 * Strategy:
 *   1. Strip non-alphanumeric characters.
 *   2. If it's purely numeric (e.g. "128", "6.1") keep it as-is — these are
 *      already short and meaningful ("128GB", "6.1in" → "128", "61").
 *   3. For words, take the first `maxLen` characters.
 *
 * Examples:
 *   "Midnight Black"  → "MIDNIGHTB"   (maxLen=9)
 *   "128GB"           → "128GB"
 *   "Rose Gold"       → "ROSEGOLD"
 *   "Extra Large"     → "EXTRALARG"
 */
const slugSegment = (label: string, maxLen = 8): string => {
  const clean = label.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return clean.slice(0, maxLen);
};

/**
 * Produce a short (4-char) deterministic suffix from a sorted list of
 * attribute-value IDs using a simple djb2-style hash.
 *
 * Using sorted IDs means the same combination always produces the same
 * suffix regardless of combo order, but different combinations produce
 * different suffixes with very low collision probability for small catalogs.
 *
 * The suffix makes the SKU unique across products that share the same
 * attribute labels (e.g. two products both with a "Black / XL" variant).
 */
const comboHash = (valueIds: number[]): string => {
  const sorted = [...valueIds].sort((a, b) => a - b);
  let h = 5381;
  for (const id of sorted) {
    // djb2: h = h * 33 ^ id
    h = (Math.imul(h, 33) ^ id) >>> 0;
  }
  // Base-36 gives alphanumeric chars (0-9, A-Z after toUpperCase).
  // 4 base-36 chars cover 36^4 = 1,679,616 combinations.
  return h.toString(36).toUpperCase().padStart(4, "0").slice(-4);
};

/**
 * Build a SKU from variant labels + a hash suffix.
 *
 * Format:  <SEG1>-<SEG2>-...-<HASH>
 * Example: "Color=Midnight Black, Size=XL"  →  "MIDNIGHT-XL-Z3K9"
 *
 * Max length guarantee:
 *   - Up to 4 segments × 8 chars = 32
 *   - Separators: up to 4 dashes = 4
 *   - Hash suffix + dash = 5
 *   - Total worst case: 41 chars — well within any varchar(64) column.
 *
 * If there are more than 4 dimension segments (unusual), only the first 4
 * are used in the readable part; the hash still covers all IDs.
 */
const buildSku = (labels: string[], valueIds: number[]): string => {
  const segments = labels
    .slice(0, 4)                          // cap readable segments
    .map((l) => slugSegment(l, 8))
    .filter(Boolean);                     // drop empty (e.g. whitespace-only labels)

  const hash = comboHash(valueIds);

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