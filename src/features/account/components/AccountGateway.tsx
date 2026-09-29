import "@/styles/account.css";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Package, ShieldCheck, UserRound } from "lucide-react";

// Each benefit maps to a real tab on the signed-in account page:
// Orders (history + status), Addresses (add/edit/default), Security (change password).
const BENEFITS = [
  { Icon: Package, title: "Your orders", text: "See your order history and the status of each order." },
  { Icon: MapPin, title: "Delivery addresses", text: "Save your addresses and choose a default." },
  { Icon: ShieldCheck, title: "Account security", text: "Update your password whenever you need to." },
];

/** Logged-out state of /account: sign in or create an account. */
export function AccountGateway() {
  return (
    <div className="acct-page"><div className="store-shell">
      <nav className="acct-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Account</span></nav>
      <div className="acct-gateway">
        <section className="acct-intro" aria-labelledby="acct-title">
          <span className="acct-icon" aria-hidden="true"><UserRound /></span>
          <h1 id="acct-title">Your Zentora account</h1>
          <p>Sign in to see your orders and manage your account, or create an account to get started.</p>
          <div className="acct-actions">
            <Link to="/auth/login" replace className="store-cta">Sign in</Link>
            <Link to="/auth/register" replace className="acct-secondary">Create account</Link>
          </div>
        </section>

        <section className="acct-benefits" aria-labelledby="acct-benefits-title">
          <h2 id="acct-benefits-title">With an account you can</h2>
          <ul>
            {BENEFITS.map(({ Icon, title, text }) => (
              <li key={title}>
                <span className="acct-benefit-icon" aria-hidden="true"><Icon /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ul>
        </section>

        <Link to="/products" className="acct-continue">Continue shopping <ArrowRight aria-hidden="true" /></Link>
      </div>
    </div></div>
  );
}
