import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/zentora_logo_clear.png";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

// ── SVG icons — clean, consistent 1.6px stroke weight ────────────────────────

const ShieldCheckIcon = () => (
  <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const RotateCcwIcon = () => (
  <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

const TruckIcon = () => (
  <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  {
    Icon: ShieldCheckIcon,
    label: "Secure payments",
    sub: "M-Pesa and SSL on every transaction",
  },
  {
    Icon: RotateCcwIcon,
    label: "7-day returns",
    sub: "Straightforward returns, no hassle",
  },
  {
    Icon: TruckIcon,
    label: "Fast delivery",
    sub: "Dispatched within 1–2 business days",
  },
];

const STATS = [
  { value: "500+", label: "Products"   },
  { value: "20+",  label: "Categories" },
  { value: "4.8★", label: "Rating"     },
];

// ─────────────────────────────────────────────────────────────────────────────

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className="min-h-screen flex flex-col lg:flex-row bg-background">

    {/* ══════════════════════════════════════════════════════════════════════
        Left panel — brand, trust, stats
        Desktop only. On mobile this panel is hidden entirely.
    ══════════════════════════════════════════════════════════════════════ */}
    <aside
      className="relative hidden lg:flex lg:w-[400px] xl:w-[460px] shrink-0 flex-col overflow-hidden"
      style={{ background: "#060d1a" }}
      aria-hidden="true"   /* decorative — form is on the right */
    >
      {/* Glows */}
      <div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 65%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)" }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.45), transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full min-h-screen px-9 xl:px-11 py-11">

        {/* Logo mark */}
        <Link
          to="/"
          className="inline-flex items-center gap-3 group w-fit"
          tabIndex={-1}
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/[0.09] flex items-center justify-center group-hover:bg-white/[0.11] transition-colors">
            <img src={logo} alt="" className="h-[18px] w-[18px] object-contain" />
          </div>
          <span className="text-white font-bold text-base tracking-tight group-hover:text-sky-300 transition-colors">
            Zentora
          </span>
        </Link>

        {/* Main copy — vertically centred */}
        <div className="flex-1 flex flex-col justify-center py-8">

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 mb-4">
            Kenya's online marketplace
          </p>

          <h2 className="text-[1.95rem] xl:text-[2.15rem] font-extrabold text-white leading-[1.07] tracking-tight">
            Shop smarter.<br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #7dd3fc, #22d3ee)" }}
            >
              Delivered faster.
            </span>
          </h2>

          <p className="mt-4 text-[13px] leading-relaxed max-w-[26ch]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Electronics, appliances, and everyday essentials — anywhere in Kenya.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-5 mt-9 mb-9 pb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {STATS.map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-5">
                <div>
                  <div className="text-[1.1rem] font-extrabold text-white tabular-nums leading-none tracking-tight flex items-center gap-0.5">
                    {label === "Rating" ? (
                      <>
                        4.8
                        <span className="text-amber-400 ml-0.5"><StarIcon /></span>
                      </>
                    ) : value}
                  </div>
                  <div
                    className="text-[10px] mt-1 uppercase tracking-widest font-medium"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {label}
                  </div>
                </div>
                {i < STATS.length - 1 && (
                  <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.10)" }} />
                )}
              </div>
            ))}
          </div>

          {/* Trust items */}
          <div className="space-y-5">
            {TRUST_ITEMS.map(({ Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3.5">
                <div
                  className="shrink-0 w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sky-400 mt-0.5"
                  style={{ background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.22)" }}
                >
                  <Icon />
                </div>
                <div>
                  {/* Label — full white, clearly readable */}
                  <div className="text-[13px] font-semibold text-white leading-tight">
                    {label}
                  </div>
                  {/* Sub — muted but still legible */}
                  <div
                    className="text-[11px] mt-0.5 leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.50)" }}
                  >
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer address */}
        <div className="flex items-center gap-2 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-1 h-1 rounded-full bg-sky-500 shrink-0 opacity-50" />
          <p className="text-[10px] tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>
            Gabrone Plaza, 2nd Floor · Nairobi CBD, Kenya
          </p>
        </div>

      </div>
    </aside>

    {/* ══════════════════════════════════════════════════════════════════════
        Right panel — form
    ══════════════════════════════════════════════════════════════════════ */}
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-8">

      {/* Mobile logo — visible only when left panel is collapsed */}
      <div className="lg:hidden self-start sm:self-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <img src={logo} alt="Zentora" className="h-7 w-7 object-contain" />
          <span className="font-bold text-foreground text-[0.9rem] tracking-tight">Zentora</span>
        </Link>
      </div>

      {/* Form wrapper */}
      <div className="w-full max-w-[390px]">

        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-[1.55rem] sm:text-[1.7rem] font-bold tracking-tight text-foreground leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-[13px] text-foreground/48 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Page-specific form */}
        {children}

        {/* Legal note */}
        <div className="mt-8 pt-5 border-t border-border">
          <p className="text-[11px] text-foreground/28 text-center leading-relaxed">
            By continuing you agree to Zentora's{" "}
            <Link
              to="/terms"
              className="text-foreground/45 hover:text-primary underline-offset-2 hover:underline transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-foreground/45 hover:text-primary underline-offset-2 hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

      </div>
    </div>
  </div>
);