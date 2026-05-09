import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/shared/layouts";

// ── Constants ─────────────────────────────────────────────────────────────────
const EFFECTIVE_DATE    = "1 May 2025";
const WINDOW_DAYS       = 7;
const SUPPORT_EMAIL     = "ezekielmulongo254@gmail.com";
const SUPPORT_PHONE     = "+254 795 974 591";
const SUPPORT_PHONE_RAW = "+254795974591";
const SHOP_NAME         = "Zentora Shop";
const WHATSAPP          = `https://wa.me/${SUPPORT_PHONE_RAW.replace("+", "")}?text=${encodeURIComponent("Hi Zentora, I'd like to start a return for order #")}`;

// ── JSON-LD blocks ────────────────────────────────────────────────────────────

// WebPage + BreadcrumbList
const PAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Return & Refund Policy — Zentora",
  description: `Zentora accepts returns within ${WINDOW_DAYS} days of delivery on items in original condition. Refunds via M-Pesa, bank transfer, or store credit.`,
  url: "https://zentorashop.co.ke/returns",
  dateModified: "2025-05-01",
  publisher: {
    "@type": "Organization",
    name: SHOP_NAME,
    url: "https://zentorashop.co.ke/",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",    item: "https://zentorashop.co.ke/" },
      { "@type": "ListItem", position: 2, name: "Returns", item: "https://zentorashop.co.ke/returns" },
    ],
  },
};

// MerchantReturnPolicy — powers the return badge in Google Shopping results
const MERCHANT_RETURN_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MerchantReturnPolicy",
  name: "Zentora 7-Day Return Policy",
  url: "https://zentorashop.co.ke/returns",
  applicableCountry: "KE",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: WINDOW_DAYS,
  returnMethod: "https://schema.org/ReturnByMail",
  returnFees: "https://schema.org/FreeReturn",
  refundType: "https://schema.org/FullRefund",
};

// ── Primitives ────────────────────────────────────────────────────────────────
const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    className="rounded-2xl border border-border p-6 sm:p-7 space-y-3"
    aria-labelledby={`${id}-heading`}
  >
    <h2 id={`${id}-heading`} className="text-base font-semibold text-foreground">
      {title}
    </h2>
    <div className="text-sm text-foreground/70 space-y-2">{children}</div>
  </section>
);

const Badge = ({ label, sub }: { label: string; sub: string }) => (
  <div className="rounded-2xl border border-border p-5 flex flex-col gap-1">
    <span className="text-sm font-semibold text-foreground">{label}</span>
    <span className="text-sm text-foreground/60">{sub}</span>
  </div>
);

const Check = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <span className="mt-0.5 text-green-600 shrink-0">✓</span>
    <span>{children}</span>
  </li>
);

const Cross = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <span className="mt-0.5 text-red-500 shrink-0">✕</span>
    <span>{children}</span>
  </li>
);

const Step = ({ n, title, desc }: { n: number; title: string; desc: string }) => (
  <div className="flex gap-4">
    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
      {n}
    </div>
    <div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="text-sm text-foreground/60 mt-0.5">{desc}</div>
    </div>
  </div>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor">
    <path d="M19.11 17.59c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.21-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.44.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.87c.14.18 1.93 2.95 4.68 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z" />
    <path d="M16.03 3C8.86 3 3.03 8.82 3.03 15.99c0 2.28.6 4.5 1.74 6.46L3 29l6.73-1.76a12.9 12.9 0 006.3 1.62h.01c7.17 0 13-5.82 13-12.99C29.04 8.82 23.2 3 16.03 3Zm0 23.62h-.01a10.77 10.77 0 01-5.5-1.52l-.39-.23-3.99 1.04 1.06-3.89-.25-.4a10.8 10.8 0 01-1.65-5.71c0-5.95 4.84-10.79 10.79-10.79 2.88 0 5.58 1.12 7.61 3.16a10.72 10.72 0 013.15 7.62c0 5.95-4.84 10.79-10.82 10.79Z" />
  </svg>
);

