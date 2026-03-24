import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminProductHubApi } from "@/features/admin/products/api/adminProductHubApi";

export const productHubKeys = {
  bySlug: (slug: string) => ["admin", "products", "hub", "slug", slug] as const,
  images: (id: number) => ["admin", "products", "hub", id, "images"] as const,
  categories: (id: number) => ["admin", "products", "hub", id, "categories"] as const,
  tags: (id: number) => ["admin", "products", "hub", id, "tags"] as const,
  attrs: (id: number) => ["admin", "products", "hub", id, "attribute-values"] as const,
  variants: (id: number) => ["admin", "products", "hub", id, "variants"] as const,
  variantAttrs: (id: number, variantId: number) => ["admin", "products", "hub", id, "variants", variantId, "attribute-values"] as const,
};

export const useAdminProductBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: slug ? productHubKeys.bySlug(slug) : ["admin", "products", "hub", "slug", "disabled"],
    queryFn: () => adminProductHubApi.getBySlug(slug as string),
    enabled: !!slug,
  });
};

export const useUpdateAdminProduct = (slug: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; body: Parameters<typeof adminProductHubApi.updateProduct>[1] }) =>
      adminProductHubApi.updateProduct(args.id, args.body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
      await qc.invalidateQueries({ queryKey: ["admin", "products", "list"] });
    },
  });
};

export const useProductImages = (id: number | undefined) => {
  return useQuery({
    queryKey: typeof id === "number" ? productHubKeys.images(id) : ["admin", "products", "hub", "images", "disabled"],
    queryFn: () => adminProductHubApi.listImages(id as number),
    enabled: typeof id === "number",
  });
};

export const useAddProductImage = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { file: File; is_primary?: boolean; sort_order?: number }) => adminProductHubApi.addImage(id, args.file, args),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.images(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useDeleteProductImage = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: number) => adminProductHubApi.deleteImage(id, imageId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.images(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useSetPrimaryProductImage = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: number) => adminProductHubApi.setPrimaryImage(id, imageId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.images(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useProductCategories = (id: number | undefined) => {
  return useQuery({
    queryKey: typeof id === "number" ? productHubKeys.categories(id) : ["admin", "products", "hub", "categories", "disabled"],
    queryFn: () => adminProductHubApi.getCategories(id as number),
    enabled: typeof id === "number",
  });
};

export const useAddProductCategories = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (category_ids: number[]) => adminProductHubApi.addCategories(id, category_ids),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.categories(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useRemoveProductCategory = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cat_id: number) => adminProductHubApi.removeCategory(id, cat_id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.categories(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useProductTags = (id: number | undefined) => {
  return useQuery({
    queryKey: typeof id === "number" ? productHubKeys.tags(id) : ["admin", "products", "hub", "tags", "disabled"],
    queryFn: () => adminProductHubApi.getTags(id as number),
    enabled: typeof id === "number",
  });
};

export const useSetProductTags = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tag_names: string[]) => adminProductHubApi.setTags(id, tag_names),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.tags(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useRemoveProductTag = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tag_id: number) => adminProductHubApi.removeTag(id, tag_id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.tags(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useProductAttributeValues = (id: number | undefined) => {
  return useQuery({
    queryKey: typeof id === "number" ? productHubKeys.attrs(id) : ["admin", "products", "hub", "attrs", "disabled"],
    queryFn: () => adminProductHubApi.getAttributeValues(id as number),
    enabled: typeof id === "number",
  });
};

export const useSetProductAttributeValues = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attribute_value_ids: number[]) => adminProductHubApi.setAttributeValues(id, attribute_value_ids),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.attrs(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useProductVariants = (id: number | undefined) => {
  return useQuery({
    queryKey: typeof id === "number" ? productHubKeys.variants(id) : ["admin", "products", "hub", "variants", "disabled"],
    queryFn: () => adminProductHubApi.listVariants(id as number),
    enabled: typeof id === "number",
  });
};

export const useCreateVariant = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof adminProductHubApi.createVariant>[1]) => adminProductHubApi.createVariant(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.variants(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useUpdateVariant = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { variant_id: number; body: Parameters<typeof adminProductHubApi.updateVariant>[2] }) =>
      adminProductHubApi.updateVariant(id, args.variant_id, args.body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.variants(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useDeleteVariant = (slug: string, id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variant_id: number) => adminProductHubApi.deleteVariant(id, variant_id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.variants(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};

export const useVariantAttributeValues = (id: number | undefined, variantId: number | undefined) => {
  return useQuery({
    queryKey:
      typeof id === "number" && typeof variantId === "number"
        ? productHubKeys.variantAttrs(id, variantId)
        : ["admin", "products", "hub", "variant-attrs", "disabled"],
    queryFn: () => adminProductHubApi.getVariantAttributeValues(id as number, variantId as number),
    enabled: typeof id === "number" && typeof variantId === "number",
  });
};

export const useSetVariantAttributeValues = (slug: string, id: number, variantId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attribute_value_ids: number[]) => adminProductHubApi.setVariantAttributeValues(id, variantId, attribute_value_ids),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productHubKeys.variantAttrs(id, variantId) });
      await qc.invalidateQueries({ queryKey: productHubKeys.variants(id) });
      await qc.invalidateQueries({ queryKey: productHubKeys.bySlug(slug) });
    },
  });
};