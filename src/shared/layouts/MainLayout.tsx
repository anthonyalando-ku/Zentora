import { type ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BottomNav } from "./components/BottomNav";
import { MobileMenu } from "./components/MobileMenu";
import { SearchOverlay } from "./components/SearchOverlay";
import { CategoriesDrawer } from "./components/CategoriesDrawer";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCart } from "@/features/cart/hooks/useCart";
import { useCategories } from "@/features/catalog/hooks/useCategories";

type MainLayoutProps = {
  children: ReactNode;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
];

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const location = useLocation();
  const { data: categories } = useCategories();
  const cart = useCart();
  const user = useAuthStore((s) => s.user);
  const isAdmin = Boolean(user?.roles?.includes("admin") || user?.roles?.includes("super_admin"));
  const isLogin = user != null;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        navLinks={navLinks}
        cartCount={cart.itemCount}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        onOpenSearch={() => setSearchOpen(true)}
        pathname={location.pathname}
        catalogCategories={categories?.slice(0, 10).map((c) => ({
          id: c.id, name: c.name, slug: c.slug,
        }))}
      />

      {/* Hamburger drawer — mounted at layout level so it escapes the
          header's backdrop-blur containing block and covers the full viewport. */}
      <MobileMenu
        open={menuOpen}
        navLinks={navLinks}
        pathname={location.pathname}
        onClose={() => setMenuOpen(false)}
        isAdmin={isAdmin}
        isLogin={isLogin}
      />

      {/*
        Bottom-padding on mobile reserves space for the fixed BottomNav so
        page content isn't hidden beneath it. md+ keeps the original layout.
      */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>

      <Footer catalogCategories={categories} />

      {/* Mobile bottom navigation — Shop / Categories / Search / Cart */}
      <BottomNav
        pathname={location.pathname}
        cartCount={cart.itemCount}
        searchOpen={searchOpen}
        categoriesOpen={categoriesOpen}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCategories={() => setCategoriesOpen(true)}
      />

      {/* Top-sheet search overlay — opened by header icon or bottom-nav */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Side drawer of product categories — opened by bottom-nav */}
      <CategoriesDrawer
        open={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
        catalogCategories={categories?.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      />
    </div>
  );
};
