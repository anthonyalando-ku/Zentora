import { http } from "@/core/api";

export type AttributeValue = {
  id: number;
  attribute_id: number;
  value: string;
};

export type AttributeWithValues = {
  id: number;
  name: string;
  slug?: string;
  is_variant_dimension: boolean;
  values: AttributeValue[];
};

export const adminAttributesWithValuesApi = {
  list: async (): Promise<AttributeWithValues[]> => {
    const { data } = await http.get("/catalog/attributes?with_values=true");
    console.log("Fetched attributes with values:", data);
    return data;
  },
};