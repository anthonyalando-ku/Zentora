import { Link } from "react-router-dom";

const PromoStack = () => {
    return (
        <aside className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {[
                {
                title: "Fast Delivery",
                desc: "Get items delivered quickly",
                icon: "🚚",
                href: "/products?feed_type=trending",
                },
                {
                title: "Secure Payments",
                desc: "Protected checkout experience",
                icon: "🔒",
                href: "/account",
                },
                {
                title: "Daily Deals",
                desc: "Limited-time offers everyday",
                icon: "🔥",
                href: "/products?feed_type=deals",
                },
            ].map((p) => (
                <Link
                key={p.title}
                to={p.href}
                className="rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition p-4 flex items-start gap-3"
                >
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-xl">
                    {p.icon}
                </div>
                <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground">{p.title}</div>
                    <div className="text-xs text-foreground/60 mt-1">{p.desc}</div>
                </div>
                <svg className="w-4 h-4 ml-auto text-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                </Link>
            ))}
            </div>
        </aside>
    );
};

export default PromoStack;