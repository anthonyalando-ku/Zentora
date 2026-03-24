import { http } from "@/core/api";

export type SqlNullString = { String: string; Valid: boolean };
export type SqlNullInt64 = { Int64: number; Valid: boolean };
export type SqlNullFloat64 = { Float64: number; Valid: boolean };

export type RelatedRef = { id: number; name: string, value?: string };

export type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
};

export type ProductDetail = {
  id: number;
  name: string;
  slug: string;

  description?: SqlNullString | null;
  short_description?: SqlNullString | null;
  brand_id?: SqlNullInt64 | null;

  base_price: number;
  status: "active" | "draft" | "archived";
  is_featured: boolean;
  is_digital: boolean;

  rating?: number;
  review_count?: number;

  created_at: string;
  updated_at: string;

  images?: ProductImage[];
  categories?: RelatedRef[];
  tags?: RelatedRef[];
  attribute_values?: RelatedRef[];
  variants?: RelatedRef[];
};

export type Tag = { id: number; name: string; slug: string };

export type Variant = {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  weight?: SqlNullFloat64 | null;
  is_active: boolean;
  created_at: string;
};

export const adminProductHubApi = {
  getBySlug: async (slug: string): Promise<ProductDetail> => {
    const { data } = await http.get(`/catalog/products/slug/${encodeURIComponent(slug)}`);
    return data;
  },

  updateProduct: async (
    id: number,
    body: {
      name?: string;
      description?: string | null;
      short_description?: string | null;
      brand_id?: number;
      base_price?: number;
      status?: "active" | "draft" | "archived";
      is_featured?: boolean;
      is_digital?: boolean;
    }
  ): Promise<ProductDetail> => {
    const { data } = await http.put(`/admin/catalog/products/${id}`, body);
    return data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/products/${id}`);
    return data;},

  // Images
  listImages: async (id: number): Promise<ProductImage[]> => {
    const { data } = await http.get(`/catalog/products/${id}/images`);
    return data;
  },

  addImage: async (id: number, file: File, opts?: { is_primary?: boolean; sort_order?: number }): Promise<ProductImage> => {
    const form = new FormData();
    form.append("image", file);
    if (typeof opts?.is_primary === "boolean") form.append("is_primary", String(opts.is_primary));
    if (typeof opts?.sort_order === "number") form.append("sort_order", String(opts.sort_order));

    const { data } = await http.post(`/admin/catalog/products/${id}/images`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    } as any);
    return data;
  },

  deleteImage: async (id: number, imageId: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/products/${id}/images/${imageId}`);
    return data;
  },

  setPrimaryImage: async (id: number, imageId: number): Promise<void> => {
    const { data } = await http.put(`/admin/catalog/products/${id}/images/${imageId}/primary`, { image_id: imageId });
    return data;
  },

  // Categories
  getCategories: async (id: number): Promise<RelatedRef[]> => {
    const { data } = await http.get(`/catalog/products/${id}/categories`);
    return data;
  },
  addCategories: async (id: number, category_ids: number[]): Promise<void> => {
    const { data } = await http.post(`/admin/catalog/products/${id}/categories`, { category_ids });
    return data;
  },
  removeCategory: async (id: number, cat_id: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/products/${id}/categories/${cat_id}`);
    return data;
  },

  // Tags
  getTags: async (id: number): Promise<Tag[]> => {
    const { data } = await http.get(`/catalog/products/${id}/tags`);
    return data;
  },
  setTags: async (id: number, tag_names: string[]): Promise<void> => {
    const { data } = await http.put(`/admin/catalog/products/${id}/tags`, { tag_names });
    return data;
  },
  removeTag: async (id: number, tag_id: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/products/${id}/tags/${tag_id}`);
    return data;
  },

  // Product attribute values
  getAttributeValues: async (id: number): Promise<RelatedRef[]> => {
    const { data } = await http.get(`/catalog/products/${id}/attribute-values`);
    console.log("Fetched product attribute values for product", id, ":", data);
    return data;
  },
  setAttributeValues: async (id: number, attribute_value_ids: number[]): Promise<void> => {
    const { data } = await http.put(`/admin/catalog/products/${id}/attribute-values`, { attribute_value_ids });
    return data;
  },

  // Variants
  listVariants: async (id: number, active_only?: boolean): Promise<Variant[]> => {
    const qs = active_only ? `?active_only=true` : "";
    const { data } = await http.get(`/catalog/products/${id}/variants${qs}`);
    return data;
  },
  createVariant: async (
    id: number,
    body: { sku: string; price: number; weight?: number; is_active?: boolean; attribute_value_ids?: number[] }
  ): Promise<Variant> => {
    const { data } = await http.post(`/admin/catalog/products/${id}/variants`, body);
    return data;
  },
  updateVariant: async (
    id: number,
    variant_id: number,
    body: { sku?: string; price?: number; weight?: number; is_active?: boolean }
  ): Promise<Variant> => {
    const { data } = await http.put(`/admin/catalog/products/${id}/variants/${variant_id}`, body);
    return data;
  },
  deleteVariant: async (id: number, variant_id: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/products/${id}/variants/${variant_id}`);
    return data;
  },

  // Variant attribute values
  getVariantAttributeValues: async (id: number, variant_id: number): Promise<RelatedRef[]> => {
    const { data } = await http.get(`/catalog/products/${id}/variants/${variant_id}/attribute-values`);
    return data;
  },
  setVariantAttributeValues: async (id: number, variant_id: number, attribute_value_ids: number[]): Promise<void> => {
    const { data } = await http.put(`/admin/catalog/products/${id}/variants/${variant_id}/attribute-values`, { attribute_value_ids });
    return data;
  },
};