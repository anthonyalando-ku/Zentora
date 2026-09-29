import { Link } from "react-router-dom";
import { Truck, RotateCcw, MessageCircle, MapPin } from "lucide-react";
export default function TrustBadges() {
  return <div className="store-trust" aria-label="Shopping with Zentora">{[
    { Icon: Truck, title: "Countrywide delivery", detail: "Charges confirmed separately", href: "/help" },
    { Icon: RotateCcw, title: "7-day returns", detail: "See eligibility & return policy", href: "/returns" },
    { Icon: MessageCircle, title: "Here to help", detail: "Talk to our team", href: "/contact" },
    { Icon: MapPin, title: "Visit us in Nairobi", detail: "Accra Towers · Shop B12", href: "/contact" },
  ].map(({ Icon, title, detail, href }) => <Link key={title} to={href}><Icon aria-hidden="true" /><div><strong>{title}</strong><span>{detail}</span></div></Link>)}</div>;
}
