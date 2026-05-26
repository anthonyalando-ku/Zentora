import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MainLayout } from "@/shared/layouts";

// ── Constants ─────────────────────────────────────────────────────────────────
const PHONE_RAW     = "+254795974591";
const PHONE_DISPLAY = "+254 795 974 591";
const WHATSAPP      = `https://wa.me/${PHONE_RAW.replace("+", "")}?text=${encodeURIComponent("Hi Zentora, I need help with ")}`;

const HELP_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [] as object[], // populated below from FAQS
};

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQS: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "Placing an order",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse or search for the product you want, select the variant (size, colour, storage), then click 'Add to cart'. When you're ready, go to your cart and click 'Checkout'. Fill in your delivery address and payment details, then confirm your order. You'll see a confirmation screen and receive an order reference number.",
      },
      {
        q: "Can I order without creating an account?",
        a: "Yes. You can checkout as a guest. However, creating a free account lets you track orders, save addresses, manage returns, and access your order history at any time.",
      },
      {
        q: "How do I know my order was placed successfully?",
        a: "After checkout you'll see an order confirmation page with your order number. You can also check your orders under My Account → Orders. If you're unsure, WhatsApp us with your name and the product you ordered and we'll confirm it for you.",
      },
      {
        q: "Can I add items to an order I've already placed?",
        a: "Once an order is placed it cannot be modified. If you need to add items, place a new separate order. If your original order hasn't been processed yet and you'd like to combine them, contact us on WhatsApp as quickly as possible.",
      },
    ],
  },
  {
    category: "Delivery & shipping",
    items: [
      {
        q: "Do prices include shipping?",
        a: "No. Shipping fees are calculated at checkout based on your delivery location. Nairobi CBD and nearby areas typically cost KSh 200. Delivery to other counties varies. The exact amount is shown before you confirm payment.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders within Nairobi are usually delivered within 1–2 business days. Countrywide deliveries typically take 2–5 business days depending on your location. We dispatch Monday to Saturday.",
      },
      {
        q: "How do I track my order?",
        a: "Go to My Account → Orders. Each order shows its current status: Pending, Processing, Shipped, or Delivered. If your order has been dispatched with a courier, the tracking number will be listed there. You can also WhatsApp us with your order number for a quick update.",
      },
      {
        q: "Can I change my delivery address after placing an order?",
        a: "Address changes are possible only if the order hasn't been dispatched yet. Contact us on WhatsApp immediately with your order number and the new address. Once an order is with the courier, we cannot redirect it.",
      },
      {
        q: "Do you deliver outside Nairobi?",
        a: "Yes, we ship countrywide across Kenya through trusted courier partners. Delivery to counties outside Nairobi typically takes 2–5 business days. Shipping costs vary by location and are shown at checkout.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept M-Pesa (Lipa na M-Pesa), bank transfer, and cash on pickup at our Nairobi CBD store. M-Pesa is the fastest and most commonly used payment method on Zentora.",
      },
      {
        q: "Is it safe to pay on Zentora?",
        a: "Yes. All transactions on Zentora are processed securely. We never store your M-Pesa PIN or bank credentials. If you have any concerns about a payment, contact us immediately.",
      },
      {
        q: "I made a payment but my order wasn't confirmed. What do I do?",
        a: "This can happen if there was a network interruption during checkout. First, check My Account → Orders to see if the order appears there. If it doesn't, WhatsApp us with your M-Pesa transaction code (the message you received after paying) and we'll resolve it within the same business day.",
      },
      {
        q: "Can I pay on delivery?",
        a: "Cash on delivery is available for select locations within Nairobi. This option will appear at checkout if it's available for your address. For countrywide orders, payment is required upfront before dispatch.",
      },
    ],
  },
  {
    category: "Returns & refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 calendar days of delivery, provided the item is in its original condition — unused, undamaged, with original packaging and accessories intact. Some categories like personal care items once opened are not eligible for return.",
      },
      {
        q: "How do I start a return?",
        a: "Contact us on WhatsApp or by phone within 7 days of receiving your order. Include your order number and a brief description of the issue. We'll send you a Return Merchandise Authorisation (RMA) reference and instructions. Do not return items without an RMA reference.",
      },
      {
        q: "How long does a refund take?",
        a: "Once we receive and inspect the returned item (1–3 business days), refunds are processed to your original payment method. M-Pesa refunds typically arrive within 1–3 business days. Bank transfers take 3–5 business days.",
      },
      {
        q: "My item arrived damaged. What do I do?",
        a: "We're sorry to hear that. Take photos of the damaged item and packaging, then contact us on WhatsApp within 48 hours of delivery. Include your order number and photos. We will arrange a free collection and send a replacement or issue a full refund — your choice.",
      },
    ],
  },
  {
    category: "Account & security",
    items: [
      {
        q: "How do I reset my password?",
        a: "On the login page, click 'Forgot password'. Enter your email address and we'll send you a password reset link. Check your spam folder if the email doesn't arrive within a few minutes.",
      },
      {
        q: "How do I update my delivery address?",
        a: "Go to My Account → Addresses. You can add, edit, or delete saved addresses. Changes take effect on your next order.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Contact us via WhatsApp or email with your account email address and a request to delete your account. We will process it within 5 business days. Note that deleting your account removes your order history permanently.",
      },
    ],
  },
];

