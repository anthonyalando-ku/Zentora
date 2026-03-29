import { Link } from "react-router-dom";
import logo from "@/assets/zentora_logo_clear.png";
import { HeaderNav } from "./HeaderNav";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderActions } from "./HeaderActions";
import { MobileMenu } from "./MobileMenu";
import { useAuthStore } from "@/features/auth/store/authStore";

type NavLink = {
  label: string;
  href: string;
};

type CatalogCategoryLink = {
  id: string | number;
  name: string;
};

type HeaderProps = {
  navLinks: NavLink[];
  cartCount: number;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  pathname: string;
  catalogCategories?: CatalogCategoryLink[];
};

export const Header = ({
  navLinks,
  cartCount,
  menuOpen,
  onMenuToggle,
  onMenuClose,
  pathname,
  catalogCategories,
}: HeaderProps) => {
  const user = useAuthStore((s) => s.user);

  const isAdmin = Boolean(user?.roles?.includes("admin") || user?.roles?.includes("super_admin"));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Row 1: Logo | (Search desktop) | Actions */}
      <div className="border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center gap-4">
            {/* Mobile: menu button is inside HeaderActions (kept) */}
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <img src={logo} alt="Zentora" className="h-10 w-10 object-contain" />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-bold text-xl text-primary">Zentora</span>
                <span className="text-[11px] text-foreground/50 -mt-0.5">Marketplace</span>
              </div>
            </Link>

            {/* Desktop search (largest element) */}
            <div className="hidden md:flex flex-1 justify-center">
              <HeaderSearch />
            </div>

            {/* Actions */}
            <div className="ml-auto">
              <HeaderActions cartCount={cartCount} menuOpen={menuOpen} onMenuToggle={onMenuToggle} />
            </div>
          </div>

          {/* Mobile: search row */}
          <div className="md:hidden pb-4">
            <HeaderSearch />
          </div>
        </div>
      </div>

      {/* Row 2: All Categories dropdown + nav links (desktop) */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 flex items-center justify-between gap-6">
            <HeaderNav
              navLinks={navLinks}
              pathname={pathname}
              catalogCategories={catalogCategories}
              isAdmin={isAdmin}
            />

            {/* Optional right-side helper links area could go here later without logic changes */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-foreground/50">
              <span className="inline-flex items-center gap-2">
                <span className="text-green-600">✓</span> Secure payments
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="text-green-600">✓</span> Fast delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        navLinks={navLinks}
        pathname={pathname}
        onClose={onMenuClose}
        catalogCategories={catalogCategories}
        isAdmin={isAdmin}
      />
    </header>
  );
};