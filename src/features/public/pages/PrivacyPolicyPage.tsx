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
const POLICY_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy — Zentora",
  description:
    "Zentora's Privacy Policy explains how we collect, use, and protect your personal data when you shop on zentorashop.co.ke.",
  url: `${SITE_URL}/privacy`,
  dateModified: LAST_UPDATED,
  publisher: { "@type": "Organization", name: SHOP_NAME, url: `${SITE_URL}/` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",    item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE_URL}/privacy` },
    ],
  },
};

// ── Table of contents ─────────────────────────────────────────────────────────
const TOC = [
  { id: "who-we-are",          label: "1. Who we are" },
  { id: "data-we-collect",     label: "2. Data we collect" },
  { id: "how-we-use",          label: "3. How we use your data" },
  { id: "legal-basis",         label: "4. Legal basis for processing" },
  { id: "sharing",             label: "5. When we share your data" },
  { id: "cookies",             label: "6. Cookies & tracking" },
  { id: "data-retention",      label: "7. How long we keep your data" },
  { id: "your-rights",         label: "8. Your rights" },
  { id: "security",            label: "9. Security" },
  { id: "third-parties",       label: "10. Third-party links" },
  { id: "children",            label: "11. Children's privacy" },
  { id: "changes",             label: "12. Changes to this policy" },
  { id: "contact",             label: "13. Contact & complaints" },
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

const DataRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-[140px_1fr] gap-3 py-2.5 border-t border-border first:border-0 text-sm">
    <span className="text-foreground/50 font-medium shrink-0">{label}</span>
    <span className="text-foreground/80">{value}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const PrivacyPolicyPage = () => (
  <MainLayout>
    <Helmet>
      <title>Privacy Policy | Zentora Kenya — How We Use Your Data</title>
      <meta
        name="description"
        content="Read Zentora Kenya's Privacy Policy to understand how we collect, use, store and protect your personal data when you shop on zentorashop.co.ke."
      />
      <link rel="canonical" href={`${SITE_URL}/privacy`} />
      <meta property="og:type"        content="website" />
      <meta property="og:title"       content="Privacy Policy | Zentora Kenya" />
      <meta property="og:description" content="How Zentora collects, uses and protects your personal data." />
      <meta property="og:url"         content={`${SITE_URL}/privacy`} />
      <meta property="og:image"       content={`${SITE_URL}/og-default.png`} />
      <meta name="twitter:card"        content="summary" />
      <meta name="twitter:title"       content="Privacy Policy | Zentora Kenya" />
      <meta name="twitter:description" content="How Zentora collects, uses and protects your personal data." />
      <script type="application/ld+json">{JSON.stringify(POLICY_JSON_LD)}</script>
    </Helmet>

    <div className="bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">

          {/* ── Header ── */}
          <header className="px-5 sm:px-8 py-8 border-b border-border bg-secondary/5">
            <nav className="flex items-center gap-1.5 text-xs text-foreground/40 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground/70">Privacy Policy</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-sm text-foreground/60 mt-2 max-w-2xl leading-relaxed">
              We respect your privacy. This policy explains what personal data {SHOP_NAME} collects,
              why we collect it, how we use it, and what rights you have over it.
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

            {/* ── Summary badges ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: "🔒", label: "We never sell your data", sub: "Your information is never sold to third parties." },
                { icon: "🇰🇪", label: "Kenyan law compliant",    sub: "We operate under Kenya's Data Protection Act 2019." },
                { icon: "✉️", label: "You stay in control",     sub: "Access, correct or delete your data at any time." },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="rounded-2xl border border-border p-4 flex flex-col gap-1.5">
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                  <span className="text-xs text-foreground/55 leading-relaxed">{sub}</span>
                </div>
              ))}
            </div>

            {/* ── Table of contents ── */}
            <nav aria-label="Policy sections" className="rounded-2xl border border-border p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-3">
                In this policy
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

            {/* ── Section 1 ── */}
            <Section id="who-we-are" title="1. Who we are">
              <p>
                {SHOP_NAME} ("<strong>Zentora</strong>", "<strong>we</strong>", "<strong>our</strong>") is
                an online marketplace based in Nairobi, Kenya, operating at{" "}
                <a href={SITE_URL} className="text-primary hover:underline">{SITE_URL}</a>.
                We sell electronics, appliances, and everyday essentials to customers across Kenya.
              </p>
              <p>
                For the purposes of Kenya's Data Protection Act 2019, Zentora is the
                <strong> data controller</strong> of the personal information you provide when you create
                an account, place an order, or otherwise interact with our platform.
              </p>
              <div className="rounded-xl bg-secondary/5 border border-border p-4 text-sm space-y-1">
                <DataRow label="Business name" value={SHOP_NAME} />
                <DataRow label="Location"      value={ADDRESS} />
                <DataRow label="Email"         value={<a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>} />
                <DataRow label="Phone"         value={<a href={`tel:${CONTACT_PHONE.replace(/\s/g,"")}`} className="text-primary hover:underline">{CONTACT_PHONE}</a>} />
              </div>
            </Section>

            {/* ── Section 2 ── */}
            <Section id="data-we-collect" title="2. Data we collect">
              <p>We collect only the data necessary to provide you with a good shopping experience.</p>

              <p className="font-medium text-foreground">Data you provide directly:</p>
              <ul className="space-y-1.5 mt-1">
                <Bullet><strong>Account data</strong> — name, email address, phone number, and password (hashed) when you register.</Bullet>
                <Bullet><strong>Delivery data</strong> — physical address, building name, and delivery instructions when you place an order.</Bullet>
                <Bullet><strong>Payment data</strong> — M-Pesa transaction reference numbers. We do not store your M-Pesa PIN, bank card numbers, or full payment credentials.</Bullet>
                <Bullet><strong>Communications</strong> — messages you send us via WhatsApp, email, or our contact form, including order queries and support requests.</Bullet>
                <Bullet><strong>Reviews</strong> — product reviews, ratings, and any text or media you submit publicly on the platform.</Bullet>
              </ul>

              <p className="font-medium text-foreground mt-2">Data collected automatically:</p>
              <ul className="space-y-1.5 mt-1">
                <Bullet><strong>Usage data</strong> — pages visited, products viewed, search queries, time on site, click paths, and cart activity.</Bullet>
                <Bullet><strong>Device & browser data</strong> — IP address, browser type, operating system, screen resolution, and referring URL.</Bullet>
                <Bullet><strong>Cookies & local storage</strong> — see Section 6 for full details.</Bullet>
              </ul>

              <p className="font-medium text-foreground mt-2">Data from third parties:</p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>If you sign in using Google or Facebook, we receive your name, email address, and profile picture from that provider, subject to your settings with them.</Bullet>
                <Bullet>Payment processors may share transaction status data (success/failure) with us to fulfil your order.</Bullet>
              </ul>
            </Section>

            {/* ── Section 3 ── */}
            <Section id="how-we-use" title="3. How we use your data">
              <p>We use your data for the following purposes:</p>
              <ul className="space-y-1.5 mt-1">
                <Bullet><strong>Order fulfilment</strong> — processing purchases, arranging delivery, sending order confirmations and dispatch notifications.</Bullet>
                <Bullet><strong>Account management</strong> — maintaining your account, enabling order history, saved addresses, and wishlist functionality.</Bullet>
                <Bullet><strong>Customer support</strong> — responding to queries, managing returns, and resolving disputes.</Bullet>
                <Bullet><strong>Payment processing</strong> — verifying M-Pesa transactions and issuing refunds.</Bullet>
                <Bullet><strong>Personalisation</strong> — showing products relevant to your browsing history and past purchases.</Bullet>
                <Bullet><strong>Marketing</strong> — sending promotional emails or SMS messages about new arrivals, deals, and offers, where you have given us consent or where permitted by law. You can opt out at any time.</Bullet>
                <Bullet><strong>Fraud prevention</strong> — detecting and preventing fraudulent transactions and unauthorised account access.</Bullet>
                <Bullet><strong>Legal obligations</strong> — complying with tax, accounting, and regulatory requirements under Kenyan law.</Bullet>
                <Bullet><strong>Analytics & improvement</strong> — understanding how people use our platform so we can improve the shopping experience.</Bullet>
              </ul>
              <p>
                We do <strong>not</strong> use your data for automated decision-making that produces
                significant legal effects, nor do we sell your personal data to any third party.
              </p>
            </Section>

            {/* ── Section 4 ── */}
            <Section id="legal-basis" title="4. Legal basis for processing">
              <p>
                Under Kenya's Data Protection Act 2019 and aligned with GDPR principles, we process
                your personal data on one or more of the following legal bases:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet><strong>Contract performance</strong> — to fulfil your order and deliver goods you have purchased.</Bullet>
                <Bullet><strong>Legitimate interests</strong> — for fraud prevention, analytics, and improving our services, where these interests do not override your rights.</Bullet>
                <Bullet><strong>Consent</strong> — for marketing communications and optional cookies. You may withdraw consent at any time.</Bullet>
                <Bullet><strong>Legal obligation</strong> — to comply with tax, financial, and regulatory requirements.</Bullet>
              </ul>
            </Section>

            {/* ── Section 5 ── */}
            <Section id="sharing" title="5. When we share your data">
              <p>
                We share your data only where necessary and with parties who are contractually
                required to protect it. We never sell your data.
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet><strong>Delivery partners</strong> — your name, phone number, and delivery address are shared with courier companies to complete delivery of your order.</Bullet>
                <Bullet><strong>Payment processors</strong> — M-Pesa and any other authorised payment gateway we use to process transactions.</Bullet>
                <Bullet><strong>Cloud & hosting providers</strong> — our infrastructure providers who store and process data on our behalf under strict data processing agreements.</Bullet>
                <Bullet><strong>Analytics tools</strong> — anonymised and aggregated usage data may be shared with analytics platforms to help us understand site performance.</Bullet>
                <Bullet><strong>Legal authorities</strong> — we may disclose data to Kenyan law enforcement or regulators when required by law, court order, or to protect our legal rights.</Bullet>
                <Bullet><strong>Business transfers</strong> — if Zentora is acquired or merges with another business, your data may be transferred as part of that transaction. We will notify you beforehand.</Bullet>
              </ul>
            </Section>

            {/* ── Section 6 ── */}
            <Section id="cookies" title="6. Cookies & tracking">
              <p>
                We use cookies and similar technologies to make our website work, remember your
                preferences, and analyse traffic.
              </p>

              <div className="rounded-xl border border-border overflow-hidden text-sm mt-2">
                <div className="grid grid-cols-3 bg-secondary/10 px-4 py-2 font-semibold text-foreground text-xs uppercase tracking-wide">
                  <span>Type</span>
                  <span>Purpose</span>
                  <span>Duration</span>
                </div>
                {[
                  ["Essential",   "Login session, cart, security tokens",         "Session / 30 days"],
                  ["Functional",  "Language, theme, remembered preferences",       "Up to 1 year"],
                  ["Analytics",   "Page views, traffic sources, product interest", "Up to 2 years"],
                  ["Marketing",   "Personalised ads (only with consent)",          "Up to 90 days"],
                ].map(([type, purpose, duration]) => (
                  <div key={type} className="grid grid-cols-3 px-4 py-3 border-t border-border text-foreground/70">
                    <span className="font-medium text-foreground">{type}</span>
                    <span>{purpose}</span>
                    <span>{duration}</span>
                  </div>
                ))}
              </div>

              <p className="mt-2">
                Essential cookies are required for the site to function. You can control all other
                cookies through your browser settings. Disabling analytics or functional cookies may
                affect your experience but will not prevent you from shopping.
              </p>
            </Section>

            {/* ── Section 7 ── */}
            <Section id="data-retention" title="7. How long we keep your data">
              <p>We retain your data for as long as necessary for the purpose it was collected:</p>
              <ul className="space-y-1.5 mt-1">
                <Bullet><strong>Account data</strong> — kept for the lifetime of your account plus 2 years after closure, to handle any post-closure queries.</Bullet>
                <Bullet><strong>Order records</strong> — kept for 7 years to meet Kenyan tax and accounting obligations under the Income Tax Act.</Bullet>
                <Bullet><strong>Customer support messages</strong> — kept for 2 years after resolution.</Bullet>
                <Bullet><strong>Marketing consent records</strong> — kept until you withdraw consent plus 1 year for compliance evidence.</Bullet>
                <Bullet><strong>Analytics data</strong> — aggregated and anonymised after 26 months.</Bullet>
              </ul>
              <p>
                When data is no longer needed, we securely delete or anonymise it so it can no
                longer be linked to you personally.
              </p>
            </Section>

            {/* ── Section 8 ── */}
            <Section id="your-rights" title="8. Your rights">
              <p>
                Under Kenya's Data Protection Act 2019 you have the following rights over your
                personal data:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet><strong>Right of access</strong> — request a copy of the personal data we hold about you.</Bullet>
                <Bullet><strong>Right to rectification</strong> — ask us to correct inaccurate or incomplete data.</Bullet>
                <Bullet><strong>Right to erasure</strong> — ask us to delete your personal data, subject to legal obligations that require us to retain certain records.</Bullet>
                <Bullet><strong>Right to restriction</strong> — ask us to limit how we process your data while a dispute is being resolved.</Bullet>
                <Bullet><strong>Right to data portability</strong> — receive your data in a machine-readable format.</Bullet>
                <Bullet><strong>Right to object</strong> — object to processing based on legitimate interests, including direct marketing. We will stop unless we can demonstrate compelling legitimate grounds.</Bullet>
                <Bullet><strong>Right to withdraw consent</strong> — where processing is based on your consent, withdraw it at any time without affecting the lawfulness of prior processing.</Bullet>
              </ul>
              <p>
                To exercise any of these rights, contact us at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                  {CONTACT_EMAIL}
                </a>
                . We will respond within <strong>30 days</strong>. We may need to verify your identity
                before actioning your request.
              </p>
              <p>
                If you are unsatisfied with our response, you may lodge a complaint with Kenya's{" "}
                <strong>Office of the Data Protection Commissioner (ODPC)</strong> at{" "}
                <a href="https://www.odpc.go.ke" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  www.odpc.go.ke
                </a>
                .
              </p>
            </Section>

            {/* ── Section 9 ── */}
            <Section id="security" title="9. Security">
              <p>
                We take reasonable technical and organisational measures to protect your data against
                unauthorised access, disclosure, alteration, or destruction:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>All data transmitted between your browser and our servers is encrypted using HTTPS/TLS.</Bullet>
                <Bullet>Passwords are hashed using industry-standard algorithms — we never store plain-text passwords.</Bullet>
                <Bullet>Access to production data is restricted to authorised personnel only.</Bullet>
                <Bullet>Payment data is processed directly by M-Pesa and our payment partners — we do not store full card numbers or PINs.</Bullet>
                <Bullet>We conduct periodic security reviews of our infrastructure and code.</Bullet>
              </ul>
              <p>
                No method of transmission over the internet is 100% secure. If you suspect
                unauthorised access to your account, contact us immediately at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                  {CONTACT_EMAIL}
                </a>{" "}
                or call{" "}
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g,"")}`} className="text-primary hover:underline">
                  {CONTACT_PHONE}
                </a>
                .
              </p>
            </Section>

            {/* ── Section 10 ── */}
            <Section id="third-parties" title="10. Third-party links">
              <p>
                Our website may contain links to external websites, social media platforms, or
                third-party services (for example, Google Maps embeds or social sharing buttons).
                This Privacy Policy applies only to{" "}
                <a href={SITE_URL} className="text-primary hover:underline">{SITE_URL}</a>.
              </p>
              <p>
                We are not responsible for the privacy practices of third-party sites. When you
                follow a link to another site, we encourage you to read their privacy policy before
                providing any personal data.
              </p>
            </Section>

            {/* ── Section 11 ── */}
            <Section id="children" title="11. Children's privacy">
              <p>
                Zentora is not directed at children under the age of 18. We do not knowingly collect
                personal data from minors. If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us and we will promptly delete it.
              </p>
              <p>
                If you are under 18, please do not use our platform without the supervision of a
                parent or guardian.
              </p>
            </Section>

            {/* ── Section 12 ── */}
            <Section id="changes" title="12. Changes to this policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our
                practices, technology, or applicable law. When we make material changes, we will:
              </p>
              <ul className="space-y-1.5 mt-1">
                <Bullet>Update the "Last updated" date at the top of this page.</Bullet>
                <Bullet>Post a notice on our homepage for significant changes.</Bullet>
                <Bullet>Email registered users when changes materially affect how we use their data.</Bullet>
              </ul>
              <p>
                Your continued use of Zentora after changes are posted constitutes acceptance of the
                updated policy. If you disagree with any changes, you may close your account and
                request deletion of your data.
              </p>
            </Section>

            {/* ── Section 13 ── */}
            <Section id="contact" title="13. Contact & complaints">
              <p>
                For any privacy-related questions, data requests, or complaints, contact our
                designated data contact:
              </p>
              <div className="rounded-xl bg-secondary/5 border border-border p-4 text-sm space-y-1 mt-2">
                <DataRow label="Name"    value={SHOP_NAME} />
                <DataRow label="Address" value={ADDRESS} />
                <DataRow label="Email"   value={<a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>} />
                <DataRow label="Phone"   value={<a href={`tel:${CONTACT_PHONE.replace(/\s/g,"")}`} className="text-primary hover:underline">{CONTACT_PHONE}</a>} />
                <DataRow label="Hours"   value="Monday – Saturday, 9:00 am – 6:00 pm" />
              </div>
              <p className="mt-3">
                We will respond to all requests within <strong>30 days</strong>. If you remain
                unsatisfied, you have the right to escalate to the{" "}
                <strong>Office of the Data Protection Commissioner (ODPC)</strong>:
              </p>
              <div className="rounded-xl bg-secondary/5 border border-border p-4 text-sm space-y-1 mt-2">
                <DataRow label="Website" value={<a href="https://www.odpc.go.ke" target="_blank" rel="noreferrer" className="text-primary hover:underline">www.odpc.go.ke</a>} />
                <DataRow label="Address" value="Upper Hill, Nairobi, Kenya" />
              </div>
            </Section>

            {/* ── Related links ── */}
            <section aria-labelledby="related-heading" className="rounded-2xl border border-border p-6 sm:p-7">
              <h2 id="related-heading" className="text-sm font-semibold text-foreground mb-4">
                Related policies &amp; support
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Return & Refund Policy", sub: "7-day returns, refund process.",     to: "/returns"  },
                  { label: "Help Center",             sub: "FAQs and step-by-step guides.",      to: "/help"     },
                  { label: "Contact Us",              sub: "Reach us by WhatsApp or phone.",     to: "/contact"  },
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
                <div className="text-sm font-semibold">Questions about your data?</div>
                <div className="text-sm text-foreground/60 mt-0.5">
                  Email us and we'll respond within 30 days.
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
                  All contact options
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </MainLayout>
);

export default PrivacyPolicyPage;