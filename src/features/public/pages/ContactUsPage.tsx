import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/shared/layouts";

// ── Constants ─────────────────────────────────────────────────────────────────
const PHONE_RAW   = "+254795974591";
const PHONE_DISPLAY = "+254 795 974 591";
const EMAIL       = "ezekielmulongo254@gmail.com";
const SHOP_NAME   = "Zentora Shop";
const ADDRESS     = "Gabrone Plaza, 2nd Floor, Nairobi CBD, Kenya";
const HOURS       = "Monday – Saturday, 9:00 am – 6:00 pm";
const MAP_URL     = "https://maps.app.goo.gl/fyjBbr7LjKE1Lpoa6";
const WHATSAPP    = `https://wa.me/${PHONE_RAW.replace("+", "")}?text=${encodeURIComponent("Hi Zentora, I need help with ")}`;
const TIKTOK      = "https://www.tiktok.com/@zentorashop";
const FACEBOOK    = "https://www.facebook.com/zentorashop";
const INSTAGRAM   = "https://www.instagram.com/zentorashop";
const MAP_EMBED   = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.816319881411!2d36.8221420775937!3d-1.2841155953611947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11e849a53eb7%3A0x235009a1613022f4!2sGaberone%20plaza!5e0!3m2!1sen!2ske!4v1774789137005!5m2!1sen!2ske";

const CONTACT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Zentora",
  description: "Reach Zentora Kenya by phone, WhatsApp, email or visit our Nairobi CBD store at Gabrone Plaza.",
  url: "https://zentorashop.co.ke/contact",
  publisher: {
    "@type": "LocalBusiness",
    name: SHOP_NAME,
    telephone: PHONE_RAW,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gabrone Plaza, 2nd Floor",
      addressLocality: "Nairobi CBD",
      addressRegion: "Nairobi",
      addressCountry: "KE",
    },
  },
};

// ── Local icon components (no external dep) ───────────────────────────────────
const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
    <path d="M19.11 17.59c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.21-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.44.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.87c.14.18 1.93 2.95 4.68 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z"/>
    <path d="M16.03 3C8.86 3 3.03 8.82 3.03 15.99c0 2.28.6 4.5 1.74 6.46L3 29l6.73-1.76a12.9 12.9 0 006.3 1.62h.01c7.17 0 13-5.82 13-12.99C29.04 8.82 23.2 3 16.03 3Zm0 23.62h-.01a10.77 10.77 0 01-5.5-1.52l-.39-.23-3.99 1.04 1.06-3.89-.25-.4a10.8 10.8 0 01-1.65-5.71c0-5.95 4.84-10.79 10.79-10.79 2.88 0 5.58 1.12 7.61 3.16a10.72 10.72 0 013.15 7.62c0 5.95-4.84 10.79-10.82 10.79Z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

