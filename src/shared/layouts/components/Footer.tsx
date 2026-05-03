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

const TikTokIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 32 32" aria-hidden="true">
    <path fill="currentColor" d="M19.11 17.59c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.21-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.44.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.87c.14.18 1.93 2.95 4.68 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z"/>
    <path fill="currentColor" d="M16.03 3C8.86 3 3.03 8.82 3.03 15.99c0 2.28.6 4.5 1.74 6.46L3 29l6.73-1.76a12.9 12.9 0 0 0 6.3 1.62h.01c7.17 0 13-5.82 13-12.99C29.04 8.82 23.2 3 16.03 3Zm0 23.62h-.01a10.77 10.77 0 0 1-5.5-1.52l-.39-.23-3.99 1.04 1.06-3.89-.25-.4a10.8 10.8 0 0 1-1.65-5.71c0-5.95 4.84-10.79 10.79-10.79 2.88 0 5.58 1.12 7.61 3.16a10.72 10.72 0 0 1 3.15 7.62c0 5.95-4.84 10.79-10.82 10.79Z"/>
  </svg>
);

// Payment method pill — text-based, no external icon deps
const PaymentBadge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center px-2 py-1 rounded border border-border bg-muted/40 text-[10px] font-semibold text-foreground/50 tracking-wide">
    {label}
  </span>
);

export const Footer = ({ catalogCategories = [] }: FooterProps) => {
  const randomCategories = useMemo(() => {
    return [...catalogCategories]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
  }, [catalogCategories]);

  const whatsappHref = `https://wa.me/254795974591?text=${encodeURIComponent("Hi Zentora, I need help with my order.")}`;

  return (
    <footer className="border-t border-border bg-muted/20 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand col — spans 2 on mobile, 1 on md+ */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src={logo} alt="Zentora" className="h-7 w-7 object-contain" />
              <span className="font-bold text-base text-foreground">Zentora</span>
            </Link>

            <p className="text-xs text-foreground/55 leading-relaxed mb-5 max-w-[220px]">
              Quality products delivered fast across Kenya. Order via the site or reach us directly on WhatsApp.
            </p>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#25D366] border border-[#25D366]/30 rounded-lg px-3 py-2 hover:bg-[#25D366]/8 transition-colors"
            >
              <WhatsAppIcon />
              Chat with us
            </a>

            {/* Social links */}
            <div className="flex items-center gap-2 mt-4">
              <a
                href="https://www.tiktok.com/@zentora"
                target="_blank"
                rel="noreferrer"
                aria-label="Zentora on TikTok"
                className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center text-foreground/40 hover:text-foreground/80 hover:border-foreground/20 transition-colors"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://www.facebook.com/zentora"
                target="_blank"
                rel="noreferrer"
                aria-label="Zentora on Facebook"
                className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center text-foreground/40 hover:text-[#1877F2] hover:border-[#1877F2]/30 transition-colors"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-3">Shop</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?feed_type=deals" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  Today's Deals
                </Link>
              </li>
              <li>
                <Link to="/products?feed_type=new_arrivals" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products?feed_type=best_sellers" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  Best Sellers
                </Link>
              </li>
              {randomCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products?category_id=${cat.id}`}
                    className="text-xs text-foreground/60 hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-3">Account</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/account" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/account#orders" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-3">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/help" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-xs text-foreground/60 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-foreground/60 hover:text-primary transition-colors"
                >
                  Track My Order
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-foreground/60 hover:text-primary transition-colors"
                >
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-foreground/40 order-2 sm:order-1">
            © {new Date().getFullYear()} Zentora. All rights reserved.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <PaymentBadge label="M-PESA" />
            <PaymentBadge label="VISA" />
            <PaymentBadge label="MASTERCARD" />
            <PaymentBadge label="AIRTEL" />
          </div>
        </div>

      </div>
    </footer>
  );
};