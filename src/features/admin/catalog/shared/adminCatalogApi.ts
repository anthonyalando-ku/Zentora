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
  is_variant_dimension?: boolean;
};

export type AdminAttributeValue = {
  id: number;
  attribute_id: number;
  value: string;
  slug?: string | null;
  sort_order?: number | null;
};

export type CategoryInput = { name: string; slug?: string; parent_id?: number; image_url?: string; image?: File };
function categoryBody(input: CategoryInput) {
  const { image, ...data } = input;
  if (!image) return { body: data, config: undefined };
  const body = new FormData();
  body.append("data", JSON.stringify(data));
  body.append("image", image);
  return { body, config: { headers: { "Content-Type": "multipart/form-data" } } };
}

export const adminCatalogApi = {
  // Categories
  listCategories: async (): Promise<AdminCategory[]> => {
    const { data } = await http.get("/catalog/categories");
    return data;
  },
  createCategory: async (input: CategoryInput): Promise<AdminCategory> => {
    const { body, config } = categoryBody(input);
    const { data } = await http.post("/admin/catalog/categories", body, config);
    return data;
  },
  updateCategory: async (id: number, input: CategoryInput): Promise<AdminCategory> => {
    const { body, config } = categoryBody(input);
    const { data } = await http.put("/admin/catalog/categories/" + id, body, config);
    return data;
  },
  deleteCategory: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/categories/${id}`);
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
    const { data } = await http.delete(`/admin/catalog/brands/${id}`);
    return data;
  },

  // Attributes
  listAttributes: async (): Promise<AdminAttribute[]> => {
    const { data } = await http.get("/catalog/attributes");
    return data;
  },
  createAttribute: async (body: { name: string; slug?: string }): Promise<AdminAttribute> => {
    const { data } = await http.post("/admin/catalog/attributes", body);
    return data;
  },
  deleteAttribute: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/attributes/${id}`);
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
    const { data } = await http.post(`/admin/catalog/attributes/${attributeId}/values`, body);
    return data;
  },
  deleteAttributeValue: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/attribute-values/${id}`);
    return data;
  },
};