// ── Table of contents ─────────────────────────────────────────────────────────
const TOC = [
  { id: "eligibility",    label: "1. Return eligibility" },
  { id: "how-to-return",  label: "2. How to start a return" },
  { id: "refunds",        label: "3. Refunds" },
  { id: "damaged",        label: "4. Damaged, defective, or wrong items" },
  { id: "exchanges",      label: "5. Exchanges" },
  { id: "non-returnable", label: "6. Non-returnable categories" },
  { id: "notes",          label: "7. Important notes" },
];

// ─────────────────────────────────────────────────────────────────────────────

const ReturnPolicyPage = () => {
  return (
    <MainLayout>

      {/* ── SEO ── */}
      <Helmet>
        <title>Return &amp; Refund Policy | Zentora Kenya — 7-Day Returns</title>
        <meta
          name="description"
          content="Zentora Kenya accepts returns within 7 days of delivery on items in original condition. Refunds via M-Pesa or bank transfer. Simple 5-step return process."
        />
        <link rel="canonical" href="https://zentorashop.co.ke/returns" />
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content="Return & Refund Policy | Zentora Kenya — 7-Day Returns" />
        <meta property="og:description" content="7-day return window. Refunds via M-Pesa or bank transfer. Damaged items covered at no charge. Learn how to start a return at Zentora." />
        <meta property="og:url"         content="https://zentorashop.co.ke/returns" />
        <meta property="og:image"       content="https://zentorashop.co.ke/og-default.png" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Return & Refund Policy | Zentora Kenya" />
        <meta name="twitter:description" content="7-day returns. Refunds via M-Pesa or bank transfer. Damaged items replaced free of charge." />
        <script type="application/ld+json">{JSON.stringify(PAGE_JSON_LD)}</script>
        <script type="application/ld+json">{JSON.stringify(MERCHANT_RETURN_JSON_LD)}</script>
      </Helmet>

      <div className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">

            {/* ── Header ── */}
            <header className="px-5 sm:px-8 py-8 border-b border-border bg-secondary/5">
              {/* Breadcrumb */}
              <nav
                className="flex items-center gap-1.5 text-xs text-foreground/40 mb-4"
                aria-label="Breadcrumb"
              >
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <span className="text-foreground/70">Return &amp; Refund Policy</span>
              </nav>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                    Return &amp; Refund Policy
                  </h1>
                  <p className="text-sm text-foreground/60 mt-2 max-w-2xl leading-relaxed">
                    We want you to be completely satisfied with your purchase. If something isn't right,
                    we'll work with you to make it right — within the terms below.
                  </p>
                  <p className="text-xs text-foreground/40 mt-3">
                    Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; {SHOP_NAME}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Link
                    to="/contact"
                    className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/account#orders"
                    className="h-11 px-5 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center justify-center"
                  >
                    My Orders
                  </Link>
                </div>
              </div>
            </header>

            <div className="px-5 sm:px-8 py-8 space-y-6">

              {/* ── At-a-glance ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Badge label={`${WINDOW_DAYS}-day return window`}   sub="From the date you receive your order." />
                <Badge label="Original condition required"           sub="Unused, undamaged, with original packaging." />
                <Badge label="Refund or exchange"                    sub="Your choice — store credit, replacement, or refund." />
              </div>

              {/* ── Quick-start CTA (new) ── */}
              <div className="rounded-2xl border border-primary/15 bg-primary/4 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">Want to start a return right now?</div>
                  <div className="text-sm text-foreground/60 mt-0.5">
                    WhatsApp us your order number — it's the fastest way to get the process started.
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="h-10 px-4 rounded-xl bg-[#25D366] text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center gap-2 justify-center"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${SUPPORT_PHONE_RAW}`}
                    className="h-10 px-4 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                  >
                    Call us
                  </a>
                </div>
              </div>

              {/* ── Table of contents (new) ── */}
              <nav
                aria-label="Policy sections"
                className="rounded-2xl border border-border p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-3">
                  In this policy
                </p>
                <ol className="space-y-1.5">
                  {TOC.map(({ id, label }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="text-sm text-foreground/65 hover:text-primary transition-colors hover:underline underline-offset-2"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              {/* ── Section 1 ── */}
              <Section id="eligibility" title="1. Return eligibility">
                <p>
                  You may return most items purchased from {SHOP_NAME} within{" "}
                  <strong>{WINDOW_DAYS} calendar days</strong> of the delivery date, provided the item
                  meets all conditions below.
                </p>

                <p className="font-medium text-foreground mt-1">Items we accept back:</p>
                <ul className="space-y-1.5 mt-1">
                  <Check>Item is in the same condition as when it was delivered — unused and unaltered.</Check>
                  <Check>Original packaging, accessories, manuals, and any included gifts are present.</Check>
                  <Check>Tags, seals, and shrink-wrap are intact and have not been removed or broken.</Check>
                  <Check>Return is initiated within {WINDOW_DAYS} days of confirmed delivery.</Check>
                  <Check>Proof of purchase (order number or receipt) is provided.</Check>
                </ul>

                <p className="font-medium text-foreground mt-3">Items we cannot accept back:</p>
                <ul className="space-y-1.5 mt-1">
                  <Cross>Item shows signs of use, wear, physical damage, or tampering after delivery.</Cross>
                  <Cross>Original packaging has been discarded or is significantly damaged.</Cross>
                  <Cross>Seals, hygiene stickers, or security tags have been removed (applies to personal care, earphones, etc.).</Cross>
                  <Cross>Return request is submitted more than {WINDOW_DAYS} days after delivery.</Cross>
                  <Cross>Item was purchased during a final-sale or clearly-marked non-returnable promotion.</Cross>
                  <Cross>Software, digital products, or downloadable content once activated or accessed.</Cross>
                  <Cross>Consumable goods that have been opened (batteries, lubricants, cartridges).</Cross>
                </ul>
              </Section>

              {/* ── Section 2 ── */}
              <Section id="how-to-return" title="2. How to start a return">
                <p>Follow these steps to request a return or exchange:</p>
                <div className="mt-4 space-y-4">
                  <Step
                    n={1}
                    title="Contact our support team"
                    desc={`Email us at ${SUPPORT_EMAIL} or call ${SUPPORT_PHONE} within ${WINDOW_DAYS} days of receiving your order. Include your order number and a brief description of the issue.`}
                  />
                  <Step
                    n={2}
                    title="Receive a return authorisation"
                    desc="We will review your request and send you a Return Merchandise Authorisation (RMA) reference and return instructions within 1–2 business days."
                  />
                  <Step
                    n={3}
                    title="Package the item securely"
                    desc="Repack the item in its original packaging with all accessories and documents included. Attach or write the RMA reference clearly on the outside of the package."
                  />
                  <Step
                    n={4}
                    title="Drop off or arrange collection"
                    desc="Bring the package to our Nairobi CBD location (Gabrone Plaza, 2nd Floor) or arrange a courier pickup as instructed. Keep your shipping receipt as proof."
                  />
                  <Step
                    n={5}
                    title="Refund or exchange processed"
                    desc="Once we receive and inspect the item (typically 1–3 business days), we will process your refund or dispatch your replacement."
                  />
                </div>
              </Section>

              {/* ── Section 3 ── */}
              <Section id="refunds" title="3. Refunds">
                <p>
                  Approved refunds are issued using the original payment method where possible. Processing
                  times vary by method:
                </p>
                <div className="mt-3 rounded-xl border border-border overflow-hidden text-sm">
                  <div className="grid grid-cols-2 bg-secondary/10 px-4 py-2 font-semibold text-foreground text-xs uppercase tracking-wide">
                    <span>Payment method</span>
                    <span>Refund timeline</span>
                  </div>
                  {[
                    ["M-Pesa / Mobile money", "1–3 business days"],
                    ["Bank transfer",         "3–5 business days"],
                    ["Store credit",          "Instant upon approval"],
                  ].map(([method, time]) => (
                    <div
                      key={method}
                      className="grid grid-cols-2 px-4 py-3 border-t border-border text-foreground/70"
                    >
                      <span>{method}</span>
                      <span>{time}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3">
                  If you prefer, we can issue a <strong>store credit</strong> or arrange a direct{" "}
                  <strong>exchange</strong> for a different size, colour, or variant of the same product —
                  subject to availability.
                </p>
                <p>
                  Shipping fees paid at the time of purchase are non-refundable unless the return is due
                  to our error (wrong item sent, item arrived damaged).
                </p>
              </Section>

              {/* ── Section 4 ── */}
              <Section id="damaged" title="4. Damaged, defective, or wrong items">
                <p>
                  If your order arrives damaged, defective, or is not what you ordered, we will cover
                  all return shipping costs and offer you a full refund or replacement at no extra charge.
                </p>
                <ul className="space-y-1.5 mt-2">
                  <Check>Report the issue within 48 hours of delivery for fastest resolution.</Check>
                  <Check>Photograph the damage or incorrect item and send it with your support request.</Check>
                  <Check>We will arrange a pickup or provide a prepaid return label.</Check>
                  <Check>Priority processing — resolved within 2 business days of us receiving the item.</Check>
                </ul>
              </Section>

              {/* ── Section 5 ── */}
              <Section id="exchanges" title="5. Exchanges">
                <p>
                  We offer direct exchanges for the same product in a different size, colour, or variant.
                  If the desired variant is out of stock, we will issue a full refund or store credit.
                </p>
                <p>
                  Exchanges are subject to the same {WINDOW_DAYS}-day window and condition requirements
                  as standard returns. Any price difference between variants will be charged or refunded
                  accordingly.
                </p>
              </Section>

              {/* ── Section 6 ── */}
              <Section id="non-returnable" title="6. Non-returnable product categories">
                <p>
                  The following categories are non-returnable due to health, safety, or digital delivery
                  reasons unless the item arrives defective or damaged:
                </p>
                <ul className="space-y-1.5 mt-2">
                  <Cross>Personal care and hygiene products once opened (earphones, trimmers, massagers).</Cross>
                  <Cross>Consumables and perishables once unsealed.</Cross>
                  <Cross>Digital products, activation codes, and software licences once redeemed.</Cross>
                  <Cross>Customised or personalised items made to order.</Cross>
                  <Cross>Items marked "Final Sale" at the time of purchase.</Cross>
                </ul>
              </Section>

              {/* ── Section 7 ── */}
              <Section id="notes" title="7. Important notes">
                <p>
                  {SHOP_NAME} reserves the right to refuse a return that does not meet the eligibility
                  criteria above. If a return is declined, we will notify you with the reason and, where
                  possible, return the item to you at your expense.
                </p>
                <p>
                  We do not offer cash refunds at our physical location. All monetary refunds are
                  processed electronically to the original payment source or as store credit.
                </p>
                <p>
                  This policy applies to purchases made directly through {SHOP_NAME}. Items purchased
                  through third-party sellers or marketplaces are subject to those sellers' own policies.
                </p>
                <p>
                  We may update this policy from time to time. The version displayed on this page is
                  always the current version. Continued use of our store after changes are posted
                  constitutes acceptance of the updated policy.
                </p>
              </Section>

              {/* ── Related links (new) ── */}
              <section
                aria-labelledby="related-heading"
                className="rounded-2xl border border-border p-6 sm:p-7"
              >
                <h2
                  id="related-heading"
                  className="text-sm font-semibold text-foreground mb-4"
                >
                  Related policies &amp; support
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Help Center",     sub: "FAQs and step-by-step guides.",   to: "/help"     },
                    { label: "Contact Support", sub: "Reach us by WhatsApp or phone.",  to: "/contact"  },
                    { label: "All Products",    sub: "Continue shopping.",              to: "/products" },
                  ].map(({ label, sub, to }) => (
                    <Link
                      key={label}
                      to={to}
                      className="rounded-xl border border-border p-4 hover:bg-secondary/5 hover:border-primary/20 transition-all group"
                    >
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {label}
                      </div>
                      <div className="text-xs text-foreground/55 mt-1">{sub}</div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* ── CTA footer ── */}
              <div className="rounded-2xl border border-border p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">Ready to start a return?</div>
                  <div className="text-sm text-foreground/60 mt-1">
                    Contact us with your order number and we'll guide you through the process.
                  </div>
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
                    className="h-11 px-5 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center justify-center"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReturnPolicyPage;