import { useId, useState, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Headphones, Instagram, ShoppingBag, UserRound, type LucideIcon } from "lucide-react";

import logo from "@/assets/zentora_logo_clear.png";

// Same number and prefilled message as before; social accounts match the Contact page.
const WHATSAPP_HREF = `https://wa.me/254795974591?text=${encodeURIComponent("Hi Zentora, I need help with my order.")}`;

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06Z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => <Instagram aria-hidden="true" />;

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path fill="currentColor" d="M19.11 17.59c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.21-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.44.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.87c.14.18 1.93 2.95 4.68 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z"/>
    <path fill="currentColor" d="M16.03 3C8.86 3 3.03 8.82 3.03 15.99c0 2.28.6 4.5 1.74 6.46L3 29l6.73-1.76a12.9 12.9 0 0 0 6.3 1.62h.01c7.17 0 13-5.82 13-12.99C29.04 8.82 23.2 3 16.03 3Zm0 23.62h-.01a10.77 10.77 0 0 1-5.5-1.52l-.39-.23-3.99 1.04 1.06-3.89-.25-.4a10.8 10.8 0 0 1-1.65-5.71c0-5.95 4.84-10.79 10.79-10.79 2.88 0 5.58 1.12 7.61 3.16a10.72 10.72 0 0 1 3.15 7.62c0 5.95-4.84 10.79-10.82 10.79Z"/>
  </svg>
);

const SOCIAL_LINKS = [
  { label: "TikTok", href: "https://www.tiktok.com/@zentorashopkenya", Icon: TikTokIcon },
  { label: "Facebook", href: "https://www.facebook.com/zentorashop", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/zentorashopkenya1", Icon: InstagramIcon },
];

type FooterLinkGroup = { title: string; Icon: LucideIcon; links: { label: string; to: string }[] };

const LINK_GROUPS: FooterLinkGroup[] = [
  { title: "Shop", Icon: ShoppingBag, links: [
    { label: "All Products", to: "/products" },
    { label: "Deals", to: "/collections/deals" },
    { label: "New Arrivals", to: "/collections/new_arrivals" },
    { label: "Best Sellers", to: "/collections/best_sellers" },
  ] },
  { title: "Account", Icon: UserRound, links: [
    { label: "My Account", to: "/account" },
    { label: "My Orders", to: "/account#orders" },
    { label: "Cart", to: "/cart" },
    { label: "Checkout", to: "/checkout" },
  ] },
  { title: "Support", Icon: Headphones, links: [
    { label: "Help Center", to: "/help" },
    { label: "Contact Us", to: "/contact" },
    { label: "About Us", to: "/about" },
    { label: "Return & Refund Policy", to: "/returns" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
  ] },
];

// Link groups collapse into accordions below this width.
const MOBILE_QUERY = "(max-width: 767px)";
const subscribeMobile = (onChange: () => void) => {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};
const useIsMobile = () => useSyncExternalStore(subscribeMobile, () => window.matchMedia(MOBILE_QUERY).matches, () => false);

const FooterLinks = ({ group: { title, Icon, links }, collapsible }: { group: FooterLinkGroup; collapsible: boolean }) => {
  const [open, setOpen] = useState(false);
  const id = useId();
  const expanded = !collapsible || open;
  const label = <><Icon aria-hidden="true" />{title}</>;
  return (
    <nav className="store-footer-group" aria-labelledby={id + "-title"}>
      <h2 id={id + "-title"}>
        {collapsible
          ? <button type="button" aria-expanded={open} aria-controls={id + "-links"} onClick={() => setOpen(v => !v)}>{label}<ChevronDown className="store-footer-chevron" aria-hidden="true" /></button>
          : label}
      </h2>
      <ul id={id + "-links"} hidden={!expanded}>
        {links.map(link => <li key={link.to}><Link to={link.to}>{link.label}</Link></li>)}
      </ul>
    </nav>
  );
};

export const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <footer className="store-footer">
      <div className="store-shell store-footer-main">
        <div className="store-footer-brand">
          <Link className="store-brand" to="/" aria-label="Zentora home">
            <img src={logo} alt="" />
            <span><strong>Zentora</strong><small>Everyday finds. All in one place.</small></span>
          </Link>
          <p>Everyday finds for your home, work and lifestyle. Order via the site or reach us directly on WhatsApp.</p>
          <a className="store-footer-whatsapp" href={WHATSAPP_HREF} target="_blank" rel="noreferrer">
            <WhatsAppIcon />Chat with us on WhatsApp<ChevronRight aria-hidden="true" />
          </a>
          <ul className="store-footer-social" aria-label="Zentora on social media">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <li key={label}><a href={href} target="_blank" rel="noreferrer" aria-label={"Zentora on " + label}><Icon /></a></li>
            ))}
          </ul>
        </div>
        {LINK_GROUPS.map(group => <FooterLinks key={group.title} group={group} collapsible={isMobile} />)}
      </div>

      <div className="store-footer-bottom">
        <div className="store-shell">
          <p>© {new Date().getFullYear()} Zentora. All rights reserved.</p>
          <p className="store-footer-payment"><span>Payment accepted</span><span className="store-footer-badge">Pay on Delivery</span></p>
        </div>
      </div>
    </footer>
  );
};
