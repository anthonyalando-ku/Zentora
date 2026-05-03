import { Link } from "react-router-dom";

type HeaderActionsProps = {
  cartCount: number;
  menuOpen: boolean;
  onMenuToggle: () => void;
};

export const HeaderActions = ({ cartCount, menuOpen, onMenuToggle }: HeaderActionsProps) => (
  <div className="flex items-center gap-1">

    {/* Cart */}
    <Link
      to="/cart"
      className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
      aria-label="Cart"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold leading-none">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>

    {/* Account */}
    <Link
      to="/account"
      className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
      aria-label="Account"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </Link>

    {/* Mobile menu toggle */}
    <button
      className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
      onClick={onMenuToggle}
      aria-label={menuOpen ? "Close menu" : "Open menu"}
    >
      {menuOpen ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  </div>
);