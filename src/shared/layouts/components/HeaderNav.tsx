import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

type NavLink = {
  label: string;
  href: string;
};

type HeaderNavProps = {
  navLinks: NavLink[];
  pathname: string;
};

export const HeaderNav = ({ navLinks, pathname }: HeaderNavProps) => (
  <nav className="hidden md:flex items-center gap-6">
    {navLinks.map((link) => (
      <Link
        key={`${link.href}::${link.label}`}
        to={link.href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === link.href ? "text-primary" : "text-foreground/70"
        )}
      >
        {link.label}
      </Link>
    ))}
  </nav>
);
