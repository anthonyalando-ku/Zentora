import { Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";

const AboutUsPage = () => {
  return (
    <MainLayout>
      <div className="bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="px-5 sm:px-8 py-8 border-b border-border bg-secondary/5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">About Zentora</h1>
              <p className="text-sm text-foreground/60 mt-2 max-w-2xl">
                Zentora is built to make shopping simple, fast, and reliable—helping customers discover great products
                and enabling sellers to grow.
              </p>
            </div>

            <div className="px-5 sm:px-8 py-8 space-y-10">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border p-5">
                  <div className="text-sm font-semibold">Our mission</div>
                  <p className="text-sm text-foreground/60 mt-2">
                    Create a trusted marketplace experience with transparent pricing, dependable delivery, and great
                    customer support.
                  </p>
                </div>
                <div className="rounded-2xl border border-border p-5">
                  <div className="text-sm font-semibold">Our promise</div>
                  <p className="text-sm text-foreground/60 mt-2">
                    We aim to keep quality high, communication clear, and service consistent—before and after checkout.
                  </p>
                </div>
                <div className="rounded-2xl border border-border p-5">
                  <div className="text-sm font-semibold">What we value</div>
                  <p className="text-sm text-foreground/60 mt-2">
                    Reliability, fairness, and continuous improvement—because ecommerce should feel effortless.
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-border p-6 sm:p-7">
                <h2 className="text-lg font-semibold">Why shop with us</h2>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-foreground/70">
                  {[
                    "Curated products and trending picks",
                    "Secure checkout experience",
                    "Clear order tracking and support",
                    "Convenient returns policies",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className="mt-0.5 text-green-600">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-border p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Need help?</h2>
                  <p className="text-sm text-foreground/60 mt-1">
                    Visit our Help Center for common questions, order support, and account guidance.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/help"
                    className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                  >
                    Help Center
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