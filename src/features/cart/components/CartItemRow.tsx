import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { StorefrontImage } from "@/shared/components/StorefrontImage";
import type { UnifiedCartItem } from "@/features/cart/hooks/useCart";

type CartItemRowProps = {
  item: UnifiedCartItem;
  /** True while a change to this line (or the whole cart) is in flight. */
  busy: boolean;
  onQuantity: (next: number) => void;
  onRemove: () => void;
};

const ksh = (n: number) => "KSh " + n.toLocaleString();

export function CartItemRow({ item, busy, onQuantity, onRemove }: CartItemRowProps) {
  const href = item.slug ? `/products/${item.slug}` : "/products";
  const meta = [item.brand, item.category, item.mode === "guest" ? item.sku : undefined].filter(Boolean).join(" · ");

  return (
    <li className="cart-item" aria-busy={busy}>
      <Link to={href} className="cart-item-image" tabIndex={-1} aria-hidden="true">
        <StorefrontImage src={item.thumbnail} alt="" eager />
      </Link>
      <div className="cart-item-body">
        <div className="cart-item-head">
          <div className="min-w-0">
            <Link to={href} className="cart-item-name">{item.name}</Link>
            {meta && <p className="cart-item-meta">{meta}</p>}
          </div>
          <button type="button" className="cart-item-remove" onClick={onRemove} disabled={busy} aria-label={`Remove ${item.name} from cart`}>
            <Trash2 aria-hidden="true" />
          </button>
        </div>
        <div className="cart-item-foot">
          <div className="cart-stepper" role="group" aria-label={`Quantity of ${item.name}`}>
            <button type="button" onClick={() => onQuantity(item.quantity - 1)} disabled={busy || item.quantity <= 1} aria-label={`Decrease quantity of ${item.name}`}><Minus aria-hidden="true" /></button>
            <output aria-live="polite">{item.quantity}</output>
            <button type="button" onClick={() => onQuantity(item.quantity + 1)} disabled={busy} aria-label={`Increase quantity of ${item.name}`}><Plus aria-hidden="true" /></button>
          </div>
          <div className="cart-item-price">
            <strong>{ksh(item.unit_price * item.quantity)}</strong>
            {item.quantity > 1 && <span>{ksh(item.unit_price)} each</span>}
          </div>
        </div>
      </div>
    </li>
  );
}
