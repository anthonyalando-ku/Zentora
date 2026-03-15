import { http } from "@/core/api";

export type NullableString = {
  String: string;
  Valid: boolean;
};

export type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
};

export type ProductCategoryRef = {
  id: number;
  name: string;
};

export type ProductTagRef = {
  id: number;
  name: string;
};

export type ProductVariantRef = {
  id: number;
  name: string;
};

export type ProductDetailBySlug = {
  id: number;
  name: string;
  slug: string;

  description?: NullableString;
  short_description?: NullableString;

  brand_id?: { Int64: number; Valid: boolean };
  base_price: number;

  status: string;
  is_featured: boolean;
  is_digital: boolean;

  rating: number;
  review_count: number;

  images: ProductImage[];
  categories: ProductCategoryRef[];
  tags: ProductTagRef[];

  attribute_values?: Array<{ id: number; name: string }>;
  variants?: ProductVariantRef[];

  created_at: string;
  updated_at: string;
};

export type NullableFloat64 = { Float64: number; Valid: boolean };

export type ProductVariant = {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  weight?: NullableFloat64;
  is_active: boolean;
  created_at: string;

  [k: string]: unknown;
};

export type NullableStringField = { String: string; Valid: boolean };

export type VariantStockSummary = {
  variant_id: number;
  available_qty: number;
  reserved_qty: number;
  incoming_qty: number;
  [k: string]: unknown;
};

export type VariantInventoryRow = {
  id: number;
  variant_id: number;
  location_id: number;
  available_qty: number;
  reserved_qty: number;
  incoming_qty: number;
  updated_at: string;
  location_name?: string;
  location_code?: NullableStringField;

  [k: string]: unknown;
};

export type VariantStock = VariantStockSummary;

const isStockSummary = (v: unknown): v is VariantStockSummary => {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  return (
    "variant_id" in v &&
    "available_qty" in v &&
    "reserved_qty" in v &&
    "incoming_qty" in v
  );
};

const sumInventoryRows = (variantId: number, rows: VariantInventoryRow[]): VariantStockSummary => {
  const summed = rows.reduce(
    (acc, r) => {
      acc.available_qty += Number(r.available_qty ?? 0);
      acc.reserved_qty += Number(r.reserved_qty ?? 0);
      acc.incoming_qty += Number(r.incoming_qty ?? 0);
      return acc;
    },
    { available_qty: 0, reserved_qty: 0, incoming_qty: 0 }
  );

  return {
    variant_id: variantId,
    ...summed,
  };
};

export const productDetailApi = {
  getBySlug: async (slug: string) => {
    const { data } = await http.get<ProductDetailBySlug>(`/catalog/products/slug/${slug}`);
    return data;
  },

  getVariants: async (productId: number, activeOnly = true) => {
    const { data } = await http.get<ProductVariant[]>(
      `/catalog/products/${productId}/variants`,
      { params: { active_only: activeOnly } }
    );
    return data;
  },

  /**
   * Preferred:
   *   GET /catalog/inventory/variants/:variant_id/stock  -> returns summary object
   *
   * Fallback (if preferred fails):
   *   GET /catalog/inventory/variants/:variant_id        -> returns rows per location
   *
   * Always returns a normalized VariantStockSummary.
   */
  getVariantStock: async (variantId: number): Promise<VariantStockSummary> => {
    // 1) Try summary endpoint first
    try {
      const { data } = await http.get<unknown>(`/catalog/inventory/variants/${variantId}/stock`);

      if (isStockSummary(data)) {
        return {
          variant_id: Number(data.variant_id ?? variantId),
          available_qty: Number(data.available_qty ?? 0),
          reserved_qty: Number(data.reserved_qty ?? 0),
          incoming_qty: Number(data.incoming_qty ?? 0),
        };
      }

      // If interceptor didn't unwrap and we got {data: {...}}
      if (data && typeof data === "object" && !Array.isArray(data) && "data" in data) {
        const inner = (data as { data?: unknown }).data;
        if (isStockSummary(inner)) {
          return {
            variant_id: Number(inner.variant_id ?? variantId),
            available_qty: Number(inner.available_qty ?? 0),
            reserved_qty: Number(inner.reserved_qty ?? 0),
            incoming_qty: Number(inner.incoming_qty ?? 0),
          };
        }
      }

      // If the summary endpoint returns unexpected shape, fall through to fallback.
    } catch {
      // ignore and fallback
    }

    // 2) Fallback to full inventory rows endpoint and sum
    try {
      const { data } = await http.get<unknown>(`/catalog/inventory/variants/${variantId}`);

      const rows = Array.isArray(data) ? (data as VariantInventoryRow[]) : null;

      if (rows) return sumInventoryRows(variantId, rows);

      // If interceptor didn't unwrap and we got {data: [...]}
      if (data && typeof data === "object" && !Array.isArray(data) && "data" in data) {
        const inner = (data as { data?: unknown }).data;
        if (Array.isArray(inner)) return sumInventoryRows(variantId, inner as VariantInventoryRow[]);
      }
    } catch {
      // ignore
    }

    // 3) Final fallback: no stock
    return { variant_id: variantId, available_qty: 0, reserved_qty: 0, incoming_qty: 0 };
  },
};