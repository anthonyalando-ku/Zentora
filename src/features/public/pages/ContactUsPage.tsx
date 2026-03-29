import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";

const ContactUsPage = () => {
  // Local-only form (no backend yet)
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Replace these with your real details
  const phone = "+254 795 974 591";
  const email = "ezekielmulongo254@gmail.com";
  const shopName = "Zentora Shop";
  const addressLine = "Nairobi CBD, Kenya (Gabrone Plaza, 2nd Floor)";
  const hours = "Mon–Sat: 9:00am – 6:00pm";

  // Replace with your real embed URL
  const mapEmbedUrl = useMemo(
    () =>
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.816319881411!2d36.8221420775937!3d-1.2841155953611947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11e849a53eb7%3A0x235009a1613022f4!2sGaberone%20plaza!5e0!3m2!1sen!2ske!4v1774789137005!5m2!1sen!2ske",
    []
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // no backend yet; just show success UI
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <MainLayout>
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="px-5 sm:px-8 py-8 border-b border-border bg-secondary/5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Contact Us</h1>
              <p className="text-sm text-foreground/60 mt-2 max-w-2xl">
                Have a question about an order, delivery, or product? Send us a message or reach us directly.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Link
                  to="/help"
                  className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                >
                  Visit Help Center
                </Link>
                <a
                  href={`tel:${phone.replaceAll(" ", "")}`}
                  className="h-11 px-5 rounded-xl bg-primary text-white hover:opacity-90 transition text-sm font-semibold inline-flex items-center justify-center"
                >
                  Call Support
                </a>
              </div>
            </div>

            <div className="px-5 sm:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: form */}
                <section className="lg:col-span-6">
                  <div className="rounded-2xl border border-border p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold">Send a message</h2>
                        <p className="text-sm text-foreground/60 mt-1">
                          This form wont be submitted. (Coming soon).
                        </p>
                      </div>

                      {submitted && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-500/20">
                          Saved (demo)
                        </span>
                      )}
                    </div>

                    <form onSubmit={onSubmit} className="mt-5 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-foreground/60">Name</label>
                          <input
                            className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={form.name}
                            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-foreground/60">Email</label>
                          <input
                            type="email"
                            className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={form.email}
                            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                            placeholder="you@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-foreground/60">Subject</label>
                        <input
                          className="mt-1 w-full border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={form.subject}
                          onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
                          placeholder="Order issue, delivery question, etc."
                        />
                      </div>

                      <div>
                        <label className="text-xs text-foreground/60">Message</label>
                        <textarea
                          className="mt-1 w-full min-h-[140px] border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={form.message}
                          onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                          placeholder="Tell us how we can help…"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
                      >
                        Submit message (demo)
                      </button>

                      <div className="text-xs text-foreground/50">
                        For urgent issues, call us at{" "}
                        <a className="text-primary hover:underline" href={`tel:${phone.replaceAll(" ", "")}`}>
                          {phone}
                        </a>
                        .
                      </div>
                    </form>
                  </div>
                </section>

                {/* Right: contact details + map */}
                <section className="lg:col-span-6 space-y-6">
                  <div className="rounded-2xl border border-border p-5 sm:p-6">
                    <h2 className="text-lg font-semibold">Contact information</h2>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-foreground/60">Phone</span>
                        <a className="font-semibold text-primary hover:underline" href={`tel:${phone.replaceAll(" ", "")}`}>
                          {phone}
                        </a>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-foreground/60">Email</span>
                        <a className="font-semibold text-primary hover:underline" href={`mailto:${email}`}>
                          {email}
                        </a>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-foreground/60">Hours</span>
                        <span className="font-semibold text-foreground">{hours}</span>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <div className="text-sm font-semibold">{shopName}</div>
                        <div className="text-sm text-foreground/60 mt-1">{addressLine}</div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          <a
                            href="https://maps.app.goo.gl/fyjBbr7LjKE1Lpoa6"
                            target="_blank"
                            rel="noreferrer"
                            className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
                          >
                            Open in Google Maps
                          </a>
                          <a
                            href="https://maps.app.goo.gl/fyjBbr7LjKE1Lpoa6"
                            target="_blank"
                            rel="noreferrer"
                            className="h-11 px-5 rounded-xl bg-secondary text-secondary-foreground hover:opacity-90 transition text-sm font-semibold inline-flex items-center justify-center"
                          >
                            Get directions
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
                    <div className="px-5 sm:px-6 py-4 border-b border-border bg-background">
                      <div className="text-sm font-semibold">Store location</div>
                      <div className="text-xs text-foreground/60 mt-1">Find us on the map</div>
                    </div>

                    <div className="aspect-[16/10] bg-secondary/5">
                      <iframe
                        title="Zentora location map"
                        src={mapEmbedUrl}
                        className="w-full h-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-8 rounded-2xl border border-border p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">Tip</div>
                  <div className="text-sm text-foreground/60 mt-1">
                    If your message is about an order, include your order number for faster help.
                  </div>
                </div>
                <Link
                  to="/account#orders"
                  className="h-11 px-5 rounded-xl border border-border hover:bg-secondary/10 transition text-sm font-semibold inline-flex items-center justify-center"
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