// Build FAQ JSON-LD from the data
HELP_JSON_LD.mainEntity = FAQS.flatMap((cat) =>
  cat.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  }))
);

// ── Local icon components ─────────────────────────────────────────────────────
const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor">
    <path d="M19.11 17.59c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.21-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.44.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.54-.45-.47-.62-.48l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.68 1.12 2.87c.14.18 1.93 2.95 4.68 4.13.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z"/>
    <path d="M16.03 3C8.86 3 3.03 8.82 3.03 15.99c0 2.28.6 4.5 1.74 6.46L3 29l6.73-1.76a12.9 12.9 0 006.3 1.62h.01c7.17 0 13-5.82 13-12.99C29.04 8.82 23.2 3 16.03 3Zm0 23.62h-.01a10.77 10.77 0 01-5.5-1.52l-.39-.23-3.99 1.04 1.06-3.89-.25-.4a10.8 10.8 0 01-1.65-5.71c0-5.95 4.84-10.79 10.79-10.79 2.88 0 5.58 1.12 7.61 3.16a10.72 10.72 0 013.15 7.62c0 5.95-4.84 10.79-10.82 10.79Z"/>
  </svg>
);

// ── FAQ accordion item ────────────────────────────────────────────────────────
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-secondary/5 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-foreground leading-snug">{q}</span>
        <ChevronDownIcon open={open} />
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-border bg-secondary/3">
          <p className="text-sm text-foreground/65 leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
};

