import type { Product, ProductCategory } from '@/shared/types/product';

export const mockProducts: Product[] = [
  // Electronics
  {
    id: 'prod-001',
    name: 'Nova X12 Smartphone',
    slug: 'nova-x12-smartphone',
    description: 'A flagship smartphone with a 6.7" AMOLED display, 108MP triple camera system, 5G connectivity, and 5000mAh battery that lasts all day.',
    price: 799.99,
    originalPrice: 999.99,
    discount: 20,
    category: 'electronics',
    images: [
      'https://picsum.photos/seed/prod1a/600/600',
      'https://picsum.photos/seed/prod1b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod1a/600/600',
    rating: 4.7,
    reviewCount: 2341,
    inStock: true,
    badge: 'sale',
    tags: ['smartphone', '5g', 'camera', 'flagship'],
  },
  {
    id: 'prod-002',
    name: 'SoundWave Pro Headphones',
    slug: 'soundwave-pro-headphones',
    description: 'Premium over-ear wireless headphones with active noise cancellation, 40-hour battery life, and studio-quality sound. Perfect for music lovers and commuters.',
    price: 249.99,
    originalPrice: 329.99,
    discount: 24,
    category: 'electronics',
    images: [
      'https://picsum.photos/seed/prod2a/600/600',
      'https://picsum.photos/seed/prod2b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod2a/600/600',
    rating: 4.8,
    reviewCount: 1876,
    inStock: true,
    badge: 'hot',
    tags: ['headphones', 'wireless', 'noise-cancelling', 'audio'],
  },
  {
    id: 'prod-003',
    name: 'UltraBook Pro 15',
    slug: 'ultrabook-pro-15',
    description: 'Thin and light laptop powered by the latest 13th-gen processor, 16GB RAM, 512GB SSD, and a stunning 15.6" 4K touchscreen display.',
    price: 1299.99,
    category: 'electronics',
    images: [
      'https://picsum.photos/seed/prod3a/600/600',
      'https://picsum.photos/seed/prod3b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod3a/600/600',
    rating: 4.6,
    reviewCount: 987,
    inStock: true,
    badge: 'new',
    tags: ['laptop', 'ultrabook', '4k', 'productivity'],
  },
  {
    id: 'prod-004',
    name: 'Pulse Smartwatch Series 5',
    slug: 'pulse-smartwatch-series-5',
    description: 'Advanced smartwatch with health monitoring, GPS, always-on AMOLED display, and up to 7-day battery life. Track your fitness and stay connected.',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    category: 'electronics',
    images: [
      'https://picsum.photos/seed/prod4a/600/600',
      'https://picsum.photos/seed/prod4b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod4a/600/600',
    rating: 4.4,
    reviewCount: 3102,
    inStock: true,
    badge: 'sale',
    tags: ['smartwatch', 'fitness', 'gps', 'health'],
  },

  // Clothing
  {
    id: 'prod-005',
    name: 'Alpine Tech Jacket',
    slug: 'alpine-tech-jacket',
    description: 'Waterproof and windproof jacket with breathable membrane technology. Ideal for outdoor adventures, hiking, and everyday wear in any weather.',
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    category: 'clothing',
    images: [
      'https://picsum.photos/seed/prod5a/600/600',
      'https://picsum.photos/seed/prod5b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod5a/600/600',
    rating: 4.5,
    reviewCount: 634,
    inStock: true,
    badge: 'sale',
    tags: ['jacket', 'waterproof', 'outdoor', 'hiking'],
  },
  {
    id: 'prod-006',
    name: 'Classic Linen Shirt',
    slug: 'classic-linen-shirt',
    description: 'Breathable 100% linen shirt with a relaxed fit. Available in multiple colors, perfect for casual outings or smart-casual occasions.',
    price: 59.99,
    category: 'clothing',
    images: [
      'https://picsum.photos/seed/prod6a/600/600',
      'https://picsum.photos/seed/prod6b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod6a/600/600',
    rating: 4.3,
    reviewCount: 421,
    inStock: true,
    badge: 'new',
    tags: ['shirt', 'linen', 'casual', 'summer'],
  },
  {
    id: 'prod-007',
    name: 'StrideX Running Shoes',
    slug: 'stridex-running-shoes',
    description: 'Lightweight performance running shoes with responsive foam cushioning, breathable mesh upper, and durable rubber outsole for maximum comfort on every run.',
    price: 119.99,
    originalPrice: 149.99,
    discount: 20,
    category: 'clothing',
    images: [
      'https://picsum.photos/seed/prod7a/600/600',
      'https://picsum.photos/seed/prod7b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod7a/600/600',
    rating: 4.6,
    reviewCount: 1204,
    inStock: true,
    badge: 'hot',
    tags: ['shoes', 'running', 'athletic', 'footwear'],
  },

  // Home
  {
    id: 'prod-008',
    name: 'ArcLight Floor Lamp',
    slug: 'arclight-floor-lamp',
    description: 'Modern arc floor lamp with adjustable brightness and color temperature. Features a brushed gold finish and a minimalist design that complements any interior.',
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    category: 'home',
    images: [
      'https://picsum.photos/seed/prod8a/600/600',
      'https://picsum.photos/seed/prod8b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod8a/600/600',
    rating: 4.2,
    reviewCount: 318,
    inStock: true,
    badge: 'sale',
    tags: ['lamp', 'lighting', 'modern', 'interior'],
  },
  {
    id: 'prod-009',
    name: 'Velvet Throw Cushion Set',
    slug: 'velvet-throw-cushion-set',
    description: 'Set of 4 premium velvet cushions with feather-filled inserts. Available in a curated palette of contemporary colors to elevate your living space.',
    price: 49.99,
    category: 'home',
    images: [
      'https://picsum.photos/seed/prod9a/600/600',
      'https://picsum.photos/seed/prod9b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod9a/600/600',
    rating: 4.4,
    reviewCount: 552,
    inStock: true,
    badge: 'new',
    tags: ['cushions', 'velvet', 'home-decor', 'living-room'],
  },

  // Beauty
  {
    id: 'prod-010',
    name: 'Lumière Glow Serum',
    slug: 'lumiere-glow-serum',
    description: 'Brightening vitamin C serum with hyaluronic acid and niacinamide. Reduces dark spots, evens skin tone, and delivers a radiant, hydrated complexion.',
    price: 44.99,
    originalPrice: 59.99,
    discount: 25,
    category: 'beauty',
    images: [
      'https://picsum.photos/seed/prod10a/600/600',
      'https://picsum.photos/seed/prod10b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod10a/600/600',
    rating: 4.9,
    reviewCount: 4870,
    inStock: true,
    badge: 'hot',
    tags: ['serum', 'vitamin-c', 'skincare', 'brightening'],
  },

  // Sports
  {
    id: 'prod-011',
    name: 'CoreFlex Yoga Mat Pro',
    slug: 'coreflex-yoga-mat-pro',
    description: 'Extra-thick 6mm non-slip yoga mat made from eco-friendly TPE material. Provides superior cushioning and grip for yoga, pilates, and floor workouts.',
    price: 39.99,
    category: 'sports',
    images: [
      'https://picsum.photos/seed/prod11a/600/600',
      'https://picsum.photos/seed/prod11b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod11a/600/600',
    rating: 4.5,
    reviewCount: 2109,
    inStock: true,
    badge: 'new',
    tags: ['yoga', 'fitness', 'mat', 'pilates'],
  },

  // Books
  {
    id: 'prod-012',
    name: "The Design Thinker's Playbook",
    slug: 'the-design-thinkers-playbook',
    description: 'A comprehensive guide to design thinking methodology for innovators and problem-solvers. Packed with practical frameworks, real-world case studies, and actionable exercises.',
    price: 24.99,
    originalPrice: 34.99,
    discount: 28,
    category: 'books',
    images: [
      'https://picsum.photos/seed/prod12a/600/600',
      'https://picsum.photos/seed/prod12b/600/600',
    ],
    thumbnail: 'https://picsum.photos/seed/prod12a/600/600',
    rating: 4.7,
    reviewCount: 893,
    inStock: true,
    badge: 'sale',
    tags: ['design', 'thinking', 'innovation', 'business'],
  },
];

export type MockCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
};

export const mockCategories: MockCategory[] = [
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://picsum.photos/seed/cat-electronics/400/300',
    productCount: 4,
  },
  {
    id: 'cat-clothing',
    name: 'Clothing',
    slug: 'clothing',
    image: 'https://picsum.photos/seed/cat-clothing/400/300',
    productCount: 3,
  },
  {
    id: 'cat-home',
    name: 'Home',
    slug: 'home',
    image: 'https://picsum.photos/seed/cat-home/400/300',
    productCount: 2,
  },
  {
    id: 'cat-beauty',
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://picsum.photos/seed/cat-beauty/400/300',
    productCount: 1,
  },
  {
    id: 'cat-sports',
    name: 'Sports',
    slug: 'sports',
    image: 'https://picsum.photos/seed/cat-sports/400/300',
    productCount: 1,
  },
  {
    id: 'cat-books',
    name: 'Books',
    slug: 'books',
    image: 'https://picsum.photos/seed/cat-books/400/300',
    productCount: 1,
  },
];

export const getProductsByCategory = (category: ProductCategory): Product[] =>
  mockProducts.filter(p => p.category === category);

export const getProductBySlug = (slug: string): Product | undefined =>
  mockProducts.find(p => p.slug === slug);
