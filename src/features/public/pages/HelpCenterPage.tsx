import { Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";

const HelpCenterPage = () => {
  const faqs = [
    {
      q: "How do I place an order?",
      a: "Add items to cart, proceed to checkout, fill in shipping details, and place your order. You’ll see a confirmation screen after successful checkout.",
    },
    {
      q: "Do prices include shipping?",
      a: "Shipping fees may apply depending on your delivery location and method. At checkout we will show you if additional charges apply.",
    },
    {
      q: "How do I track my order?",
      a: "Go to My Account → Orders. You’ll see the order status and details there.",
    },
    {
      q: "Can I change my delivery address after placing an order?",
      a: "If your order hasn’t been processed yet, contact support as soon as possible. Changes may not be possible once fulfillment begins.",
    },
    {
      q: "What’s your return policy?",
      a: "Returns depend on product category and condition. We recommend keeping packaging and contacting support with your order number for assistance.",
    },
  ];

  return (
    <MainLayout>
      <div className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="px-5 sm:px-8 py-8 border-b border-border bg-secondary/5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Help Center</h1>
              <p className="text-sm text-foreground/60 mt-2 max-w-2xl">
                Find answers fast. If you still need help, you can contact us anytime.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Link
                  to="/contact"
                  className="h-11 px-5 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center justify-center"
                >
                  Contact Support
                </Link>
                <Link
                  to="/account#orders"
                  className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                >
                  View My Orders
                </Link>
              </div>
            </div>

            <div className="px-5 sm:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { title: "Orders", desc: "Order status, cancellations, tracking.", to: "/account#orders" },
                  { title: "Account", desc: "Profile, security, addresses.", to: "/account#profile" },
                  { title: "Payments", desc: "Payment options and issues.", to: "/contact" },
                ].map((c) => (
                  <Link
                    key={c.title}
                    to={c.to}
                    className="rounded-2xl border border-border p-5 hover:bg-secondary/5 transition"
                  >
                    <div className="text-sm font-semibold">{c.title}</div>
                    <div className="text-sm text-foreground/60 mt-1">{c.desc}</div>
                  </Link>
                ))}
              </div>

              <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>

              <div className="space-y-3">
                {faqs.map((f) => (
                  <details key={f.q} className="rounded-2xl border border-border p-5">
                    <summary className="cursor-pointer text-sm font-semibold text-foreground">
                      {f.q}
                    </summary>
                    <p className="text-sm text-foreground/60 mt-2">{f.a}</p>
                  </details>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-border p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">Still need help?</div>
                  <div className="text-sm text-foreground/60 mt-1">
                    Reach out to us with your order number and we’ll assist you.
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpCenterPage;