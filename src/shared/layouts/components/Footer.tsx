import { Link } from "react-router-dom";
import logo from "@/assets/zentora_logo_clear.png";

export const Footer = () => (
  <footer className="border-t border-border bg-background mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="Zentora" className="h-8 w-8 object-contain" />
            <span className="font-bold text-lg text-primary">Zentora</span>
          </div>
          <p className="text-sm text-foreground/60 leading-relaxed">
            Your one-stop shop for quality products at great prices.
          </p>
        </div>
        {/* Shop */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Shop</h3>
          <ul className="space-y-2">
            {["All Products", "Electronics", "Clothing", "Home & Living"].map((item) => (
              <li key={item}>
                <Link to="/products" className="text-sm text-foreground/60 hover:text-primary transition-colors">{item}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Account */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Account</h3>
          <ul className="space-y-2">
            {[
              { label: "My Account", href: "/account" },
              { label: "Orders", href: "/account/orders" },
              { label: "Cart", href: "/cart" },
              { label: "Checkout", href: "/checkout" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="text-sm text-foreground/60 hover:text-primary transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Support */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Support</h3>
          <ul className="space-y-2">
            {["Help Center", "Contact Us", "Returns", "Track Order"].map((item) => (
              <li key={item}>
                <span className="text-sm text-foreground/60">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-foreground/50">© {new Date().getFullYear()} Zentora. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground/50">Privacy Policy</span>
          <span className="text-sm text-foreground/50">Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
);
