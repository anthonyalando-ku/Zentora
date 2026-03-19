const TrustBadges = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-2xl border border-border bg-background shadow-sm p-6">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">Why shop with us</h2>
                <p className="text-sm text-foreground/60 mt-1">Fast delivery, secure payments, and easy returns</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🚚", title: "Free Delivery", desc: "On orders over KSh 5,000" },
                { icon: "🔄", title: "Easy Returns", desc: "30-day return policy" },
                { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
                { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-border bg-background p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-foreground">{item.title}</div>
                      <div className="text-xs text-foreground/60 mt-1">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
    );
};

export default TrustBadges;