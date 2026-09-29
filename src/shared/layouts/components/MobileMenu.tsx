import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, CircleHelp, House, LogIn, Mail, Package, Phone, ShieldCheck, Tags, UserRound, X, type LucideIcon } from "lucide-react";
import logo from "@/assets/zentora_logo_clear.png";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useDrawerBehavior } from "../hooks/useDrawerBehavior";

type NavLink = { label: string; href: string };

type MobileMenuProps = {
  open: boolean;
  navLinks: NavLink[];
  pathname: string;
  onClose: () => void;
  isAdmin?: boolean;
  isLogin?: boolean;
};

const NAV_ICONS: Record<string, LucideIcon> = { "/": House, "/products": Package };

/**
 * Hamburger drawer for mobile: brand, account, then the same destinations as the
 * desktop header (primary nav + Deals, and the utility bar's Help / Contact / phone,
 * which is hidden on phones). Categories live in CategoriesDrawer; search in SearchOverlay.
 */
export const MobileMenu = ({ open, navLinks, pathname, onClose, isLogin = false, isAdmin = false }: MobileMenuProps) => {
  const panel = useRef<HTMLElement>(null);
  const fullName = useAuthStore(s => s.user?.full_name?.trim());
  useDrawerBehavior(open, onClose, panel);
  if (!open) return null;

  const shop: (NavLink & { Icon: LucideIcon })[] = [
    ...navLinks.map(l => ({ ...l, Icon: NAV_ICONS[l.href] ?? Package })),
    { label: "Deals", href: "/collections/deals", Icon: Tags },
  ];
  const help: (NavLink & { Icon: LucideIcon })[] = [
    { label: "Help Center", href: "/help", Icon: CircleHelp },
    { label: "Contact Us", href: "/contact", Icon: Mail },
  ];
  const item = ({ label, href, Icon }: NavLink & { Icon: LucideIcon }) => {
    const active = pathname === href;
    return <li key={href}><Link to={href} onClick={onClose} className="store-drawer-link" aria-current={active ? "page" : undefined}>
      <Icon aria-hidden="true" /><span>{label}</span><ChevronRight className="store-drawer-chevron" aria-hidden="true" />
    </Link></li>;
  };

  return (
    <div className="md:hidden store-drawer-root" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
      <div aria-hidden="true" onClick={onClose} className="store-drawer-backdrop" />
      <aside ref={panel} className="store-drawer store-drawer-left">
        <div className="store-drawer-brand">
          <Link to="/" onClick={onClose} className="store-brand" aria-label="Zentora home">
            <img src={logo} alt="" />
            <span><strong id="mobile-menu-title">Zentora</strong><small>Everyday finds. All in one place.</small></span>
          </Link>
          <button type="button" onClick={onClose} aria-label="Close menu" className="store-drawer-close" data-autofocus><X aria-hidden="true" /></button>
        </div>

        <div className="store-drawer-body">
          <Link to={isLogin ? "/account" : "/login"} onClick={onClose} className="store-drawer-account" aria-current={pathname.startsWith("/account") ? "page" : undefined}>
            <span className="store-drawer-avatar" aria-hidden="true">{isLogin ? <UserRound /> : <LogIn />}</span>
            <span className="min-w-0">
              <strong>{isLogin ? fullName || "My Account" : "Sign in"}</strong>
              <small>{isLogin ? "Profile, orders, addresses & security" : "Sign in to continue"}</small>
            </span>
            <ChevronRight className="store-drawer-chevron" aria-hidden="true" />
          </Link>

          <nav aria-label="Shop">
            <ul className="store-drawer-list">{shop.map(item)}</ul>
          </nav>

          <nav aria-label="Help and contact" className="store-drawer-section">
            <ul className="store-drawer-list">
              {help.map(item)}
              <li><a href="tel:+254795974591" className="store-drawer-link"><Phone aria-hidden="true" /><span>Call +254 795 974591</span></a></li>
            </ul>
          </nav>

          {isAdmin && (
            <nav aria-label="Administration" className="store-drawer-section">
              <ul className="store-drawer-list">
                <li><Link to="/admin" onClick={onClose} className="store-drawer-link" aria-current={pathname.startsWith("/admin") ? "page" : undefined}>
                  <ShieldCheck aria-hidden="true" /><span>Admin Console</span><ChevronRight className="store-drawer-chevron" aria-hidden="true" />
                </Link></li>
              </ul>
            </nav>
          )}
        </div>
      </aside>
    </div>
  );
};
