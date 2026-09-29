import { Link } from "react-router-dom";
import { MapPin, Phone, Menu, X } from "lucide-react";
import logo from "@/assets/zentora_logo_clear.png";
import { HeaderNav } from "./HeaderNav";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderActions } from "./HeaderActions";
import { useAuthStore } from "@/features/auth/store/authStore";
type HeaderProps = { navLinks: { label: string; href: string }[]; cartCount: number; menuOpen: boolean; onMenuToggle: () => void; onOpenSearch: () => void; pathname: string; catalogCategories?: { id: string | number; name: string }[]; shopLocation?: string };
export const Header = ({ navLinks, cartCount, menuOpen, onMenuToggle, pathname, catalogCategories, shopLocation = "Accra Towers 5th floor Shop B12, Nairobi CBD, Kenya" }: HeaderProps) => {
  const user = useAuthStore(s => s.user);
  const isAdmin = Boolean(user?.roles?.includes("admin") || user?.roles?.includes("super_admin"));
  return <header className="store-header">
    <div className="store-utility"><div className="store-shell"><span><MapPin size={12} />{shopLocation}</span><div><a href="tel:+254795974591"><Phone size={12} />+254 795 974591</a><Link to="/help">Help</Link><Link to="/contact">Contact us</Link></div></div></div>
    <div className="store-shell store-header-main"><button className="store-menu-toggle" type="button" onClick={onMenuToggle} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button><Link className="store-brand" to="/" aria-label="Zentora home"><img src={logo} alt="" /><span><strong>Zentora</strong><small>Everyday finds. All in one place.</small></span></Link><div className="store-header-search"><HeaderSearch /></div><HeaderActions cartCount={cartCount} /></div>
    <div className="store-desktop-nav"><div className="store-shell"><HeaderNav navLinks={navLinks} pathname={pathname} catalogCategories={catalogCategories} isAdmin={isAdmin} /></div></div>
  </header>;
};
