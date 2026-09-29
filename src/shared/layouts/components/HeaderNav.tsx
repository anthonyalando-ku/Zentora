import { Link } from "react-router-dom";
import { Menu, ChevronDown, Tags } from "lucide-react";
type Props = { navLinks: {label: string; href: string}[]; pathname: string; catalogCategories?: { id: string | number; name: string }[]; isAdmin?: boolean };
export const HeaderNav = ({ navLinks, pathname, catalogCategories = [], isAdmin }: Props) => <nav className="store-nav" aria-label="Shop navigation">
  <details className="store-departments"><summary><Menu size={16} />All categories<ChevronDown size={14} /></summary><div>{catalogCategories.map(c => <Link key={c.id} to={"/products?category_id=" + c.id} onClick={e => e.currentTarget.closest("details")?.removeAttribute("open")}>{c.name}</Link>)}<Link to="/products">Browse all categories →</Link></div></details>
  <div className="store-nav-links">{navLinks.map(link => <Link key={link.href} to={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}{catalogCategories.slice(0, 4).map(c => <Link key={c.id} to={"/products?category_id=" + c.id}>{c.name}</Link>)}</div><Link className="store-nav-deals" to="/collections/deals"><Tags size={16} />Deals</Link>{isAdmin && <Link to="/admin">Admin</Link>}
</nav>;
