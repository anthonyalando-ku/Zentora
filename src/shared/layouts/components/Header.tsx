import { Link } from "react-router-dom";
import logo from "@/assets/zentora_logo_clear.png";
import { HeaderNav } from "./HeaderNav";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderActions } from "./HeaderActions";
import { useAuthStore } from "@/features/auth/store/authStore";

type NavLink = { label: string; href: string };
type CatalogCategoryLink = { id: string | number; name: string };

type HeaderProps = {
  navLinks: NavLink[];
  cartCount: number;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onOpenSearch: () => void;
  pathname: string;
  catalogCategories?: CatalogCategoryLink[];
  /** Shop location, shown in the mobile top utility bar. */
  shopLocation?: string;
};

export const Header = ({
  navLinks,
  cartCount,
  menuOpen,
  onMenuToggle,
  onOpenSearch,
  pathname,
  catalogCategories,
  shopLocation = "Gaborone Plaza, 6th Floor, Shop C2",
}: HeaderProps) => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = Boolean(user?.roles?.includes("admin") || user?.roles?.includes("super_admin"));

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_1px_0_0_hsl(var(--border))]">

      {/* ── Mobile top utility bar: shop location ──────────────────────────── */}
      <div className="bg-foreground text-background">
        <div className="h-7 px-3 flex items-center justify-center gap-1.5 text-[11.5px] font-medium">
          <svg
            className="h-3 w-3 flex-shrink-0 opacity-80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s7-7.2 7-12.5A7 7 0 0 0 5 9.5C5 14.8 12 22 12 22Z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
          <span className="truncate">{shopLocation}</span>
        </div>
      </div>

      {/* ── Row 1: Logo · Search · Actions ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">

        {/* MOBILE: hamburger+search | logo | account+cart */}
        <div className="md:hidden h-14 grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center">
            <button
              type="button"
              onClick={onMenuToggle}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-foreground/65 hover:bg-muted active:bg-muted transition-colors"
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search"
              className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-foreground/65 hover:bg-muted active:bg-muted transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>

          <Link to="/" className="flex items-center gap-2 justify-self-center" aria-label="Zentora — home">
            <img src={logo} alt="Zentora" className="h-7 w-7 object-contain" />
            <span className="font-bold text-base leading-none text-foreground tracking-tight">
              Zentora
            </span>
          </Link>

          <div className="flex items-center justify-end">
            <Link
              to="/account"
              aria-label="Account"
              className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-foreground/65 hover:bg-muted active:bg-muted transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <circle cx="12" cy="8" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative h-10 w-10 inline-flex items-center justify-center rounded-lg text-foreground/65 hover:bg-muted active:bg-muted transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14l-1.2 9.2A2 2 0 0 1 15.8 19H8.2a2 2 0 0 1-2-1.8L5 8Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold leading-none ring-2 ring-background">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* DESKTOP: unchanged layout — logo · search · actions */}
        <div className="hidden md:flex h-14 items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={logo} alt="Zentora" className="h-8 w-8 object-contain" />
            <span className="font-bold text-lg leading-none text-foreground">
              Zentora
            </span>
          </Link>

          <div className="flex flex-1 max-w-2xl mx-auto">
            <HeaderSearch />
          </div>

          <div className="ml-auto">
            <HeaderActions cartCount={cartCount} />
          </div>
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

      {/*
        NOTE: <MobileMenu /> is intentionally NOT rendered here.
        This <header> uses `backdrop-blur`, which creates a containing block
        for any `position: fixed` descendants — that would shrink the drawer
        to the header's bounding box. MobileMenu is mounted from MainLayout
        instead so its fixed overlay covers the full viewport.
      */}
    </header>
  );
};
