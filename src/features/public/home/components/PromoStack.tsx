import { Link } from "react-router-dom";

const promos = [
  {
    title: "Fast Delivery",
    desc: "Get items delivered quickly",
    href: "/products?feed_type=trending",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    desc: "Protected checkout experience",
    href: "/account",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Daily Deals",
    desc: "Limited-time offers everyday",
    href: "/products?feed_type=deals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
];

const PromoStack = () => (
  <aside className="lg:col-span-3">
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
      {promos.map((p) => (
        <Link
          key={p.title}
          to={p.href}
          className="rounded-xl border border-border bg-background hover:border-primary/30 hover:shadow-sm transition-all p-4 flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground/50 group-hover:text-primary group-hover:bg-primary/8 transition-colors flex-shrink-0">
            {p.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground leading-tight">{p.title}</div>
            <div className="text-xs text-foreground/50 mt-0.5">{p.desc}</div>
          </div>
          <svg
            className="w-4 h-4 text-foreground/20 group-hover:text-foreground/40 flex-shrink-0 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  </aside>
);

export default PromoStack;