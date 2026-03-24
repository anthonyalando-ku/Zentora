import { create } from "zustand";

export type ProductStatus = "active" | "draft" | "archived";

export type VariantDraft = {
  temp_id: string;
  name: string;
  sku: string;
  price: number | null;
  weight: number | null;
  is_active: boolean;
  attribute_value_ids: number[];
  quantity: number | null;
  location_id: number | null;
};

export type WizardImageDraft = {
  id: string; // client-only
  file: File;
  previewUrl: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type ProductWizardDraft = {
  // Step 1
  name: string;
  description: string;
  short_description: string;
  brand_id: number | null;
  base_price: number | null;
  status: ProductStatus;
  is_featured: boolean;
  is_digital: boolean;

  // Step 2
  category_ids: number[];
  tag_names: string[];

  // Step 3
  attribute_value_ids: number[];

  // Step 4
  variant_dimension_attribute_ids: number[];
  variant_dimension_value_ids: Record<number, number[]>;
  variants: VariantDraft[];

  // Step 5
  images: WizardImageDraft[];

  // Step 6
  discount_id: number | null; // existing discount selection
  discount_later: boolean; // if true, ignore discount_id
};

type ProductWizardState = {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  draft: ProductWizardDraft;

  setStep: (step: ProductWizardState["step"]) => void;
  nextStep: () => void;
  prevStep: () => void;

  updateDraft: (patch: Partial<ProductWizardDraft>) => void;
  resetDraft: () => void;

  // images helpers
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  setPrimaryImage: (id: string) => void;
  moveImage: (id: string, dir: "up" | "down") => void;
  cleanupPreviews: () => void;
};

const initialDraft: ProductWizardDraft = {
  name: "",
  description: "",
  short_description: "",
  brand_id: null,
  base_price: null,
  status: "draft",
  is_featured: false,
  is_digital: false,

  category_ids: [],
  tag_names: [],

  attribute_value_ids: [],

  variant_dimension_attribute_ids: [],
  variant_dimension_value_ids: {},
  variants: [],

  images: [],

  discount_id: null,
  discount_later: true,
};

const resequence = (images: WizardImageDraft[]) =>
  images.map((img, i) => ({ ...img, sortOrder: i })).sort((a, b) => a.sortOrder - b.sortOrder);

export const useProductWizardStore = create<ProductWizardState>((set, get) => ({
  step: 1,
  draft: initialDraft,

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: (Math.min(6, s.step + 1) as ProductWizardState["step"]) })),
  prevStep: () => set((s) => ({ step: (Math.max(1, s.step - 1) as ProductWizardState["step"]) })),

  updateDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),

  resetDraft: () => {
    // clean previews first
    const { cleanupPreviews } = get();
    cleanupPreviews();
    set({ step: 1, draft: initialDraft });
  },

  addImages: (files) => {
    set((s) => {
      const existing = s.draft.images;
      const next = [...existing];

      for (const f of files) {
        const id = `img_${crypto.randomUUID?.() ?? `${Date.now()}_${Math.random()}`}`;
        const previewUrl = URL.createObjectURL(f);
        next.push({
          id,
          file: f,
          previewUrl,
          isPrimary: next.length === 0, // first becomes primary
          sortOrder: next.length,
        });
      }

      // ensure exactly one primary
      if (next.length > 0 && !next.some((x) => x.isPrimary)) next[0].isPrimary = true;

      return { draft: { ...s.draft, images: resequence(next) } };
    });
  },

  removeImage: (id) => {
    set((s) => {
      const img = s.draft.images.find((x) => x.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);

      let next = s.draft.images.filter((x) => x.id !== id);

      // if primary removed, promote first
      if (next.length > 0 && !next.some((x) => x.isPrimary)) next[0] = { ...next[0], isPrimary: true };

      next = resequence(next);
      return { draft: { ...s.draft, images: next } };
    });
  },

  setPrimaryImage: (id) => {
    set((s) => {
      const next = s.draft.images.map((x) => ({ ...x, isPrimary: x.id === id }));
      return { draft: { ...s.draft, images: next } };
    });
  },

  moveImage: (id, dir) => {
    set((s) => {
      const arr = [...s.draft.images].sort((a, b) => a.sortOrder - b.sortOrder);
      const idx = arr.findIndex((x) => x.id === id);
      if (idx === -1) return s;

      const swapWith = dir === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= arr.length) return s;

      const tmp = arr[idx];
      arr[idx] = arr[swapWith];
      arr[swapWith] = tmp;

      return { draft: { ...s.draft, images: resequence(arr) } };
    });
  },

  cleanupPreviews: () => {
    const imgs = get().draft.images;
    for (const img of imgs) {
      try {
        URL.revokeObjectURL(img.previewUrl);
      } catch {
        // ignore
      }
    }
  },
}));