import { Link } from "react-router-dom";

type HeaderActionsProps = {
  cartCount: number;
  menuOpen: boolean;
  onMenuToggle: () => void;
};

export const HeaderActions = ({ cartCount, menuOpen, onMenuToggle }: HeaderActionsProps) => (
  <div className="flex items-center gap-2">
    {/* Cart */}
    <Link
      to="/cart"
      className="relative p-2 rounded-full hover:bg-secondary/10 transition-colors"
      aria-label="Cart"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>

    {/* Account */}
    <Link
      to="/account"
      className="p-2 rounded-full hover:bg-secondary/10 transition-colors"
      aria-label="Account"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </Link>

    {/* Mobile menu button */}
    <button
      className="md:hidden p-2 rounded-full hover:bg-secondary/10 transition-colors"
      onClick={onMenuToggle}
      aria-label="Menu"
    >
      {menuOpen ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  </div>
);
