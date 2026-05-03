import { Link } from "react-router-dom";
import logo from "@/assets/zentora_logo_clear.png";
import { HeaderNav } from "./HeaderNav";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderActions } from "./HeaderActions";
import { MobileMenu } from "./MobileMenu";
import { useAuthStore } from "@/features/auth/store/authStore";

type NavLink = { label: string; href: string };
type CatalogCategoryLink = { id: string | number; name: string };

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
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_1px_0_0_hsl(var(--border))]">

      {/* ── Row 1: Logo · Search · Actions ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center gap-4">

          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={logo} alt="Zentora" className="h-8 w-8 object-contain" />
            <span className="hidden sm:block font-bold text-lg leading-none text-foreground">
              Zentora
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <HeaderSearch />
          </div>

          <div className="ml-auto">
            <HeaderActions cartCount={cartCount} menuOpen={menuOpen} onMenuToggle={onMenuToggle} />
          </div>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden pb-2.5">
          <HeaderSearch />
        </div>
      </div>

      {/* ── Row 2: Nav bar (desktop only) ──────────────────────────────────── */}
      <div className="hidden md:block border-t border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 flex items-center">
            <HeaderNav
              navLinks={navLinks}
              pathname={pathname}
              catalogCategories={catalogCategories}
              isAdmin={isAdmin}
            />
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