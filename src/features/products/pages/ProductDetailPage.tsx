import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { Badge, Rating } from "@/shared/components/ui";
import { mockProducts } from "@/shared/constants/mockProducts";
import { useCartStore } from "@/features/cart/store/cartStore";
import { ProductCard } from "@/features/products/components/ProductCard";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const product = mockProducts.find((p) => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-foreground/50 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90">
            Browse Products
          </Link>
        </div>
      </MainLayout>
    );
  }

  const related = mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-border">
              <img
                src={product.images[selectedImage] ?? product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? "border-primary" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.badge && (
              <Badge variant={product.badge} className="mb-3">{product.badge}</Badge>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <Rating value={product.rating} size="md" showCount reviewCount={product.reviewCount} />
              <span className="text-sm text-foreground/40">|</span>
              <span className={`text-sm font-medium ${product.inStock ? "text-green-500" : "text-destructive"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">KSh {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-foreground/40 line-through">KSh {product.originalPrice.toLocaleString()}</span>
                  <Badge variant="sale">-{discount}%</Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-foreground/70 leading-relaxed mb-6">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium capitalize">
                  {tag}
                </span>
              ))}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  className="w-10 h-11 flex items-center justify-center hover:bg-secondary/10 transition-colors disabled:opacity-50"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <button
                  className="w-10 h-11 flex items-center justify-center hover:bg-secondary/10 transition-colors"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <button
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg font-medium transition h-11 px-6 text-sm ${
                  added
                    ? "bg-green-500 text-white"
                    : product.inStock
                    ? "bg-primary text-white hover:opacity-90"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {added ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>
            <button
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg font-medium transition h-11 px-6 text-sm border border-border hover:bg-secondary/10"
              onClick={() => { addItem(product, quantity); navigate("/checkout"); }}
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
