import { Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";

const EFFECTIVE_DATE = "1 May 2025";
const WINDOW_DAYS = 7;
const SUPPORT_EMAIL = "ezekielmulongo254@gmail.com";
const SUPPORT_PHONE = "+254 795 974 591";
const SHOP_NAME = "Zentora Shop";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-border p-6 sm:p-7 space-y-3">
    <h2 className="text-base font-semibold text-foreground">{title}</h2>
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

const ReturnPolicyPage = () => {
  return (
    <MainLayout>
      <div className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-5 sm:px-8 py-8 border-b border-border bg-secondary/5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                    Return & Refund Policy
                  </h1>
                  <p className="text-sm text-foreground/60 mt-2 max-w-2xl">
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
            </div>

            <div className="px-5 sm:px-8 py-8 space-y-6">

              {/* At-a-glance summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Badge
                  label={`${WINDOW_DAYS}-day return window`}
                  sub="From the date you receive your order."
                />
                <Badge
                  label="Original condition required"
                  sub="Unused, undamaged, with original packaging."
                />
                <Badge
                  label="Refund or exchange"
                  sub="Your choice — store credit, replacement, or refund."
                />
              </div>

              {/* 1. Eligibility */}
              <Section title="1. Return eligibility">
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

              {/* 2. How to return */}
              <Section title="2. How to start a return">
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

              {/* 3. Refunds */}
              <Section title="3. Refunds">
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
                    ["Bank transfer", "3–5 business days"],
                    ["Store credit", "Instant upon approval"],
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

              {/* 4. Damaged or wrong items */}
              <Section title="4. Damaged, defective, or wrong items">
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

              {/* 5. Exchanges */}
              <Section title="5. Exchanges">
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

              {/* 6. Non-returnable categories */}
              <Section title="6. Non-returnable product categories">
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

              {/* 7. Policy notes */}
              <Section title="7. Important notes">
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

              {/* CTA footer */}
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