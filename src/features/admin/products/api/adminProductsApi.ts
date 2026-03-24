import { http } from "@/core/api";

export type InventoryStatus = "in_stock" | "out_of_stock" | "low_stock";
export type ProductStatus = "active" | "draft" | "archived";

export type AdminProductListItem = {
  product_id: number;
  name: string;
  slug: string;
  primary_image: string | null;
  price: number;
  discount: number | null;
  rating: number | null;
  review_count: number | null;
  inventory_status: InventoryStatus;
  brand: string | null;
  category: string | null;
  status?: ProductStatus; // some backends include status; keep optional
  created_at?: string;    // optional; keep safe for UI
};

export type PaginatedProductsResponse = {
  items: AdminProductListItem[];
  total: number;
  page: number;
  size: number;
  sort: string;
};

export type ProductsListParams = {
  page: number;
  page_size: number;
  status?: string;
  brand_id?: number;
  category_id?: number;
  q?: string;
  price_min?: number;
  price_max?: number;
  min_rating?: number;
  discount_only?: boolean;
  in_stock_only?: boolean;
  is_featured?: boolean;
};

export const adminProductsApi = {
  listProducts: async (params: ProductsListParams): Promise<PaginatedProductsResponse> => {
    const sp = new URLSearchParams();

    sp.set("page", String(params.page));
    sp.set("page_size", String(params.page_size));

    if (params.status) sp.set("status", params.status);
    if (params.brand_id) sp.set("brand_id", String(params.brand_id));
    if (params.category_id) sp.set("category_id", String(params.category_id));
    if (params.q) sp.set("q", params.q);
    if (typeof params.price_min === "number") sp.set("price_min", String(params.price_min));
    if (typeof params.price_max === "number") sp.set("price_max", String(params.price_max));
    if (typeof params.min_rating === "number") sp.set("min_rating", String(params.min_rating));
    if (params.discount_only) sp.set("discount_only", "true");
    if (params.in_stock_only) sp.set("in_stock_only", "true");
    if (params.is_featured) sp.set("is_featured", "true");

    const { data } = await http.get(`/catalog/products?${sp.toString()}`);

    return data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/products/${id}`);
    return data; 
  },
};