import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import type { JSX } from "react";

type BottomNavProps = {
  pathname: string;
  cartCount: number;
  searchOpen: boolean;
  categoriesOpen: boolean;
  onOpenSearch: () => void;
  onOpenCategories: () => void;
};

type IconProps = { className?: string; strokeWidth?: number };

const ShopIcon = ({ className, strokeWidth = 1.75 }: IconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h16l-1 3H5L4 8Z" />
    <path d="M5 11v9h14v-9" />
    <path d="M9 20v-5h6v5" />
    <path d="M9 8V5h6v3" />
  </svg>
);
const GridIcon = ({ className, strokeWidth = 1.75 }: IconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="7" height="7" rx="1.2" />
    <rect x="13" y="4" width="7" height="7" rx="1.2" />
    <rect x="4" y="13" width="7" height="7" rx="1.2" />
    <rect x="13" y="13" width="7" height="7" rx="1.2" />
  </svg>
);
const SearchIcon = ({ className, strokeWidth = 1.75 }: IconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
const CartIcon = ({ className, strokeWidth = 1.75 }: IconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h14l-1.2 9.2A2 2 0 0 1 15.8 19H8.2a2 2 0 0 1-2-1.8L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

/**
 * Fixed bottom tab bar — mobile only.
 * Each tab is icon + label.
 *  • Shop       → route /
 *  • Categories → opens side drawer (state lifted to MainLayout)
 *  • Search     → opens top-sheet overlay (state lifted to MainLayout)
 *  • Cart       → route /cart (badge w/ cart count)
 */
export const BottomNav = ({
  pathname,
  cartCount,
  searchOpen,
  categoriesOpen,
  onOpenSearch,
  onOpenCategories,
}: BottomNavProps) => {
  const isShop = pathname === "/";
  const isCart = pathname.startsWith("/cart");
  const isSearch = searchOpen;
  const isCategories = categoriesOpen;

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "md:hidden fixed inset-x-0 bottom-0 z-30",
        "bg-background border-t border-border",
        "pb-[env(safe-area-inset-bottom)]"
      )}
    >
      <div className="grid grid-cols-4 h-16">
        <BottomTab to="/"     active={isShop}       label="Shop"       Icon={ShopIcon} />
        <BottomTab onClick={onOpenCategories} active={isCategories} label="Categories" Icon={GridIcon} />
        <BottomTab onClick={onOpenSearch}     active={isSearch}     label="Search"     Icon={SearchIcon} />
        <BottomTab to="/cart" active={isCart}       label="Cart"       Icon={CartIcon} badge={cartCount} />
      </div>
    </nav>
  );
};

type BottomTabProps = {
  to?: string;
  onClick?: () => void;
  active: boolean;
  label: string;
  Icon: (p: IconProps) => JSX.Element;
  badge?: number;
};

const BottomTab = ({ to, onClick, active, label, Icon, badge }: BottomTabProps) => {
  const inner = (
    <>
      {active && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[3px] rounded-b-full bg-primary" />
      )}
      <span className="relative">
        <Icon
          className={cn("h-[22px] w-[22px]", active ? "text-primary" : "text-foreground/55")}
          strokeWidth={active ? 2 : 1.75}
        />
        {(badge ?? 0) > 0 && (
          <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold leading-none ring-2 ring-background">
            {badge! > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span
        className={cn(
          "text-[10.5px] tracking-tight",
          active ? "text-primary font-semibold" : "text-foreground/55 font-medium"
        )}
      >
        {label}
      </span>
    </>
  );

  const cls = "relative h-full flex flex-col items-center justify-center gap-0.5 active:bg-muted/40";

  if (to) {
    return (
      <Link to={to} className={cls} aria-current={active ? "page" : undefined}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} aria-pressed={active}>
      {inner}
    </button>
  );
};
