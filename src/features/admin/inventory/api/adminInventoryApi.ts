import { http } from "@/core/api";

export type SqlNullString = { String: string; Valid: boolean };

export type InventoryLocation = {
  id: number;
  name: string;
  location_code: SqlNullString;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
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
  location_code?: SqlNullString;
};

export type VariantStockSummary = {
  variant_id: number;
  available_qty: number;
  reserved_qty: number;
  incoming_qty: number;
};

export const adminInventoryApi = {
  // Locations
  listLocations: async (): Promise<InventoryLocation[]> => {
    const { data } = await http.get("/catalog/inventory/locations");
    return data;
  },

  getLocation: async (id: number): Promise<InventoryLocation> => {
    const { data } = await http.get(`/catalog/inventory/locations/${id}`);
    return data;
  },

  createLocation: async (body: { name: string; location_code?: string; is_active?: boolean }): Promise<InventoryLocation> => {
    const { data } = await http.post("/admin/catalog/inventory/locations", body);
    return data;
  },

  updateLocation: async (
    id: number,
    body: { name?: string; location_code?: string; is_active?: boolean }
  ): Promise<InventoryLocation> => {
    const { data } = await http.put(`/admin/catalog/inventory/locations/${id}`, body);
    return data;
  },

  deleteLocation: async (id: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/inventory/locations/${id}`);
    return data;
  },

  // Variant inventory
  listInventoryByVariant: async (variantId: number): Promise<VariantInventoryRow[]> => {
    const { data } = await http.get(`/catalog/inventory/variants/${variantId}`);
    return data;
  },

  getStockSummary: async (variantId: number): Promise<VariantStockSummary> => {
    const { data } = await http.get(`/catalog/inventory/variants/${variantId}/stock`);
    return data;
  },

  // Upsert inventory item
  upsertInventoryItem: async (body: {
    variant_id: number;
    location_id: number;
    available_qty: number;
    reserved_qty: number;
    incoming_qty: number;
  }): Promise<VariantInventoryRow> => {
    const { data } = await http.put("/admin/catalog/inventory/items", body);
    return data;
  },

  // Stock operations
  adjustStock: async (variantId: number, locationId: number, body: { delta: number }): Promise<any> => {
    const { data } = await http.put(`/admin/catalog/inventory/${variantId}/${locationId}/adjust`, body);
    return data;
  },

  reserveStock: async (variantId: number, locationId: number, qty: number): Promise<any> => {
    const { data } = await http.put(`/admin/catalog/inventory/variants/${variantId}/locations/${locationId}/reserve?qty=${encodeURIComponent(String(qty))}`, {});
    return data;
  },

  releaseStock: async (variantId: number, locationId: number, qty: number): Promise<any> => {
    const { data } = await http.put(`/admin/catalog/inventory/variants/${variantId}/locations/${locationId}/release?qty=${encodeURIComponent(String(qty))}`, {});
    return data;
  },

  deleteInventoryItem: async (variantId: number, locationId: number): Promise<void> => {
    const { data } = await http.delete(`/admin/catalog/inventory/variants/${variantId}/locations/${locationId}`);
    return data;
  },
};