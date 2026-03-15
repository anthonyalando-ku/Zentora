export type ProductCategory = string;

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;

  // DB-driven category (e.g. "Electronics", "Phones", etc.)
  category: ProductCategory;

  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge?: "new" | "hot" | "sale";
  tags: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};