const ContactUsPage = () => {
  const mapEmbedUrl = useMemo(() => MAP_EMBED, []);

  return (
    <MainLayout>
      {/* ── SEO ── */}
      <Helmet>
        <title>Contact Us | Zentora Kenya — Phone, WhatsApp &amp; Store Location</title>
        <meta
          name="description"
          content="Contact Zentora Kenya via WhatsApp, phone or email. Visit our store at Gabrone Plaza, Nairobi CBD. Mon–Sat 9am–6pm. Fast, helpful support."
        />
        <link rel="canonical" href="https://zentorashop.co.ke/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Zentora Kenya — Phone, WhatsApp &amp; Location" />
        <meta property="og:description" content="Reach Zentora by WhatsApp, phone or email. Visit us at Gabrone Plaza, Nairobi CBD." />
        <meta property="og:url" content="https://zentorashop.co.ke/contact" />
        <meta property="og:image" content="https://zentorashop.co.ke/og-default.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Zentora Kenya" />
        <meta name="twitter:description" content="WhatsApp, call or email Zentora. Nairobi CBD store open Mon–Sat." />
        <script type="application/ld+json">{JSON.stringify(CONTACT_JSON_LD)}</script>
      </Helmet>

      <div className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">

            {/* ── Header ── */}
            <header className="px-5 sm:px-8 py-8 border-b border-border bg-secondary/5">
              <nav className="flex items-center gap-1.5 text-xs text-foreground/40 mb-4" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <span className="text-foreground/70">Contact Us</span>
              </nav>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Contact Us
              </h1>
              <p className="text-sm text-foreground/60 mt-2 max-w-2xl leading-relaxed">
                We're a real team in a real store in Nairobi. Reach us on WhatsApp for the fastest
                response, or call, email, or walk in during business hours.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 px-5 rounded-xl bg-[#25D366] text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center gap-2 justify-center"
                >
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
                <a
                  href={`tel:${PHONE_RAW}`}
                  className="h-11 px-5 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center gap-2 justify-center"
                >
                  <PhoneIcon />
                  Call us
                </a>
                <Link
                  to="/help"
                  className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                >
                  Help Center
                </Link>
              </div>
            </header>

            <div className="px-5 sm:px-8 py-8 space-y-6">

              {/* ── Contact details + map ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Contact information */}
                <section aria-labelledby="contact-info-heading">
                  <div className="rounded-2xl border border-border p-5 sm:p-6 h-full flex flex-col gap-5">
                    <h2 id="contact-info-heading" className="text-base font-semibold">
                      Get in touch
                    </h2>

                    <div className="space-y-4 text-sm flex-1">
                      {/* Phone */}
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 w-8 h-8 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                          <PhoneIcon />
                        </span>
                        <div>
                          <div className="text-[11px] text-foreground/45 uppercase tracking-wide font-medium mb-0.5">Phone</div>
                          <a href={`tel:${PHONE_RAW}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                            {PHONE_DISPLAY}
                          </a>
                          <div className="text-xs text-foreground/50 mt-0.5">
                            Available Mon–Sat, 9:00 am – 6:00 pm
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp */}
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 w-8 h-8 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                          <WhatsAppIcon />
                        </span>
                        <div>
                          <div className="text-[11px] text-foreground/45 uppercase tracking-wide font-medium mb-0.5">WhatsApp</div>
                          <a
                            href={WHATSAPP}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-foreground hover:text-[#25D366] transition-colors"
                          >
                            {PHONE_DISPLAY}
                          </a>
                          <div className="text-xs text-foreground/50 mt-0.5">
                            Fastest way to reach us — usually reply within minutes
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 w-8 h-8 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                          <MailIcon />
                        </span>
                        <div>
                          <div className="text-[11px] text-foreground/45 uppercase tracking-wide font-medium mb-0.5">Email</div>
                          <a href={`mailto:${EMAIL}`} className="font-semibold text-foreground hover:text-primary transition-colors break-all">
                            {EMAIL}
                          </a>
                          <div className="text-xs text-foreground/50 mt-0.5">
                            We respond within 1 business day
                          </div>
                        </div>
                      </div>

                      {/* Hours */}
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 w-8 h-8 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                          <ClockIcon />
                        </span>
                        <div>
                          <div className="text-[11px] text-foreground/45 uppercase tracking-wide font-medium mb-0.5">Business hours</div>
                          <div className="font-semibold text-foreground">{HOURS}</div>
                          <div className="text-xs text-foreground/50 mt-0.5">
                            Closed Sundays and public holidays
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 w-8 h-8 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                          <MapPinIcon />
                        </span>
                        <div>
                          <div className="text-[11px] text-foreground/45 uppercase tracking-wide font-medium mb-0.5">Store address</div>
                          <address className="not-italic font-semibold text-foreground leading-snug">
                            {ADDRESS}
                          </address>
                          <div className="mt-2.5 flex gap-2">
                            <a
                              href={MAP_URL}
                              target="_blank"
                              rel="noreferrer"
                              className="h-8 px-3 rounded-lg border border-border hover:bg-secondary/10 transition text-xs font-semibold inline-flex items-center"
                            >
                              Open in Maps
                            </a>
                            <a
                              href={MAP_URL}
                              target="_blank"
                              rel="noreferrer"
                              className="h-8 px-3 rounded-lg border border-border hover:bg-secondary/10 transition text-xs font-semibold inline-flex items-center"
                            >
                              Get directions
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Map */}
                <section aria-label="Store location map">
                  <div className="rounded-2xl border border-border overflow-hidden shadow-sm h-full min-h-[340px] flex flex-col">
                    <div className="px-5 py-3.5 border-b border-border bg-background flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{SHOP_NAME}</div>
                        <div className="text-xs text-foreground/55 mt-0.5">Gabrone Plaza, Nairobi CBD</div>
                      </div>
                      <a
                        href={MAP_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-primary hover:underline shrink-0"
                      >
                        View larger map →
                      </a>
                    </div>
                    <div className="flex-1">
                      <iframe
                        title="Zentora store location — Gabrone Plaza, Nairobi CBD"
                        src={mapEmbedUrl}
                        className="w-full h-full min-h-[280px]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* ── Follow us on social ── */}
              <section aria-labelledby="social-heading" className="rounded-2xl border border-border p-6 sm:p-7">
                <h2 id="social-heading" className="text-base font-semibold mb-1">Follow us</h2>
                <p className="text-sm text-foreground/55 mb-5">
                  Stay up to date with new arrivals, deals, and restocks on our social channels.
                  We post daily on TikTok and regularly on Facebook and Instagram.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* WhatsApp */}
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-[#25D366]/25 bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors p-4"
                  >
                    <span className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                      <WhatsAppIcon />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">WhatsApp</div>
                      <div className="text-xs text-foreground/50 truncate">Chat with us directly</div>
                    </div>
                  </a>

                  {/* TikTok */}
                  <a
                    href={TIKTOK}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border hover:border-foreground/20 hover:bg-secondary/5 transition-colors p-4"
                  >
                    <span className="w-10 h-10 rounded-xl bg-foreground/6 text-foreground flex items-center justify-center shrink-0">
                      <TikTokIcon />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">TikTok</div>
                      <div className="text-xs text-foreground/50 truncate">@zentorashop</div>
                    </div>
                  </a>

                  {/* Facebook */}
                  <a
                    href={FACEBOOK}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-[#1877F2]/20 bg-[#1877F2]/4 hover:bg-[#1877F2]/8 transition-colors p-4"
                  >
                    <span className="w-10 h-10 rounded-xl bg-[#1877F2]/12 text-[#1877F2] flex items-center justify-center shrink-0">
                      <FacebookIcon />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">Facebook</div>
                      <div className="text-xs text-foreground/50 truncate">Zentora Shop</div>
                    </div>
                  </a>

                  {/* Instagram */}
                  <a
                    href={INSTAGRAM}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-[#E1306C]/20 bg-[#E1306C]/4 hover:bg-[#E1306C]/8 transition-colors p-4"
                  >
                    <span className="w-10 h-10 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center shrink-0">
                      <InstagramIcon />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">Instagram</div>
                      <div className="text-xs text-foreground/50 truncate">@zentorashop</div>
                    </div>
                  </a>
                </div>
              </section>

              {/* ── How we can help ── */}
              <section aria-labelledby="help-topics-heading" className="rounded-2xl border border-border p-6 sm:p-7">
                <h2 id="help-topics-heading" className="text-base font-semibold mb-1">How can we help?</h2>
                <p className="text-sm text-foreground/55 mb-5">
                  Most questions are answered quickly on WhatsApp. For common topics, our Help Center
                  has step-by-step guidance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      title: "Order & delivery questions",
                      desc: "Track your order, change a delivery address, or ask about dispatch times.",
                      href: WHATSAPP,
                      external: true,
                      cta: "Ask on WhatsApp",
                    },
                    {
                      title: "Returns & refunds",
                      desc: "Start a return, check our 7-day policy, or ask about your refund status.",
                      href: "/returns",
                      external: false,
                      cta: "Return policy",
                    },
                    {
                      title: "Product enquiries",
                      desc: "Want to know if a product is compatible, available, or coming back in stock?",
                      href: WHATSAPP,
                      external: true,
                      cta: "Ask on WhatsApp",
                    },
                    {
                      title: "Account & payments",
                      desc: "Password issues, payment failures, or questions about your order history.",
                      href: "/help",
                      external: false,
                      cta: "Help Center",
                    },
                  ].map(({ title, desc, href, external, cta }) => (
                    <div
                      key={title}
                      className="rounded-xl border border-border p-4 flex flex-col gap-2"
                    >
                      <div className="text-sm font-semibold text-foreground">{title}</div>
                      <p className="text-xs text-foreground/55 leading-relaxed flex-1">{desc}</p>
                      {external ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="self-start text-xs font-semibold text-primary hover:underline mt-1"
                        >
                          {cta} →
                        </a>
                      ) : (
                        <Link
                          to={href}
                          className="self-start text-xs font-semibold text-primary hover:underline mt-1"
                        >
                          {cta} →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Tip + orders CTA ── */}
              <div className="rounded-2xl border border-border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-secondary/3">
                <div>
                  <div className="text-sm font-semibold">Pro tip</div>
                  <div className="text-sm text-foreground/60 mt-1">
                    Always include your <span className="font-semibold text-foreground">order number</span> when
                    contacting support — it cuts response time in half.
                  </div>
                </div>
                <Link
                  to="/account#orders"
                  className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center shrink-0"
                >
                  View my orders
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactUsPage;