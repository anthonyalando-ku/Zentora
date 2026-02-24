import { Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { useAuthStore } from "@/features/auth/store/authStore";

const mockOrders = [
  { id: "ORD-001", date: "2024-01-15", status: "Delivered", total: 12500, items: 3 },
  { id: "ORD-002", date: "2024-01-20", status: "Processing", total: 4800, items: 1 },
  { id: "ORD-003", date: "2024-01-25", status: "Shipped", total: 8900, items: 2 },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AccountDashboardPage = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Derive display name from full_name
  const displayName = user?.full_name?.split(" ")[0] ?? "User";
  const initials = user?.full_name?.[0] ?? "U";

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
          <p className="text-foreground/50 mb-6">View your orders, profile and settings</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-10 px-6 text-sm bg-primary text-white hover:opacity-90">
              Sign In
            </Link>
            <Link to="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-10 px-6 text-sm border border-border hover:bg-secondary/10">
              Create Account
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-background rounded-2xl border border-border p-6 text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-primary">
                  {initials}
                </span>
              </div>
              <p className="font-semibold">{user?.full_name}</p>
              <p className="text-sm text-foreground/50">{user?.email}</p>
            </div>
            <nav className="bg-background rounded-2xl border border-border overflow-hidden">
              {[
                { label: "Dashboard", href: "/account" },
                { label: "My Orders", href: "/account/orders" },
                { label: "Profile Settings", href: "/account/settings" },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center px-4 py-3 text-sm hover:bg-secondary/10 transition-colors border-b border-border last:border-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-border p-6">
              <h1 className="text-xl font-bold mb-1">Welcome back, {displayName}!</h1>
              <p className="text-sm text-foreground/60">Here's a summary of your account activity</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Orders", value: mockOrders.length },
                { label: "Total Spent", value: `KSh ${mockOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}` },
                { label: "Delivered", value: mockOrders.filter((o) => o.status === "Delivered").length },
              ].map((stat) => (
                <div key={stat.label} className="bg-background rounded-2xl border border-border p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-foreground/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-background rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Recent Orders</h2>
                <Link to="/account/orders" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {mockOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{order.id}</p>
                      <p className="text-xs text-foreground/40">{order.date} · {order.items} item{order.items !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] ?? ""}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-semibold">KSh {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountDashboardPage;
