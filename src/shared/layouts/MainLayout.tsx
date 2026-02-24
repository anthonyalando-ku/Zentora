import { type ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { useCartStore } from "@/features/cart/store/cartStore";
import logo from "@/assets/zentora_logo_clear.png";

type MainLayoutProps = {
  children: ReactNode;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/products" },
];

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const cartCount = useCartStore((state) => state.items.reduce((acc, i) => acc + i.quantity, 0));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={logo} alt="Zentora" className="h-9 w-9 object-contain" />
              <span className="font-bold text-xl text-primary hidden sm:block">Zentora</span>
            </Link>

            {/* Nav links - desktop */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.href ? "text-primary" : "text-foreground/70"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search - desktop */}
            <div className="hidden md:flex flex-1 max-w-sm">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-secondary/10 transition-colors"
                aria-label="Cart"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                to="/account"
                className="p-2 rounded-full hover:bg-secondary/10 transition-colors"
                aria-label="Account"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-secondary/10 transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu"
              >
                {menuOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                to={link.href}
                className={cn(
                  "block text-sm font-medium py-1 transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-foreground/70"
                )}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
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
    </div>
  );
};
