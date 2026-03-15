import { http } from "@/core/api";

/**
 * Minimal category contract for Stage 1.
 * Backend likely returns more fields; we only model what we need.
 */
export type CatalogCategory = {
  id: string | number;
  name: string;
  slug?: string;
  image_url?: string | null;
  parent_id?: string | number | null;
  is_active?: boolean;
};

export const catalogApi = {
  getCategories: async () => {
    // Use active_only by default for public nav + homepage.
    const { data } = await http.get<CatalogCategory[]>("/catalog/categories", {
      params: { active_only: true },
    });
    return data;
  },
};