// ── Topic cards data ──────────────────────────────────────────────────────────
const TOPICS = [
  {
    icon: "📦",
    title: "Orders",
    desc: "Track your order, change details, or check order status.",
    to: "/account#orders",
    external: false,
  },
  {
    icon: "🚚",
    title: "Delivery",
    desc: "Shipping fees, delivery times, and countrywide coverage.",
    to: WHATSAPP,
    external: true,
  },
  {
    icon: "💳",
    title: "Payments",
    desc: "M-Pesa, bank transfer, and payment issues.",
    to: WHATSAPP,
    external: true,
  },
  {
    icon: "↩️",
    title: "Returns",
    desc: "7-day return window, how to start a return, refund timelines.",
    to: "/returns",
    external: false,
  },
  {
    icon: "👤",
    title: "Account",
    desc: "Password, profile, saved addresses, and security.",
    to: "/account#profile",
    external: false,
  },
  {
    icon: "💬",
    title: "Contact support",
    desc: "Speak to us directly on WhatsApp or by phone.",
    to: "/contact",
    external: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const HelpCenterPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>(FAQS[0].category);

  const activeFaqs = FAQS.find((f) => f.category === activeCategory)?.items ?? [];

  return (
    <MainLayout>
      {/* ── SEO ── */}
      <Helmet>
        <title>Help Center | Zentora Kenya — FAQs, Orders &amp; Support</title>
        <meta
          name="description"
          content="Get help with orders, delivery, payments, and returns at Zentora Kenya. Browse FAQs or reach us on WhatsApp for fast support."
        />
        <link rel="canonical" href="https://zentorashop.co.ke/help" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Zentora Help Center — FAQs &amp; Customer Support" />
        <meta property="og:description" content="Find answers to common questions about placing orders, delivery timelines, M-Pesa payments and 7-day returns at Zentora Kenya. Can't find your answer? Reach us on WhatsApp." />
        <meta property="og:url" content="https://zentorashop.co.ke/help" />
        <meta property="og:image" content="https://zentorashop.co.ke/og-default.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zentora Help Center — FAQs &amp; Customer Support Kenya" />
        <meta name="twitter:description" content="Answers to common questions about Zentora orders, delivery, M-Pesa payments and returns. Still stuck? WhatsApp us for fast support." />
        {/* FAQPage JSON-LD — enables FAQ rich results in Google Search */}
        <script type="application/ld+json">{JSON.stringify(HELP_JSON_LD)}</script>
      </Helmet>

      <div className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">

            {/* ── Header ── */}
            <header className="px-5 sm:px-8 py-8 border-b border-border bg-secondary/5">
              <nav className="flex items-center gap-1.5 text-xs text-foreground/40 mb-4" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <span className="text-foreground/70">Help Center</span>
              </nav>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Help Center
              </h1>
              <p className="text-sm text-foreground/60 mt-2 max-w-2xl leading-relaxed">
                Find answers to common questions about orders, delivery, payments, and returns.
                If you can't find what you're looking for, we're one WhatsApp message away.
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
                  className="h-11 px-5 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center justify-center"
                >
                  Call {PHONE_DISPLAY}
                </a>
                <Link
                  to="/account#orders"
                  className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                >
                  My Orders
                </Link>
              </div>
            </header>

            <div className="px-5 sm:px-8 py-8 space-y-8">

              {/* ── Topic cards ── */}
              <section aria-labelledby="topics-heading">
                <h2 id="topics-heading" className="text-base font-semibold mb-4">Browse by topic</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TOPICS.map(({ icon, title, desc, to, external }) =>
                    external ? (
                      <a
                        key={title}
                        href={to}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-border p-4 hover:bg-secondary/5 hover:border-primary/20 transition-all group"
                      >
                        <div className="text-xl mb-2">{icon}</div>
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{title}</div>
                        <div className="text-xs text-foreground/55 mt-1 leading-relaxed">{desc}</div>
                      </a>
                    ) : (
                      <Link
                        key={title}
                        to={to}
                        className="rounded-2xl border border-border p-4 hover:bg-secondary/5 hover:border-primary/20 transition-all group"
                      >
                        <div className="text-xl mb-2">{icon}</div>
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{title}</div>
                        <div className="text-xs text-foreground/55 mt-1 leading-relaxed">{desc}</div>
                      </Link>
                    )
                  )}
                </div>
              </section>

              {/* ── FAQs ── */}
              <section aria-labelledby="faq-heading">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="faq-heading" className="text-base font-semibold">
                    Frequently Asked Questions
                  </h2>
                  <span className="text-xs text-foreground/40">
                    {FAQS.reduce((n, c) => n + c.items.length, 0)} questions
                  </span>
                </div>

                {/* Category tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none mb-5">
                  {FAQS.map(({ category }) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold transition-all ${
                        activeCategory === category
                          ? "bg-primary text-white shadow-sm"
                          : "border border-border text-foreground/60 hover:text-foreground hover:border-foreground/30"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Accordion items */}
                <div className="space-y-2">
                  {activeFaqs.map((faq) => (
                    <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </section>

              {/* ── Quick tips ── */}
              <section aria-labelledby="tips-heading" className="rounded-2xl border border-border p-6 sm:p-7">
                <h2 id="tips-heading" className="text-base font-semibold mb-4">Quick tips</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground/70">
                  {[
                    { icon: "🔢", tip: "Always include your order number when contacting support — it cuts response time significantly." },
                    { icon: "📸", tip: "For damaged or wrong items, photograph the product and packaging before contacting us." },
                    { icon: "📦", tip: "Keep original packaging until you're sure you're happy with the product — it's required for returns." },
                    { icon: "⏰", tip: "WhatsApp is the fastest support channel. We typically reply within minutes during business hours." },
                    { icon: "📱", tip: "Check your M-Pesa messages for transaction codes if you ever need to verify a payment with us." },
                    { icon: "🔐", tip: "Never share your account password or M-Pesa PIN with anyone, including our support team." },
                  ].map(({ icon, tip }) => (
                    <div key={tip} className="flex items-start gap-2.5">
                      <span className="text-base shrink-0 mt-0.5">{icon}</span>
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Still need help CTA ── */}
              <div className="rounded-2xl border border-border p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-secondary/3">
                <div>
                  <div className="text-sm font-semibold">Still need help?</div>
                  <div className="text-sm text-foreground/60 mt-1">
                    Our team is available Monday–Saturday, 9:00 am–6:00 pm.
                    WhatsApp is the fastest way to reach us.
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noreferrer"
                    className="h-11 px-5 rounded-xl bg-[#25D366] text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center gap-2 justify-center"
                  >
                    <WhatsAppIcon />
                    WhatsApp
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
};

export default HelpCenterPage;