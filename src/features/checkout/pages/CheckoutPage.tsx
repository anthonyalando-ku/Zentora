import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { useCartStore } from "@/features/cart/store/cartStore";

type ShippingForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  postalCode: string;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<"pod" | "mpesa">("pod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  const validate = () => {
    const newErrors: Partial<ShippingForm> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.address.trim()) newErrors.address = "Required";
    if (!form.city.trim()) newErrors.city = "Required";
    if (!form.county.trim()) newErrors.county = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setOrderPlaced(true);
    clearCart();
    setTimeout(() => navigate("/"), 3000);
  };

  const handleChange = (field: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-foreground/50 mb-6">Add items to your cart before checking out</p>
          <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-10 px-6 text-sm bg-primary text-white hover:opacity-90">
            Shop Now
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (orderPlaced) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-foreground/50 mb-2">Thank you for shopping with Zentora.</p>
          <p className="text-foreground/50 mb-6 text-sm">You'll receive a confirmation shortly. Redirecting to home...</p>
          <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-10 px-6 text-sm bg-primary text-white hover:opacity-90">
            Back to Home
          </Link>
        </div>
      </MainLayout>
    );
  }

  const inputClass = (field: keyof ShippingForm) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 transition-colors ${
      errors[field] ? "border-destructive focus:ring-destructive/30" : "border-border focus:ring-primary/30"
    }`;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-background rounded-2xl border border-border p-6">
                <h2 className="font-bold text-lg mb-4">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input className={inputClass("firstName")} placeholder="John" value={form.firstName} onChange={handleChange("firstName")} />
                    {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input className={inputClass("lastName")} placeholder="Doe" value={form.lastName} onChange={handleChange("lastName")} />
                    {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" className={inputClass("email")} placeholder="john@example.com" value={form.email} onChange={handleChange("email")} />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input type="tel" className={inputClass("phone")} placeholder="+254 700 000 000" value={form.phone} onChange={handleChange("phone")} />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input className={inputClass("address")} placeholder="123 Main Street, Apt 4B" value={form.address} onChange={handleChange("address")} />
                    {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input className={inputClass("city")} placeholder="Nairobi" value={form.city} onChange={handleChange("city")} />
                    {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">County</label>
                    <input className={inputClass("county")} placeholder="Nairobi County" value={form.county} onChange={handleChange("county")} />
                    {errors.county && <p className="text-xs text-destructive mt-1">{errors.county}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <input className={inputClass("postalCode")} placeholder="00100" value={form.postalCode} onChange={handleChange("postalCode")} />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-background rounded-2xl border border-border p-6">
                <h2 className="font-bold text-lg mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {/* Pay on Delivery */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "pod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="pod"
                      checked={paymentMethod === "pod"}
                      onChange={() => setPaymentMethod("pod")}
                      className="accent-primary"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💵</span>
                      <div>
                        <div className="font-medium text-sm">Pay on Delivery</div>
                        <div className="text-xs text-foreground/50">Pay when your order arrives</div>
                      </div>
                    </div>
                    <span className="ml-auto text-xs bg-green-100 text-green-600 font-medium px-2 py-0.5 rounded-full">Default</span>
                  </label>

                  {/* M-Pesa */}
                  <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-border opacity-60 cursor-not-allowed">
                    <input type="radio" name="payment" disabled className="accent-primary" />
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📱</span>
                      <div>
                        <div className="font-medium text-sm">M-Pesa</div>
                        <div className="text-xs text-foreground/50">Coming soon</div>
                      </div>
                    </div>
                    <span className="ml-auto text-xs bg-yellow-100 text-yellow-600 font-medium px-2 py-0.5 rounded-full">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-background rounded-2xl border border-border p-6 sticky top-24">
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-foreground/40">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold shrink-0">KSh {(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Subtotal</span>
                    <span>KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Shipping</span>
                    <span className={shipping === 0 ? "text-green-500" : ""}>
                      {shipping === 0 ? "FREE" : `KSh ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                    <span>Total</span>
                    <span className="text-primary">KSh {total.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg font-medium transition h-11 px-6 text-sm bg-primary text-white hover:opacity-90"
                >
                  Confirm Order
                </button>
                <Link to="/cart" className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg font-medium transition h-11 px-6 text-sm border border-border hover:bg-secondary/10">
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
