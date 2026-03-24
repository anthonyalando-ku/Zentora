import { http } from "@/core/api";

export type CreateProductPayload = {
  name: string;
  description?: string | null;
  short_description?: string | null;
  brand_id: number;
  base_price: number;
  status: "active" | "draft" | "archived";
  is_featured: boolean;
  is_digital: boolean;
  category_ids: number[];
  tag_names?: string[];
  attribute_value_ids?: number[];
  variants: Array<{
    sku: string;
    price: number;
    weight?: number;
    is_active?: boolean;
    attribute_value_ids?: number[];
    quantity: number;
    location_id?: number;
  }>;
  discount?: {
    discount_id?: number;
    name?: string;
    code?: string;
  };
};

export type CreatedProduct = {
  id: number;
  name: string;
  slug: string;
};

export const adminCreateProductApi = {
  create: async (payload: CreateProductPayload, images: File[]) => {
    const form = new FormData();
    form.append("data", JSON.stringify(payload));
    images.forEach((file) => form.append("images", file));

    return await http.post("/admin/catalog/products", form, {
      headers: { "Content-Type": "multipart/form-data" },
    } as any);
  },
};

// create: async (payload: CreateProductPayload, images: File[]) => {
//   const form = new FormData();

//   form.append("data", JSON.stringify(payload));

//   images.forEach((file) => {
//     form.append("images", file);
//   });

//   return await http.post("/admin/catalog/products", form);
// };