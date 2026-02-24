import { Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { Button, Badge, Rating } from "@/shared/components/ui";
import { mockProducts, mockCategories } from "@/shared/constants/mockProducts";
import { useCartStore } from "@/features/cart/store/cartStore";
import type { Product } from "@/shared/types/product";

const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-background rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={product.badge}>{product.badge}</Badge>
        </div>
      )}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="sale">-{discount}%</Badge>
        </div>
      )}

      <Link to={`/products/${product.slug}`} className="block overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm text-foreground line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <Rating value={product.rating} showCount reviewCount={product.reviewCount} className="mb-2" />
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-base text-primary">
            KSh {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-foreground/40 line-through">
              KSh {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <Button
          className="w-full text-xs h-9"
          onClick={() => addItem(product)}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const featuredProducts = mockProducts.slice(0, 8);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                New arrivals every week
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-foreground mb-6">
                Shop Smarter,{" "}
                <span className="text-primary">Live Better</span>
              </h1>
              <p className="text-lg text-foreground/60 leading-relaxed mb-8 max-w-lg">
                Discover thousands of quality products at unbeatable prices. Free delivery on orders over KSh 5,000.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-12 px-6 text-base bg-primary text-white hover:opacity-90"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products?badge=sale"
                  className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-12 px-6 text-base border border-border bg-transparent text-foreground hover:bg-secondary/10"
                >
                  View Deals
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-8">
                {[
                  { value: "10K+", label: "Products" },
                  { value: "50K+", label: "Customers" },
                  { value: "4.8★", label: "Rating" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-foreground/50">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://picsum.photos/seed/hero-zentora/600/500"
                  alt="Shop hero"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-6 bg-background rounded-2xl shadow-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-foreground/50">Free Shipping</div>
                    <div className="text-sm font-semibold">On orders over KSh 5,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Shop by Category</h2>
            <p className="text-foreground/50 mt-1">Find exactly what you're looking for</p>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockCategories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/5 group-hover:bg-primary/10 transition-colors">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-foreground">{category.name}</div>
                <div className="text-xs text-foreground/40">{category.productCount} items</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-primary/80 p-8 md:p-12">
          <div className="relative z-10 max-w-xl">
            <Badge variant="sale" className="mb-4">Limited Time Offer</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Up to 50% Off Electronics
            </h2>
            <p className="text-white/80 mb-6 text-lg">
              Grab the latest gadgets at half the price. Offer ends this weekend!
            </p>
            <Link
              to="/products?category=electronics"
              className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-12 px-6 text-base bg-white text-primary hover:bg-white/90"
            >
              Shop Electronics
            </Link>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
            <img
              src="https://picsum.photos/seed/banner-promo/400/400"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured Products</h2>
            <p className="text-foreground/50 mt-1">Handpicked products just for you</p>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-12 px-6 text-base border border-border bg-transparent text-foreground hover:bg-secondary/10"
          >
            Browse All Products
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🚚", title: "Free Delivery", desc: "On orders over KSh 5,000" },
              { icon: "🔄", title: "Easy Returns", desc: "30-day return policy" },
              { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
              { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-xs text-foreground/50">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;