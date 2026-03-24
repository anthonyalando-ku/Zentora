export const adminKeys = {
  catalog: {
    categories: ["admin", "catalog", "categories"] as const,
    brands: ["admin", "catalog", "brands"] as const,
    attributes: ["admin", "catalog", "attributes"] as const,
    attributeValues: (attributeId: number) => ["admin", "catalog", "attributes", attributeId, "values"] as const,
  },
};