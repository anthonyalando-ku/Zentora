import type { DeliverySnapshot } from "@/core/api/services/delivery";
import { OrderDeliveryInformation } from "@/features/delivery/DeliveryInformation";
import { Link } from "react-router-dom";
import { CheckCircleIcon, ShoppingCartIcon, HomeIcon } from "@heroicons/react/24/solid";

interface OrderSuccessProps {
  delivery?: DeliverySnapshot | null;
  orderId?: string | number;
  itemCount?: number;
  totalPrice?: number;
}

export const OrderSuccess = ({ orderId, itemCount, totalPrice, delivery }: OrderSuccessProps) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      {/* Animated check icon */}
      <div className="mb-6 animate-scale-up">
        <CheckCircleIcon className="w-24 h-24 mx-auto text-green-600" />
      </div>

      {/* Success heading */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">Order Created Successfully!</h2>

      {/* Optional order summary */}
      {orderId && (
        <p className="text-foreground/70 mb-4">
          Order <span className="font-semibold">#{orderId}</span> • {itemCount} item{itemCount !== 1 ? "s" : ""} •{" "}
          <span className="font-semibold">KSh {totalPrice?.toLocaleString()}</span>
        </p>
      )}

      <p className="text-sm">Order total (excluding delivery)</p>
      <OrderDeliveryInformation snapshot={delivery} />

      {/* Thank you message */}
      <p className="text-foreground/60 mb-8">
        Thanks! Your order has been placed. We’ll contact you for delivery and payment confirmation.
      </p>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-11 px-6 text-sm bg-primary text-white hover:opacity-90"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          Continue Shopping
        </Link>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-11 px-6 text-sm border border-border hover:bg-secondary/10"
        >
          <HomeIcon className="w-5 h-5" />
          Back Home
        </Link>
      </div>
    </div>
  );
};