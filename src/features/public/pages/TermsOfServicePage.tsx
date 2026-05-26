import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/shared/layouts";

// ── Constants ─────────────────────────────────────────────────────────────────
const EFFECTIVE_DATE  = "1 May 2025";
const LAST_UPDATED    = "1 May 2025";
const SHOP_NAME       = "Zentora Shop";
const SITE_URL        = "https://zentorashop.co.ke";
const CONTACT_EMAIL   = "ezekielmulongo254@gmail.com";
const CONTACT_PHONE   = "+254 795 974 591";
const ADDRESS         = "Gabrone Plaza, 2nd Floor, Nairobi CBD, Kenya";

// ── JSON-LD ───────────────────────────────────────────────────────────────────
const TERMS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service — Zentora",
  description:
    "Read Zentora's Terms of Service governing your use of zentorashop.co.ke, purchases, accounts, and your rights as a customer in Kenya.",
  url: `${SITE_URL}/terms`,
  dateModified: LAST_UPDATED,
  publisher: { "@type": "Organization", name: SHOP_NAME, url: `${SITE_URL}/` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",             item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${SITE_URL}/terms` },
    ],
  },
};

// ── Table of contents ─────────────────────────────────────────────────────────
const TOC = [
  { id: "acceptance",       label: "1. Acceptance of terms" },
  { id: "eligibility",      label: "2. Eligibility" },
  { id: "account",          label: "3. Your account" },
  { id: "products-pricing", label: "4. Products & pricing" },
  { id: "orders-payment",   label: "5. Orders & payment" },
  { id: "delivery",         label: "6. Delivery & shipping" },
  { id: "returns",          label: "7. Returns & refunds" },
  { id: "prohibited",       label: "8. Prohibited conduct" },
  { id: "intellectual",     label: "9. Intellectual property" },
  { id: "liability",        label: "10. Limitation of liability" },
  { id: "disclaimers",      label: "11. Disclaimers" },
  { id: "third-party",      label: "12. Third-party services" },
  { id: "termination",      label: "13. Termination" },
  { id: "governing-law",    label: "14. Governing law & disputes" },
  { id: "changes",          label: "15. Changes to these terms" },
  { id: "contact",          label: "16. Contact us" },
];

// ── Primitives ────────────────────────────────────────────────────────────────
const Section = ({
  id, title, children,
}: { id: string; title: string; children: React.ReactNode }) => (
  <section
    id={id}
    aria-labelledby={`${id}-heading`}
    className="rounded-2xl border border-border p-6 sm:p-7 space-y-3 scroll-mt-20"
  >
    <h2 id={`${id}-heading`} className="text-base font-semibold text-foreground">
      {title}
    </h2>
    <div className="text-sm text-foreground/70 space-y-3 leading-relaxed">{children}</div>
  </section>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2.5">
    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
    <span>{children}</span>
  </li>
);

const Cross = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <span className="mt-0.5 text-red-500 shrink-0 font-bold">✕</span>
    <span>{children}</span>
  </li>
);

const DataRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-[140px_1fr] gap-3 py-2.5 border-t border-border first:border-0 text-sm">
    <span className="text-foreground/50 font-medium shrink-0">{label}</span>
    <span className="text-foreground/80">{value}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const TermsOfServicePage = () => (
  <MainLayout>
    <Helmet>
      <title>Terms of Service | Zentora Kenya — Orders, Payments &amp; Your Rights</title>
      <meta
        name="description"
        content="Zentora Kenya Terms of Service — rules governing zentorashop.co.ke use, orders, M-Pesa payments, delivery, returns and your rights as a customer in Kenya."
      />
      <link rel="canonical" href={`${SITE_URL}/terms`} />
      <meta property="og:type"        content="website" />
      <meta property="og:title"       content="Terms of Service | Zentora Kenya — Orders, Payments &amp; Your Rights" />
      <meta property="og:description" content="The full terms governing your use of zentorashop.co.ke — account rules, how orders and payments work, our delivery and return commitments, and your rights as a customer in Kenya." />
      <meta property="og:url"         content={`${SITE_URL}/terms`} />
      <meta property="og:image"       content={`${SITE_URL}/og-default.png`} />
      <meta name="twitter:card"        content="summary" />
      <meta name="twitter:title"       content="Terms of Service | Zentora Kenya" />
      <meta name="twitter:description" content="Rules covering your use of Zentora — orders, M-Pesa payments, delivery, returns, account use and your rights under Kenyan consumer law." />
      <script type="application/ld+json">{JSON.stringify(TERMS_JSON_LD)}</script>
    </Helmet>

    <div className="bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">

          {/* ── Header ── */}
          <header className="px-5 sm:px-8 py-8 border-b border-border bg-secondary/5">
            <nav className="flex items-center gap-1.5 text-xs text-foreground/40 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground/70">Terms of Service</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-sm text-foreground/60 mt-2 max-w-2xl leading-relaxed">
              These Terms of Service govern your use of{" "}
              <a href={SITE_URL} className="text-primary hover:underline">{SITE_URL}</a> and any
              purchase you make from {SHOP_NAME}. Please read them carefully before using our platform.
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-foreground/40">
              <span>Effective: <span className="text-foreground/60 font-medium">{EFFECTIVE_DATE}</span></span>
              <span>·</span>
              <span>Last updated: <span className="text-foreground/60 font-medium">{LAST_UPDATED}</span></span>
              <span>·</span>
              <span>{SHOP_NAME}</span>
            </div>
          </header>

          <div className="px-5 sm:px-8 py-8 space-y-5">

            {/* ── Plain-language summary ── */}
            <div className="rounded-2xl border border-primary/15 bg-primary/4 p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Plain-language summary</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: "🛒", title: "Shopping",   body: "You can browse and buy on Zentora. You must be 18 or over, or have parental supervision." },
                  { icon: "📦", title: "Orders",     body: "Orders are confirmed only after payment. We may cancel orders if a product is unavailable or a pricing error occurred." },
                  { icon: "⚖️", title: "Disputes",   body: "Kenyan law governs these terms. We'll always try to resolve issues directly before any formal action." },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="flex flex-col gap-1.5">
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm font-semibold text-foreground">{title}</span>
                    <span className="text-xs text-foreground/60 leading-relaxed">{body}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Table of contents ── */}
            <nav aria-label="Terms sections" className="rounded-2xl border border-border p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-3">
                In these terms
              </p>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6">
                {TOC.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="text-sm text-foreground/60 hover:text-primary hover:underline underline-offset-2 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* ── §1 Acceptance ── */}
            <Section id="acceptance" title="1. Acceptance of terms">
              <p>
                By accessing or using{" "}
                <a href={SITE_URL} className="text-primary hover:underline">{SITE_URL}</a> ("the
                Platform"), creating an account, or placing an order, you agree to be bound by these
                Terms of Service ("Terms") and our{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>,
                which is incorporated by reference.
              </p>
              <p>
                If you do not agree with any part of these Terms, you must not use the Platform. We
                reserve the right to update these Terms at any time. Your continued use of the
                Platform after changes are posted constitutes acceptance of the revised Terms.
              </p>
            </Section>

            {/* ── §2 Eligibility ── */}
            <Section id="eligibility" title="2. Eligibility">
              <p>To use the Platform and make purchases, you must:</p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>Be at least <strong>18 years of age</strong>, or be at least 13 years of age with the explicit consent and supervision of a parent or legal guardian who agrees to these Terms on your behalf.</Bullet>
                <Bullet>Have the legal capacity to enter into a binding contract under the laws of Kenya.</Bullet>
                <Bullet>Not be prohibited from using the Platform by any applicable law.</Bullet>
                <Bullet>Provide accurate, current, and complete information when registering or placing an order.</Bullet>
              </ul>
              <p>
                By using the Platform, you represent and warrant that you meet all of the eligibility
                requirements above.
              </p>
            </Section>

            {/* ── §3 Account ── */}
            <Section id="account" title="3. Your account">
              <p>
                You may browse the Platform without an account. However, placing an order, saving
                addresses, and accessing order history requires registration.
              </p>
              <p className="font-medium text-foreground">Your responsibilities:</p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>Provide truthful information when creating your account.</Bullet>
                <Bullet>Keep your password secure and confidential. Do not share it with anyone.</Bullet>
                <Bullet>Notify us immediately at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>{" "}
                  if you suspect unauthorised access to your account.</Bullet>
                <Bullet>Accept responsibility for all activity that occurs under your account credentials.</Bullet>
                <Bullet>Keep your contact details, including delivery address and phone number, up to date.</Bullet>
              </ul>
              <p>
                We reserve the right to suspend or permanently close accounts that violate these
                Terms, engage in fraudulent activity, or are inactive for an extended period.
              </p>
            </Section>

            {/* ── §4 Products & pricing ── */}
            <Section id="products-pricing" title="4. Products & pricing">
              <p>
                We make every effort to ensure product descriptions, images, and prices on the
                Platform are accurate. However:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>Product images are for illustration purposes. Actual colours may vary due to screen calibration.</Bullet>
                <Bullet>All prices are displayed in <strong>Kenyan Shillings (KES)</strong> and are inclusive of applicable taxes unless otherwise stated.</Bullet>
                <Bullet>Prices are subject to change at any time without notice. The price at the time of your order confirmation is the price you will be charged.</Bullet>
                <Bullet>In the event of a pricing error, we reserve the right to cancel the order and offer you the product at the correct price or issue a full refund.</Bullet>
                <Bullet>Promotional discounts and sale prices are valid only for the specified period and cannot be applied retrospectively to past orders.</Bullet>
              </ul>
              <p>
                Product availability is not guaranteed until your order is confirmed. If an item
                becomes unavailable after your order is placed, we will contact you to offer an
                alternative or a full refund.
              </p>
            </Section>

            {/* ── §5 Orders & payment ── */}
            <Section id="orders-payment" title="5. Orders & payment">
              <p>
                Placing an item in your cart does not reserve stock. An order is only confirmed when
                you receive an order confirmation from us.
              </p>
              <p className="font-medium text-foreground">Order process:</p>
              <ul className="space-y-1.5 mt-1">
                <Bullet><strong>Placing an order</strong> — select your items, proceed to checkout, enter your delivery details and complete payment.</Bullet>
                <Bullet><strong>Order confirmation</strong> — you will receive an on-screen confirmation and, where applicable, a confirmation message with your order reference number.</Bullet>
                <Bullet><strong>Contract formation</strong> — a binding contract of sale is formed when we confirm your order and payment has cleared.</Bullet>
                <Bullet><strong>Order cancellation by us</strong> — we reserve the right to cancel or refuse any order due to stock unavailability, pricing errors, suspected fraud, or inability to deliver to your location. We will notify you and issue a full refund where payment has been taken.</Bullet>
              </ul>
              <p className="font-medium text-foreground mt-2">Payment:</p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>We accept <strong>M-Pesa</strong>, bank transfer, and cash on pickup at our Nairobi store.</Bullet>
                <Bullet>Payment must be completed before an order is processed and dispatched.</Bullet>
                <Bullet>You are responsible for ensuring sufficient funds are available. Failed payments will result in the order being cancelled.</Bullet>
                <Bullet>We do not store your M-Pesa PIN or bank credentials. See our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>{" "}
                  for full payment data details.</Bullet>
              </ul>
            </Section>

            {/* ── §6 Delivery ── */}
            <Section id="delivery" title="6. Delivery & shipping">
              <p>
                Delivery terms are set out in full during checkout and on our product pages. Key
                points:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>Delivery is available within Kenya. Rates and timelines are shown at checkout based on your location.</Bullet>
                <Bullet>Estimated delivery times are indicative, not guaranteed. We are not liable for delays caused by courier partners, weather, public holidays, or events outside our control.</Bullet>
                <Bullet>Risk of loss and title for goods purchased from us transfers to you upon delivery to your specified address.</Bullet>
                <Bullet>If no one is available to receive the delivery, the courier will attempt redelivery or leave instructions for collection. Repeated failed deliveries may result in the order being returned to us, and you may be charged for redelivery.</Bullet>
                <Bullet>Ensure your delivery address and contact number are accurate. We are not responsible for undelivered orders due to incorrect information you provided.</Bullet>
              </ul>
            </Section>

            {/* ── §7 Returns ── */}
            <Section id="returns" title="7. Returns & refunds">
              <p>
                Our Return & Refund Policy forms part of these Terms and is incorporated by
                reference. The key points are:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>Most items can be returned within <strong>7 calendar days</strong> of delivery in their original, unused condition.</Bullet>
                <Bullet>Refunds are issued to the original payment method within 1–5 business days of receiving and inspecting the returned item.</Bullet>
                <Bullet>Some categories are non-returnable — see the full{" "}
                  <Link to="/returns" className="text-primary hover:underline">Return Policy</Link>{" "}
                  for details.</Bullet>
              </ul>
              <p>
                For the complete return and refund process, please read our dedicated{" "}
                <Link to="/returns" className="text-primary hover:underline">Return & Refund Policy</Link>.
              </p>
            </Section>

            {/* ── §8 Prohibited conduct ── */}
            <Section id="prohibited" title="8. Prohibited conduct">
              <p>
                By using the Platform, you agree not to:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Cross>Use the Platform for any unlawful purpose or in violation of any applicable Kenyan or international law.</Cross>
                <Cross>Provide false, misleading, or fraudulent information during registration, checkout, or any communication with us.</Cross>
                <Cross>Attempt to gain unauthorised access to any part of the Platform, our servers, or any account other than your own.</Cross>
                <Cross>Use automated tools, bots, or scrapers to access, collect, or submit data on the Platform without our prior written consent.</Cross>
                <Cross>Interfere with or disrupt the Platform's functionality, security, or integrity.</Cross>
                <Cross>Post, submit, or transmit any content that is defamatory, abusive, obscene, fraudulent, or otherwise objectionable.</Cross>
                <Cross>Impersonate any person or entity, or misrepresent your affiliation with any person or entity.</Cross>
                <Cross>Attempt to place fraudulent orders, abuse our return or refund process, or manipulate pricing through technical means.</Cross>
                <Cross>Resell products purchased from Zentora for commercial gain without our written permission.</Cross>
              </ul>
              <p>
                Violation of these prohibitions may result in immediate account suspension, order
                cancellation, and potential legal action. We reserve the right to report fraudulent
                activity to Kenyan law enforcement authorities.
              </p>
            </Section>

            {/* ── §9 Intellectual property ── */}
            <Section id="intellectual" title="9. Intellectual property">
              <p>
                All content on the Platform — including but not limited to text, product
                descriptions, photographs, graphics, logos, icons, and software — is the property of
                {SHOP_NAME} or its content suppliers and is protected under Kenyan and international
                intellectual property laws.
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>You may access and use the Platform for personal, non-commercial shopping purposes only.</Bullet>
                <Bullet>You may not reproduce, distribute, modify, create derivative works from, or commercially exploit any content from the Platform without our prior written consent.</Bullet>
                <Bullet>Product images and descriptions remain the property of Zentora or the respective brand/manufacturer.</Bullet>
                <Bullet>The "Zentora" name, logo, and associated marks are trademarks of {SHOP_NAME}. You may not use them without written permission.</Bullet>
              </ul>
            </Section>

            {/* ── §10 Limitation of liability ── */}
            <Section id="liability" title="10. Limitation of liability">
              <p>
                To the fullest extent permitted by Kenyan law, {SHOP_NAME} and its directors,
                employees, and agents shall not be liable for:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>Any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or any purchase.</Bullet>
                <Bullet>Loss of profits, revenue, data, goodwill, or business opportunity.</Bullet>
                <Bullet>Damages resulting from third-party delivery delays, courier errors, or force majeure events.</Bullet>
                <Bullet>Damage to your device or data caused by viruses or other harmful components that may be transmitted through the Platform, despite our reasonable security measures.</Bullet>
              </ul>
              <p>
                Our total liability to you for any claim arising from these Terms or your use of the
                Platform shall not exceed the amount you paid for the specific order giving rise to
                the claim.
              </p>
              <p>
                Nothing in these Terms excludes or limits liability for death or personal injury
                caused by our negligence, fraud, or any other liability that cannot be excluded under
                Kenyan law.
              </p>
            </Section>

            {/* ── §11 Disclaimers ── */}
            <Section id="disclaimers" title="11. Disclaimers">
              <p>
                The Platform and all content are provided on an "<strong>as is</strong>" and
                "<strong>as available</strong>" basis without warranties of any kind, either express
                or implied, including but not limited to:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>Warranties of merchantability or fitness for a particular purpose.</Bullet>
                <Bullet>Warranties that the Platform will be uninterrupted, error-free, or free of viruses.</Bullet>
                <Bullet>Warranties regarding the accuracy or completeness of product information, prices, or availability at any given time.</Bullet>
              </ul>
              <p>
                We do not warrant that products are suitable for any specific purpose beyond their
                general consumer description. Always review product specifications before purchasing.
              </p>
            </Section>

            {/* ── §12 Third-party services ── */}
            <Section id="third-party" title="12. Third-party services">
              <p>
                The Platform may contain links to, or integrate services from, third parties
                including payment providers (M-Pesa), map services (Google Maps), social login
                providers (Google, Facebook), and courier partners.
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>These third-party services are governed by their own terms and privacy policies, which we encourage you to read.</Bullet>
                <Bullet>We are not responsible for the content, availability, or practices of third-party sites and services.</Bullet>
                <Bullet>Your use of third-party services through our Platform is at your own risk.</Bullet>
              </ul>
            </Section>

            {/* ── §13 Termination ── */}
            <Section id="termination" title="13. Termination">
              <p>
                <strong>By you:</strong> You may close your account at any time by contacting us at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                  {CONTACT_EMAIL}
                </a>
                . Account closure does not affect any outstanding orders or obligations under these Terms.
              </p>
              <p>
                <strong>By us:</strong> We may suspend or terminate your account, cancel pending
                orders, and restrict your access to the Platform without notice if you:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>Breach any provision of these Terms.</Bullet>
                <Bullet>Engage in fraudulent, illegal, or abusive conduct.</Bullet>
                <Bullet>Provide false identity or payment information.</Bullet>
                <Bullet>Take actions that may harm Zentora, its customers, or its reputation.</Bullet>
              </ul>
              <p>
                Sections 8 (Prohibited conduct), 9 (Intellectual property), 10 (Limitation of
                liability), and 14 (Governing law) survive termination of these Terms.
              </p>
            </Section>

            {/* ── §14 Governing law ── */}
            <Section id="governing-law" title="14. Governing law & disputes">
              <p>
                These Terms are governed by and construed in accordance with the laws of the{" "}
                <strong>Republic of Kenya</strong>, without regard to its conflict of law provisions.
              </p>
              <p>
                <strong>Dispute resolution:</strong> In the event of a dispute arising from these
                Terms or any purchase on the Platform, we encourage you to contact us first:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet><strong>Step 1 — Direct resolution:</strong> Contact our support team at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>{" "}
                  or <a href={`tel:${CONTACT_PHONE.replace(/\s/g,"")}`} className="text-primary hover:underline">{CONTACT_PHONE}</a>.
                  We will make every effort to resolve the issue within 14 business days.</Bullet>
                <Bullet><strong>Step 2 — Mediation:</strong> If direct resolution fails, the parties agree to attempt mediation before any formal legal proceedings.</Bullet>
                <Bullet><strong>Step 3 — Litigation:</strong> If mediation is unsuccessful, disputes shall be submitted to the exclusive jurisdiction of the courts of Kenya.</Bullet>
              </ul>
              <p>
                Consumer disputes may also be escalated to the <strong>Kenya Consumer Protection Advisory Committee</strong> or other relevant regulatory bodies.
              </p>
            </Section>

            {/* ── §15 Changes ── */}
            <Section id="changes" title="15. Changes to these terms">
              <p>
                We may revise these Terms at any time. When we make material changes, we will:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>Update the "Last updated" date at the top of this page.</Bullet>
                <Bullet>Display a notice on the Platform for significant changes.</Bullet>
                <Bullet>Email registered users when changes materially affect their rights or obligations.</Bullet>
              </ul>
              <p>
                Your continued use of the Platform after the effective date of any changes constitutes
                your acceptance of the revised Terms. If you disagree, you should stop using the
                Platform and may close your account.
              </p>
            </Section>

            {/* ── §16 Contact ── */}
            <Section id="contact" title="16. Contact us">
              <p>
                For any questions, concerns, or notices relating to these Terms, please contact us:
              </p>
              <div className="rounded-xl bg-secondary/5 border border-border p-4 text-sm space-y-1 mt-2">
                <DataRow label="Business"   value={SHOP_NAME} />
                <DataRow label="Address"    value={ADDRESS} />
                <DataRow label="Email"      value={<a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>} />
                <DataRow label="Phone"      value={<a href={`tel:${CONTACT_PHONE.replace(/\s/g,"")}`} className="text-primary hover:underline">{CONTACT_PHONE}</a>} />
                <DataRow label="Hours"      value="Monday – Saturday, 9:00 am – 6:00 pm" />
              </div>
            </Section>

            {/* ── Related links ── */}
            <section aria-labelledby="related-heading" className="rounded-2xl border border-border p-6 sm:p-7">
              <h2 id="related-heading" className="text-sm font-semibold text-foreground mb-4">
                Related policies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Privacy Policy",       sub: "How we collect and use your data.", to: "/privacy"  },
                  { label: "Return & Refund Policy", sub: "7-day returns and refund process.", to: "/returns" },
                  { label: "Help Center",          sub: "FAQs and support guides.",           to: "/help"    },
                ].map(({ label, sub, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="rounded-xl border border-border p-4 hover:bg-secondary/5 hover:border-primary/20 transition-all group"
                  >
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</div>
                    <div className="text-xs text-foreground/50 mt-1">{sub}</div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ── CTA footer ── */}
            <div className="rounded-2xl border border-border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-secondary/3">
              <div>
                <div className="text-sm font-semibold">Questions about these terms?</div>
                <div className="text-sm text-foreground/60 mt-0.5">
                  We're happy to explain anything — just reach out.
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="h-11 px-5 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center justify-center"
                >
                  Email us
                </a>
                <Link
                  to="/contact"
                  className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                >
                  Contact options
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </MainLayout>
);

export default TermsOfServicePage;