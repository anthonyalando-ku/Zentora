import { Link } from "react-router-dom";
import { UserRound, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
export const HeaderActions = ({ cartCount }: { cartCount: number }) => {
  const authenticated = useAuthStore(s => s.isAuthenticated);
  return <div className="store-header-actions"><Link to="/account" aria-label="Account"><UserRound size={23} /><span>Account<small>{authenticated ? "My account" : "Sign in"}</small></span></Link><Link to="/cart" aria-label={"Cart, " + cartCount + " items"}><span className="store-cart-icon"><ShoppingCart size={24} />{cartCount > 0 && <b>{cartCount > 99 ? "99+" : cartCount}</b>}</span><span>Cart<small>{cartCount} items</small></span></Link></div>;
};
