import { http } from "@/core/api";

export type NullableInt = { Int64: number; Valid: boolean };
export type NullableString = { String: string; Valid: boolean };

export type AdminCategory = {
  id: number;
  name: string;
  slug?: string | null;
  parent_id?: NullableInt | null;
  image_url?: string | null;
  is_active?: boolean;
};

export type AdminBrand = {
  id: number;
  name: string;
  slug?: string | null;
  logo_url?: NullableString | null;
  is_active?: boolean;
};

export type AdminAttribute = {
  id: number;
  name: string;
  slug?: string | null;
};

export type AdminAttributeValue = {
  id: number;
  attribute_id: number;
  value: string;
  slug?: string | null;
  sort_order?: number | null;
};

export const adminCatalogApi = {
  // Categories
  listCategories: async (): Promise<AdminCategory[]> => {
    const { data } = await http.get("/catalog/categories");
    return data;
  },
  createCategory: async (body: { name: string; slug?: string; parent_id?: number }): Promise<AdminCategory> => {
    const { data } = await http.post("/catalog/categories", body);
    return data;
  },
  deleteCategory: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/catalog/categories/${id}`);
    return data;
  },

  // Brands
  listBrands: async (): Promise<AdminBrand[]> => {
    const { data } = await http.get("/catalog/brands");
    return data;
  },
  createBrand: async (body: { name: string; slug?: string; logo_url?: string }): Promise<AdminBrand> => {
    const { data } = await http.post("/admin/catalog/brands", body);
    return data;
  },
  deleteBrand: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/catalog/brands/${id}`);
    return data;
  },

  // Attributes
  listAttributes: async (): Promise<AdminAttribute[]> => {
    const { data } = await http.get("/catalog/attributes");
    return data;
  },
  createAttribute: async (body: { name: string; slug?: string }): Promise<AdminAttribute> => {
    const { data } = await http.post("/catalog/attributes", body);
    return data;
  },
  deleteAttribute: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/catalog/attributes/${id}`);
    return data;
  },

  // Attribute Values
  listAttributeValues: async (attributeId: number): Promise<AdminAttributeValue[]> => {
    const { data } = await http.get(`/catalog/attributes/${attributeId}/values`);
    return data;
  },
  createAttributeValue: async (
    attributeId: number,
    body: { value: string; slug?: string; sort_order?: number }
  ): Promise<AdminAttributeValue> => {
    const { data } = await http.post(`/catalog/attributes/${attributeId}/values`, body);
    return data;
  },
  deleteAttributeValue: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/catalog/attribute-values/${id}`);
    return data;
  },
};