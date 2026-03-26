import { Link } from "react-router-dom";
import { useMemo } from "react";
import logo from "@/assets/zentora_logo_clear.png";

type CatalogCategoryLink = {
  id: string | number;
  name: string;
};

type FooterProps = {
  catalogCategories?: CatalogCategoryLink[];
};

export const Footer = ({ catalogCategories = [] }: FooterProps) => {

  const randomCategories = useMemo(() => {
    return [...catalogCategories]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [catalogCategories]);

  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="Zentora" className="h-8 w-8 object-contain" />
              <span className="font-bold text-lg text-primary">Zentora</span>
            </div>

            <p className="text-sm text-foreground/60 leading-relaxed mb-4">
              Your one-stop marketplace for quality products at great prices.
            </p>

            <p className="text-xs text-foreground/50">
              Secure payments • Fast delivery • Easy returns
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Shop</h3>

            <ul className="space-y-2">

              <li>
                <Link
                  to="/products"
                  className="text-sm text-foreground/60 hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>

              {randomCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category_id=${cat.id}`}
                    className="text-sm text-foreground/60 hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Account</h3>

            <ul className="space-y-2">

              <li>
                <Link to="/account" className="text-sm text-foreground/60 hover:text-primary">
                  My Account
                </Link>
              </li>

              <li>
                <Link to="/account/orders" className="text-sm text-foreground/60 hover:text-primary">
                  Orders
                </Link>
              </li>

              <li>
                <Link to="/cart" className="text-sm text-foreground/60 hover:text-primary">
                  Cart
                </Link>
              </li>

              <li>
                <Link to="/checkout" className="text-sm text-foreground/60 hover:text-primary">
                  Checkout
                </Link>
              </li>

            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Support</h3>

            <ul className="space-y-2">

              <li>
                <Link to="/help" className="text-sm text-foreground/60 hover:text-primary">
                  Help Center
                </Link>
              </li>

              <li>
                <Link to="/contact" className="text-sm text-foreground/60 hover:text-primary">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link to="/returns" className="text-sm text-foreground/60 hover:text-primary">
                  Returns
                </Link>
              </li>

              <li>
                <Link to="/track-order" className="text-sm text-foreground/60 hover:text-primary">
                  Track Order
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-sm text-foreground/50">
            © {new Date().getFullYear()} Zentora. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-sm text-foreground/50 hover:text-primary">
              Privacy Policy
            </Link>

            <Link to="/terms" className="text-sm text-foreground/50 hover:text-primary">
              Terms of Service
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};