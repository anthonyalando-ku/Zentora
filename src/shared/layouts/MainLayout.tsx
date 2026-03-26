import { type ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useCart } from "@/features/cart/hooks/useCart";
import { useCategories } from "@/features/catalog/hooks/useCategories";

type MainLayoutProps = {
  children: ReactNode;
};


const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  //{ label: "Categories", href: "/products" },
];

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { data: categories, /*isLoading: categoriesLoading*/ } = useCategories();

  const cart = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        navLinks={navLinks}
        cartCount={cart.itemCount}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        onMenuClose={() => setMenuOpen(false)}
        pathname={location.pathname}
        catalogCategories={categories?.slice(0, 10).map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      />

      <main className="flex-1">{children}</main>

      <Footer catalogCategories={categories} />
    </div>
  );
};