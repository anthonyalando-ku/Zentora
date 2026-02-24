import { Link } from "react-router-dom";
import logo from "@/assets/zentora_logo_clear.png";
import { HeaderNav } from "./HeaderNav";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderActions } from "./HeaderActions";
import { MobileMenu } from "./MobileMenu";

type NavLink = {
  label: string;
  href: string;
};

type HeaderProps = {
  navLinks: NavLink[];
  cartCount: number;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  pathname: string;
};

export const Header = ({ navLinks, cartCount, menuOpen, onMenuToggle, onMenuClose, pathname }: HeaderProps) => (
  <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Zentora" className="h-9 w-9 object-contain" />
          <span className="font-bold text-xl text-primary hidden sm:block">Zentora</span>
        </Link>

        <HeaderNav navLinks={navLinks} pathname={pathname} />
        <HeaderSearch />
        <HeaderActions cartCount={cartCount} menuOpen={menuOpen} onMenuToggle={onMenuToggle} />
      </div>
    </div>

    <MobileMenu open={menuOpen} navLinks={navLinks} pathname={pathname} onClose={onMenuClose} />
  </header>
);
