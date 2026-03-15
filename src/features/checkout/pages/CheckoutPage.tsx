import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCart } from "@/features/cart/hooks/useCart";
import { useCartStore } from "@/features/cart/store/cartStore";

import type { PaymentMethod } from "@/core/api/services/orders";
import { usePlaceGuestOrder } from "@/features/checkout/hooks/usePlaceGuestOrder";
import { usePlaceMeOrder } from "@/features/checkout/hooks/usePlaceMeOrder";
import { useMeAddresses } from "@/features/checkout/hooks/useMeAddresses";
import { useCreateAddress } from "@/features/checkout/hooks/useUpsertAddress";
import { useSetDefaultAddress } from "@/features/checkout/hooks/useSetDefaultAddress";

type ShippingFormState = {
  full_name: string;
  phone_number: string;
  country: string;
  county: string;
  city: string;
  area: string;
  postal_code: string;
  address_line_1: string;
  address_line_2: string;
};

const emptyShipping: ShippingFormState = {
  full_name: "",
  phone_number: "",
  country: "Kenya",
  county: "",
  city: "",
  area: "",
  postal_code: "",
  address_line_1: "",
  address_line_2: "",
};

const formatAddressSummary = (a: {
  country?: string;
  county?: string;
  city?: string;
  area?: string;
  postal_code?: string;
  address_line_1?: string;
}) => {
  const address1 = String(a.address_line_1 ?? "").trim();
  const area = String(a.area ?? "").trim();
  const city = String(a.city ?? "").trim();
  const county = String(a.county ?? "").trim();
  const country = String(a.country ?? "").trim();
  const postal = String(a.postal_code ?? "").trim();

  const structuredParts = [area, city, county, country].filter(Boolean);
  const main = structuredParts.length > 0 ? structuredParts.join(", ") : address1;

  const shouldIncludeAddress1 =
    Boolean(address1) &&
    structuredParts.length > 0 &&
    !structuredParts.some((p) => address1.toLowerCase().includes(p.toLowerCase()));

  const withAddress1 = shouldIncludeAddress1 ? [address1, main].filter(Boolean).join(", ") : main;

  return postal ? `${withAddress1} • ${postal}` : withAddress1;
};

const CheckoutPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const cart = useCart();
  const guestCart = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pay_on_delivery");

  const [shipping, setShipping] = useState<ShippingFormState>(emptyShipping);

  const addressesQuery = useMeAddresses();
  const addresses = addressesQuery.data ?? [];

  const defaultAddressId = useMemo(() => {
    const def = addresses.find((a) => a.is_default);
    return def?.id;
  }, [addresses]);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (selectedAddressId !== null) return;

    if (defaultAddressId) setSelectedAddressId(defaultAddressId);
    else if (addresses[0]?.id) setSelectedAddressId(addresses[0].id);
  }, [addresses, defaultAddressId, isAuthenticated, selectedAddressId]);

  const createAddress = useCreateAddress();
  const setDefault = useSetDefaultAddress();

  const placeGuestOrder = usePlaceGuestOrder();
  const placeMeOrder = usePlaceMeOrder();

  // NEW: success screen state (no navigation)
  const [orderSuccess, setOrderSuccess] = useState(false);

  const itemsPayload = useMemo(() => {
    return cart.items.map((i) => ({
      product_id: i.product_id,
      variant_id: i.variant_id,
      quantity: i.quantity,
    }));
  }, [cart.items]);

  const isCartEmpty = cart.items.length === 0;

  const orderTotal = useMemo(() => {
    const subtotal = cart.subtotal;
    const shippingFee = subtotal > 5000 ? 0 : 500;
    return subtotal + shippingFee;
  }, [cart.subtotal]);

  const validateGuestShipping = () => {
    const required: Array<keyof ShippingFormState> = [
      "full_name",
      "phone_number",
      "country",
      "county",
      "city",
      "area",
      "postal_code",
      "address_line_1",
    ];

    for (const k of required) {
      if (!String(shipping[k] ?? "").trim()) return `Missing required field: ${k.replaceAll("_", " ")}`;
    }
    return null;
  };

  const handlePlaceOrder = async () => {
    if (isCartEmpty) return;
    if (paymentMethod === "mpesa") return;

    try {
      if (!isAuthenticated) {
        const err = validateGuestShipping();
        if (err) {
          alert(err);
          return;
        }

        await placeGuestOrder.mutateAsync({
          items: itemsPayload,
          shipping: {
            full_name: shipping.full_name,
            phone: shipping.phone_number,
            country: shipping.country,

            county: shipping.county?.trim() ? shipping.county.trim() : undefined,
            city: shipping.city,
            area: shipping.area?.trim() ? shipping.area.trim() : undefined,
            postal_code: shipping.postal_code?.trim() ? shipping.postal_code.trim() : undefined,

            address_line_1: shipping.address_line_1,
            address_line_2: shipping.address_line_2?.trim() ? shipping.address_line_2.trim() : undefined,
          },
          payment_method: paymentMethod,
        });

        // Clear guest cart after successful order
        guestCart.clearCart();

        // Show success screen (no navigation)
        setOrderSuccess(true);
        return;
      }

      if (!selectedAddressId) {
        alert("Please select or create a shipping address.");
        return;
      }

      await placeMeOrder.mutateAsync({
        address_id: selectedAddressId,
        items: itemsPayload,
        payment_method: paymentMethod,
      });

      // NOTE: authenticated cart invalidation already handled in usePlaceMeOrder hook
      setOrderSuccess(true);
    } catch (e) {
      // keep existing behavior: mutation errors will also be available on hooks
      // but we can show a friendly message here
      alert("Failed to place order. Please try again.");
    }
  };

  // Success screen (after order is created)
  if (orderSuccess) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Order created successfully</h2>
          <p className="text-foreground/60 mb-8">
            Thanks! Your order has been placed. We’ll contact you for delivery and payment confirmation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-11 px-6 text-sm bg-primary text-white hover:opacity-90"
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-11 px-6 text-sm border border-border hover:bg-secondary/10"
            >
              Back Home
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!cart.isLoading && isCartEmpty) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">🧾</div>
          <h2 className="text-2xl font-bold mb-2">Checkout</h2>
          <p className="text-foreground/50 mb-6">Your cart is empty.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-md font-medium transition h-10 px-6 text-sm bg-primary text-white hover:opacity-90"
          >
            Browse Products
          </Link>
        </div>
      </MainLayout>
    );
  }

  const isPlacing =
    placeGuestOrder.isPending || placeMeOrder.isPending || createAddress.isPending || setDefault.isPending;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Checkout</h1>
          <Link to="/cart" className="text-sm text-primary hover:underline">
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            {!isAuthenticated ? (
              <section className="bg-background rounded-2xl border border-border p-6">
                <h2 className="font-bold text-lg mb-4">Shipping Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    [
                      ["full_name", "Full name"],
                      ["phone_number", "Phone number"],
                      ["country", "Country"],
                      ["county", "County"],
                      ["city", "City"],
                      ["area", "Area"],
                      ["postal_code", "Postal code"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key}>
                      <label className="text-xs text-foreground/60">{label}</label>
                      <input
                        className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                        value={shipping[key]}
                        onChange={(e) => setShipping((s) => ({ ...s, [key]: e.target.value }))}
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="text-xs text-foreground/60">Address line 1</label>
                    <input
                      className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                      value={shipping.address_line_1}
                      onChange={(e) => setShipping((s) => ({ ...s, address_line_1: e.target.value }))}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-foreground/60">Address line 2 (optional)</label>
                    <input
                      className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                      value={shipping.address_line_2}
                      onChange={(e) => setShipping((s) => ({ ...s, address_line_2: e.target.value }))}
                    />
                  </div>
                </div>
              </section>
            ) : (
              <section className="bg-background rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Shipping Address</h2>
                </div>

                {addressesQuery.isLoading ? (
                  <p className="text-sm text-foreground/60">Loading addresses…</p>
                ) : addresses.length === 0 ? (
                  <div className="text-sm text-foreground/60">
                    <p className="mb-3">You don’t have any saved addresses yet. Add one below to continue.</p>
                    <AddAddressInline
                      onCreate={async (payload) => {
                        await createAddress.mutateAsync(payload);
                        await addressesQuery.refetch();
                        const next =
                          (addressesQuery.data ?? []).find((a) => a.is_default) ?? (addressesQuery.data ?? [])[0];
                        if (next?.id) setSelectedAddressId(next.id);
                      }}
                      disabled={isPlacing}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((a) => {
                      const summary = formatAddressSummary({
                        country: a.country,
                        county: a.county,
                        city: a.city,
                        area: a.area,
                        postal_code: a.postal_code,
                        address_line_1: a.address_line_1,
                      });

                      return (
                        <label
                          key={a.id}
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer ${
                            selectedAddressId === a.id ? "border-primary" : "border-border"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === a.id}
                            onChange={() => setSelectedAddressId(a.id)}
                            className="mt-1 accent-primary"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-sm">{a.full_name}</div>
                              {a.is_default && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  Default
                                </span>
                              )}
                            </div>

                            {summary ? (
                              <div className="text-xs text-foreground/60 mt-1 line-clamp-2">{summary}</div>
                            ) : (
                              <div className="text-xs text-foreground/60 mt-1">Address details not provided</div>
                            )}

                            {!a.is_default && (
                              <button
                                type="button"
                                className="mt-2 text-xs text-primary hover:underline"
                                disabled={isPlacing}
                                onClick={async () => {
                                  await setDefault.mutateAsync(a.id);
                                  await addressesQuery.refetch();
                                }}
                              >
                                Set as default
                              </button>
                            )}
                          </div>
                        </label>
                      );
                    })}

                    <details className="mt-2">
                      <summary className="text-sm text-primary cursor-pointer">Add a new address</summary>
                      <div className="mt-3">
                        <AddAddressInline
                          onCreate={async (payload) => {
                            await createAddress.mutateAsync(payload);
                            await addressesQuery.refetch();
                            const next =
                              (addressesQuery.data ?? []).find((a) => a.is_default) ?? (addressesQuery.data ?? [])[0];
                            if (next?.id) setSelectedAddressId(next.id);
                          }}
                          disabled={isPlacing}
                        />
                      </div>
                    </details>
                  </div>
                )}
              </section>
            )}

            {/* Payment */}
            <section className="bg-background rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-4">Payment Method</h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-xl border border-border cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="pay_on_delivery"
                      checked={paymentMethod === "pay_on_delivery"}
                      onChange={() => setPaymentMethod("pay_on_delivery")}
                      className="accent-primary"
                    />
                    <div>
                      <div className="font-semibold text-sm">Pay on Delivery</div>
                      <div className="text-xs text-foreground/60">Cash on delivery</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">Enabled</span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-border opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="mpesa" disabled className="accent-primary" />
                    <div>
                      <div className="font-semibold text-sm">M-Pesa</div>
                      <div className="text-xs text-foreground/60">Mobile money</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-foreground/70">
                    Coming Soon
                  </span>
                </label>
              </div>
            </section>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {cart.items.map((i) => (
                  <div key={i.key} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                      <img src={i.thumbnail} alt={i.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium line-clamp-2">{i.name}</div>
                      <div className="text-xs text-foreground/60">
                        Qty: {i.quantity} • Variant: {i.variant_id}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      KSh {(i.unit_price * i.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Items</span>
                  <span className="font-medium">{cart.itemCount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-foreground/60">Subtotal</span>
                  <span className="font-medium">KSh {cart.subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-foreground/60">Shipping</span>
                  <span className="font-medium">{cart.subtotal > 5000 ? "FREE" : "KSh 500"}</span>
                </div>

                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">KSh {orderTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg font-medium transition h-11 px-6 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
                onClick={handlePlaceOrder}
                disabled={isPlacing || isCartEmpty}
              >
                {isPlacing ? "Placing order..." : "Place Order"}
              </button>

              <Link
                to="/cart"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg font-medium transition h-11 px-6 text-sm border border-border hover:bg-secondary/10"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const AddAddressInline = ({
  onCreate,
  disabled,
}: {
  onCreate: (payload: any) => Promise<void>;
  disabled: boolean;
}) => {
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    country: "Kenya",
    county: "",
    city: "",
    area: "",
    postal_code: "",
    address_line_1: "",
    address_line_2: "",
    is_default: true,
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border mt-2">
      {(
        [
          ["full_name", "Full name"],
          ["phone_number", "Phone number"],
          ["country", "Country"],
          ["county", "County"],
          ["city", "City"],
          ["area", "Area"],
          ["postal_code", "Postal code"],
        ] as const
      ).map(([key, label]) => (
        <div key={key}>
          <label className="text-xs text-foreground/60">{label}</label>
          <input
            className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
            value={(form as any)[key]}
            onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
            disabled={disabled}
          />
        </div>
      ))}

      <div className="sm:col-span-2">
        <label className="text-xs text-foreground/60">Address line 1</label>
        <input
          className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
          value={form.address_line_1}
          onChange={(e) => setForm((s) => ({ ...s, address_line_1: e.target.value }))}
          disabled={disabled}
        />
      </div>

      <div className="sm:col-span-2">
        <label className="text-xs text-foreground/60">Address line 2 (optional)</label>
        <input
          className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
          value={form.address_line_2}
          onChange={(e) => setForm((s) => ({ ...s, address_line_2: e.target.value }))}
          disabled={disabled}
        />
      </div>

      <label className="sm:col-span-2 flex items-center gap-2 text-sm text-foreground/70">
        <input
          type="checkbox"
          checked={form.is_default}
          onChange={(e) => setForm((s) => ({ ...s, is_default: e.target.checked }))}
          disabled={disabled}
          className="accent-primary"
        />
        Set as default
      </label>

      <div className="sm:col-span-2">
        <button
          type="button"
          className="w-full inline-flex items-center justify-center rounded-lg font-medium transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
          disabled={disabled}
          onClick={() =>
            onCreate({
              ...form,
              address_line_2: form.address_line_2 || undefined,
            })
          }
        >
          Save Address
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;