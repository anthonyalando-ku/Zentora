import { Link } from "react-router-dom";

type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href: string }>;
};

export const AdminPageHeader = ({ title, subtitle, action, breadcrumbs }: AdminPageHeaderProps) => {
  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="text-xs text-foreground/50 mb-3 flex items-center gap-2 flex-wrap">
          {breadcrumbs.map((b, i) => (
            <span key={`${b.href}::${b.label}`} className="inline-flex items-center gap-2">
              <Link to={b.href} className="hover:text-primary transition-colors">
                {b.label}
              </Link>
              {i < breadcrumbs.length - 1 && <span>/</span>}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-foreground/60 mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
};