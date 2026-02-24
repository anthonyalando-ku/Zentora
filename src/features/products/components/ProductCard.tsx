import { Link } from "react-router-dom";
import { Badge, Rating } from "@/shared/components/ui";
import { useCartStore } from "@/features/cart/store/cartStore";
import { cn } from "@/shared/utils/cn";
import type { Product } from "@/shared/types/product";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={cn("group relative bg-background rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300", className)}>
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
        <button
          className="w-full inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-9 px-3 text-xs bg-primary text-white hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
          onClick={() => addItem(product)}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};
