import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/shared/layouts";

// ── Structured data ───────────────────────────────────────────────────────────
const ABOUT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Zentora",
  description:
    "Learn about Zentora, Kenya's modern online marketplace offering electronics, appliances, and everyday essentials with fast Nairobi delivery and secure payments.",
  url: "https://zentorashop.co.ke/about",
  publisher: {
    "@type": "Organization",
    name: "Zentora",
    url: "https://zentorashop.co.ke/",
    logo: "https://zentorashop.co.ke/og-default.png",
  },
};

// ── Tiny reusable primitives (local to this file) ─────────────────────────────
const Check = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2.5">
    <span className="mt-0.5 text-green-600 shrink-0 font-bold">✓</span>
    <span>{children}</span>
  </li>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-primary tracking-tight">{value}</div>
    <div className="text-xs text-foreground/55 mt-1 font-medium">{label}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const AboutUsPage = () => {
  return (
    <MainLayout>
      {/* ── SEO ── */}
      <Helmet>
        <title>About Us | Zentora — Electronics &amp; Appliances in Kenya</title>
        <meta
          name="description"
          content="Zentora is Kenya's modern online marketplace for electronics, tablets, power banks, and home appliances. Fast Nairobi delivery, secure payments, 7-day returns."
        />
        <link rel="canonical" href="https://zentorashop.co.ke/about" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Zentora — Electronics &amp; Appliances in Kenya" />
        <meta
          property="og:description"
          content="Learn about Zentora, Kenya's trusted online marketplace. Shop electronics, appliances and more with fast delivery and easy returns."
        />
        <meta property="og:url" content="https://zentorashop.co.ke/about" />
        <meta property="og:image" content="https://zentorashop.co.ke/og-default.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Zentora — Electronics &amp; Appliances in Kenya" />
        <meta
          name="twitter:description"
          content="Kenya's modern marketplace for electronics, appliances and everyday essentials."
        />
        <script type="application/ld+json">{JSON.stringify(ABOUT_JSON_LD)}</script>
      </Helmet>

      <div className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">

            {/* ── Page header ── */}
            <header className="px-5 sm:px-8 py-8 border-b border-border bg-secondary/5">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-xs text-foreground/40 mb-4" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <span className="text-foreground/70">About Us</span>
              </nav>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                About Zentora
              </h1>
              <p className="text-sm text-foreground/60 mt-2 max-w-2xl leading-relaxed">
                We're a Nairobi-based online marketplace on a mission to make quality electronics,
                appliances, and everyday essentials accessible to every Kenyan — with honest prices,
                fast delivery, and support that actually helps.
              </p>
            </header>

            <div className="px-5 sm:px-8 py-8 space-y-10">

              {/* ── Stats row ── */}
              <section
                aria-label="Zentora by the numbers"
                className="rounded-2xl border border-border bg-primary/3 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                <Stat value="500+" label="Products listed" />
                <Stat value="20+"  label="Categories" />
                <Stat value="7-day" label="Return window" />
                <Stat value="KES"  label="Local currency" />
              </section>

              {/* ── Our story ── */}
              <section className="rounded-2xl border border-border p-6 sm:p-7" aria-labelledby="story-heading">
                <h2 id="story-heading" className="text-lg font-semibold mb-3">Our story</h2>
                <div className="space-y-3 text-sm text-foreground/70 leading-relaxed">
                  <p>
                    Zentora was started with a simple frustration: buying quality electronics in Kenya
                    meant navigating crowded CBD shops, unreliable listings, and prices that varied
                    wildly depending on how well you could negotiate. We wanted something better —
                    a store you could trust before you even clicked "add to cart".
                  </p>
                  <p>
                    We're based in Nairobi CBD at Gabrone Plaza, and everything we list is something
                    we've verified and stand behind. From tablets and power banks to kitchen appliances
                    and car accessories, our catalog is built around what Kenyan customers actually need —
                    not just what's easy to source.
                  </p>
                  <p>
                    Our goal is straightforward: build the most reliable place to shop online in Kenya.
                    That means real stock levels, accurate descriptions, honest pricing, and support
                    that responds when something goes wrong.
                  </p>
                </div>
              </section>

              {/* ── Mission / Promise / Values ── */}
              <section aria-labelledby="values-heading">
                <h2 id="values-heading" className="sr-only">Our values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Our mission",
                      body: "Make quality products accessible to every Kenyan with transparent pricing, dependable delivery, and customer support that treats you like a person.",
                    },
                    {
                      title: "Our promise",
                      body: "Every product we list is accurately described. Every order we take, we fulfil. And if something goes wrong, we make it right — no runaround.",
                    },
                    {
                      title: "What we value",
                      body: "Reliability over hype. Fairness over margins. Continuous improvement over standing still — because ecommerce in Kenya deserves better.",
                    },
                  ].map(({ title, body }) => (
                    <div key={title} className="rounded-2xl border border-border p-5 space-y-2">
                      <div className="text-sm font-semibold text-foreground">{title}</div>
                      <p className="text-sm text-foreground/60 leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── What we sell ── */}
              <section className="rounded-2xl border border-border p-6 sm:p-7" aria-labelledby="catalog-heading">
                <h2 id="catalog-heading" className="text-lg font-semibold mb-1">What we sell</h2>
                <p className="text-sm text-foreground/55 mb-4">
                  Browse our catalog across 20+ categories — from daily essentials to specialist gear.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "Electronics & Gadgets",    id: 1  },
                    { label: "Mobile Devices",           id: 28 },
                    { label: "Tablets & Android",        id: 27 },
                    { label: "Power Banks",              id: 25 },
                    { label: "Smart Devices",            id: 29 },
                    { label: "Kitchen Appliances",       id: 12 },
                    { label: "Home & Living",            id: 13 },
                    { label: "Beauty & Personal Care",   id: 14 },
                    { label: "Sports & Outdoors",        id: 15 },
                    { label: "Car Accessories",          id: 23 },
                    { label: "Tools & Hardware",         id: 32 },
                    { label: "Health & Wellness",        id: 18 },
                  ].map(({ label, id }) => (
                    <Link
                      key={id}
                      to={`/products?category_id=${id}`}
                      className="text-xs font-medium px-3 py-2.5 rounded-xl border border-border bg-background hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all text-foreground/70"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </section>

              {/* ── Why shop with us ── */}
              <section className="rounded-2xl border border-border p-6 sm:p-7" aria-labelledby="why-heading">
                <h2 id="why-heading" className="text-lg font-semibold mb-4">Why shop with us</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-foreground/70">
                  <Check>Curated products — everything is verified before it's listed</Check>
                  <Check>Accurate stock levels updated in real time</Check>
                  <Check>Secure checkout with M-Pesa and other local payment options</Check>
                  <Check>Fast delivery within Nairobi and countrywide shipping</Check>
                  <Check>7-day returns on items in original condition</Check>
                  <Check>Clear order tracking from payment to delivery</Check>
                  <Check>WhatsApp support for quick questions and order issues</Check>
                  <Check>No hidden fees — the price you see is the price you pay</Check>
                </ul>
              </section>

              {/* ── Find us ── */}
              <section className="rounded-2xl border border-border p-6 sm:p-7" aria-labelledby="location-heading">
                <h2 id="location-heading" className="text-lg font-semibold mb-4">Find us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3 text-foreground/70">
                    <div className="flex justify-between gap-3">
                      <span className="text-foreground/50 shrink-0">Address</span>
                      <span className="font-medium text-foreground text-right">
                        Gabrone Plaza, 2nd Floor, Nairobi CBD
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-foreground/50 shrink-0">Phone</span>
                      <a href="tel:+254795974591" className="font-medium text-primary hover:underline">
                        +254 795 974 591
                      </a>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-foreground/50 shrink-0">Email</span>
                      <a href="mailto:ezekielmulongo254@gmail.com" className="font-medium text-primary hover:underline truncate">
                        ezekielmulongo254@gmail.com
                      </a>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-foreground/50 shrink-0">Hours</span>
                      <span className="font-medium text-foreground text-right">Mon–Sat, 9:00am – 6:00pm</span>
                    </div>
                    <div className="pt-3 flex gap-2">
                      <a
                        href="https://maps.app.goo.gl/fyjBbr7LjKE1Lpoa6"
                        target="_blank"
                        rel="noreferrer"
                        className="h-9 px-4 rounded-xl border border-border hover:bg-secondary/10 transition text-xs font-semibold inline-flex items-center justify-center"
                      >
                        Open in Maps
                      </a>
                      <a
                        href="https://wa.me/254795974591"
                        target="_blank"
                        rel="noreferrer"
                        className="h-9 px-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 transition text-xs font-semibold inline-flex items-center justify-center"
                      >
                        WhatsApp us
                      </a>
                    </div>
                  </div>

                  {/* Embedded map */}
                  <div className="rounded-xl overflow-hidden border border-border aspect-video sm:aspect-auto sm:h-full min-h-[160px]">
                    <iframe
                      title="Zentora store location — Gabrone Plaza Nairobi"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.816319881411!2d36.8221420775937!3d-1.2841155953611947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11e849a53eb7%3A0x235009a1613022f4!2sGaberone%20plaza!5e0!3m2!1sen!2ske!4v1774789137005!5m2!1sen!2ske"
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </section>

              {/* ── CTA ── */}
              <section
                className="rounded-2xl border border-border p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                aria-labelledby="cta-heading"
              >
                <div>
                  <h2 id="cta-heading" className="text-lg font-semibold">Ready to shop?</h2>
                  <p className="text-sm text-foreground/60 mt-1">
                    Browse our full catalog or reach out if you have questions.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    to="/help"
                    className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                  >
                    Help Center
                  </Link>
                  <Link
                    to="/contact"
                    className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/products"
                    className="h-11 px-5 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center justify-center"
                  >
                    Shop Now
                  </Link>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUsPage;