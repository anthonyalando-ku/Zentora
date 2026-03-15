import { http } from "@/core/api";

export type CatalogCategory = {
  id: string | number;
  name: string;
  slug?: string;
  image_url?: string | null;
  parent_id?: string | number | null;
  is_active?: boolean;
};

export type CatalogBrand = {
  id: string | number;
  name: string;
  slug?: string;
  image_url?: string | null;
  is_active?: boolean;
};

export type CatalogAttribute = {
  id: string | number;
  name: string;
  slug?: string;
};

export type CatalogProductListItem = {
  product_id: number;
  name: string;
  slug: string;
  primary_image?: string | null;
  price: number;
  discount?: number | null;
  rating?: number | null;
  review_count?: number | null;
  inventory_status?: "in_stock" | "out_of_stock" | "low_stock" | string;
  brand?: string | null;
  category?: string | null;
};

export type CatalogProductsResponse = {
  items: CatalogProductListItem[];
  page: number;
  size: number; // backend uses "size"
  sort?: string;
  total: number;
};

export type GetCatalogProductsParams = {
  page?: number;
  page_size?: number; // frontend param name, maps to backend size via query
  sort?: string;
  feed_type?: string;

  // filters
  status?: string;
  brand_id?: string | number;
  brand_ids?: string; // comma separated
  category_id?: string | number;
  is_featured?: boolean;
  q?: string;

  // price
  price_min?: number;
  price_max?: number;

  // rating
  min_rating?: number;

  // promotion/inventory
  discount_only?: boolean;
  in_stock_only?: boolean;

  // tags
  tag_ids?: string; // comma separated
};

export const catalogProductsApi = {
  getProducts: async (params: GetCatalogProductsParams) => {
    // Backend expects page + page_size (per architecture plan), but response uses size.
    const { data } = await http.get<CatalogProductsResponse>("/catalog/products", {
      params,
    });
    return data;
  },

  getBrands: async () => {
    const { data } = await http.get<CatalogBrand[]>("/catalog/brands");
    return data;
  },

  getCategories: async () => {
    const { data } = await http.get<CatalogCategory[]>("/catalog/categories", {
      params: { active_only: true },
    });
    return data;
  },

  getAttributes: async () => {
    const { data } = await http.get<CatalogAttribute[]>("/catalog/attributes");
    return data;
  },
};