import { type ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCartStore } from "@/features/cart/store/cartStore";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

type MainLayoutProps = {
  children: ReactNode;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/products" },
];

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const cartCount = useCartStore((state) => state.items.reduce((acc, i) => acc + i.quantity, 0));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        navLinks={navLinks}
        cartCount={cartCount}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((v) => !v)}
        onMenuClose={() => setMenuOpen(false)}
        pathname={location.pathname}
      />

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};
