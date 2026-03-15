import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { useAuthStore } from "@/features/auth/store/authStore";

import { useProfile } from "@/features/account/hooks/useProfile";
import { useUpdateProfile } from "@/features/account/hooks/useUpdateProfile";
import { useChangePassword } from "@/features/account/hooks/useChangePassword";
import { useLogout } from "@/features/account/hooks/useLogout";
import { useOrders } from "@/features/account/hooks/useOrders";

import { useMeAddresses } from "@/features/checkout/hooks/useMeAddresses";
import { useCreateAddress, useUpdateAddress } from "@/features/checkout/hooks/useUpsertAddress";
import { useDeleteAddress } from "@/features/checkout/hooks/useDeleteAddress";
import { useSetDefaultAddress } from "@/features/checkout/hooks/useSetDefaultAddress";

const AccountDashboardPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // ✅ Guard redirect as an effect (not during render)
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth/login", { replace: true });
  }, [isAuthenticated, navigate]);

  // While redirecting, render nothing
  if (!isAuthenticated) return null;

  const profileQuery = useProfile();
  const updateProfile = useUpdateProfile();

  const changePassword = useChangePassword();
  const logout = useLogout();

  const ordersQuery = useOrders();

  const addressesQuery = useMeAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  const profile = profileQuery.data;

  const fullNameValue = profile?.full_name?.Valid ? profile.full_name.String : "";
  const avatarValue = profile?.avatar_url?.Valid ? profile.avatar_url.String : "";
  const bioValue = profile?.bio?.Valid ? profile.bio.String : "";

  const email = profile?.email ?? "Email (coming soon)";
  const phone = profile?.phone ?? "Phone (coming soon)";

  const [editProfile, setEditProfile] = useState({
    full_name: "",
    avatar_url: "",
    bio: "",
  });

  // ✅ Set form values when profile loads (useEffect, not useMemo)
  const profileLoadedKey = useMemo(
    () => `${fullNameValue}::${avatarValue}::${bioValue}`,
    [fullNameValue, avatarValue, bioValue]
  );

  useEffect(() => {
    setEditProfile({ full_name: fullNameValue, avatar_url: avatarValue, bio: bioValue });
  }, [profileLoadedKey, fullNameValue, avatarValue, bioValue]);

  const [pw, setPw] = useState({ current_password: "", new_password: "", confirm: "" });

  const [newAddress, setNewAddress] = useState({
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
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Account</h1>

          <button
            className="text-sm text-destructive hover:underline disabled:opacity-60"
            disabled={logout.isPending}
            onClick={async () => {
              await logout.mutateAsync();
              navigate("/", { replace: true });
            }}
          >
            {logout.isPending ? "Logging out…" : "Logout"}
          </button>
        </div>

        {/* Profile */}
        <section className="bg-background rounded-2xl border border-border p-6">
          <h2 className="font-bold text-lg mb-4">Profile</h2>

          {profileQuery.isLoading ? (
            <p className="text-sm text-foreground/60">Loading profile…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <div className="text-foreground/60">Email</div>
                <div className="font-medium">{email}</div>
                <div className="text-foreground/60 mt-3">Phone</div>
                <div className="font-medium">{phone}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-foreground/60">Full name</label>
                  <input
                    className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                    value={editProfile.full_name}
                    onChange={(e) => setEditProfile((s) => ({ ...s, full_name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs text-foreground/60">Avatar URL</label>
                  <input
                    className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                    value={editProfile.avatar_url}
                    onChange={(e) => setEditProfile((s) => ({ ...s, avatar_url: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs text-foreground/60">Bio</label>
                  <textarea
                    className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background min-h-24"
                    value={editProfile.bio}
                    onChange={(e) => setEditProfile((s) => ({ ...s, bio: e.target.value }))}
                  />
                </div>

                <button
                  className="inline-flex items-center justify-center rounded-lg font-medium transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
                  disabled={updateProfile.isPending}
                  onClick={async () => {
                    await updateProfile.mutateAsync({
                      full_name: editProfile.full_name,
                      avatar_url: editProfile.avatar_url,
                      bio: editProfile.bio,
                      metadata: profile?.metadata ?? null,
                    });
                    alert("Profile updated.");
                  }}
                >
                  {updateProfile.isPending ? "Saving…" : "Save Profile"}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Orders */}
        <section className="bg-background rounded-2xl border border-border p-6">
          <h2 className="font-bold text-lg mb-4">Orders</h2>

          {ordersQuery.isLoading ? (
            <p className="text-sm text-foreground/60">Loading orders…</p>
          ) : (ordersQuery.data?.orders?.length ?? 0) === 0 ? (
            <p className="text-sm text-foreground/60">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {(ordersQuery.data?.orders ?? []).map((o) => (
                <Link
                  key={o.ID}
                  to={`/account/orders/${o.ID}`}
                  className="block p-4 rounded-xl border border-border hover:border-primary transition"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm line-clamp-1">{o.OrderNumber}</div>
                      <div className="text-xs text-foreground/60">{new Date(o.CreatedAt).toLocaleString()}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-foreground/60">{o.Status}</div>
                      <div className="font-bold text-primary text-sm">
                        {o.Currency} {Number(o.TotalAmount).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Addresses */}
        <section className="bg-background rounded-2xl border border-border p-6">
          <h2 className="font-bold text-lg mb-4">Addresses</h2>

          {addressesQuery.isLoading ? (
            <p className="text-sm text-foreground/60">Loading addresses…</p>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {(addressesQuery.data ?? []).map((a) => (
                  <div key={a.id} className="p-4 rounded-xl border border-border">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm">{a.full_name}</div>
                        <div className="text-xs text-foreground/60">{a.phone_number}</div>
                        <div className="text-xs text-foreground/60 mt-1">
                          {a.address_line_1}
                          {a.address_line_2 ? `, ${a.address_line_2}` : ""}
                        </div>
                        <div className="text-xs text-foreground/60">
                          {a.area ? `${a.area}, ` : ""}
                          {a.city}
                          {a.county ? `, ${a.county}` : ""}
                          {a.country ? ` • ${a.country}` : ""}
                          {a.postal_code ? ` • ${a.postal_code}` : ""}
                        </div>
                      </div>

                      <div className="shrink-0 text-right space-y-2">
                        {a.is_default ? (
                          <div className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary inline-block">
                            Default
                          </div>
                        ) : (
                          <button
                            className="text-xs text-primary hover:underline disabled:opacity-60"
                            disabled={setDefault.isPending}
                            onClick={async () => {
                              await setDefault.mutateAsync(a.id);
                            }}
                          >
                            Set default
                          </button>
                        )}

                        <button
                          className="block text-xs text-destructive hover:underline disabled:opacity-60"
                          disabled={deleteAddress.isPending}
                          onClick={async () => {
                            if (!confirm("Delete this address?")) return;
                            await deleteAddress.mutateAsync(a.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new address */}
              <details>
                <summary className="text-sm text-primary cursor-pointer">Add a new address</summary>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border">
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
                        value={(newAddress as any)[key]}
                        onChange={(e) => setNewAddress((s) => ({ ...s, [key]: e.target.value }))}
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="text-xs text-foreground/60">Address line 1</label>
                    <input
                      className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                      value={newAddress.address_line_1}
                      onChange={(e) => setNewAddress((s) => ({ ...s, address_line_1: e.target.value }))}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-foreground/60">Address line 2 (optional)</label>
                    <input
                      className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                      value={newAddress.address_line_2}
                      onChange={(e) => setNewAddress((s) => ({ ...s, address_line_2: e.target.value }))}
                    />
                  </div>

                  <label className="sm:col-span-2 flex items-center gap-2 text-sm text-foreground/70">
                    <input
                      type="checkbox"
                      checked={newAddress.is_default}
                      onChange={(e) => setNewAddress((s) => ({ ...s, is_default: e.target.checked }))}
                      className="accent-primary"
                    />
                    Set as default
                  </label>

                  <div className="sm:col-span-2">
                    <button
                      className="w-full inline-flex items-center justify-center rounded-lg font-medium transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
                      disabled={createAddress.isPending}
                      onClick={async () => {
                        await createAddress.mutateAsync({
                          ...newAddress,
                          address_line_2: newAddress.address_line_2 || undefined,
                        });
                        setNewAddress({
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
                        alert("Address saved.");
                      }}
                    >
                      {createAddress.isPending ? "Saving…" : "Save Address"}
                    </button>
                  </div>
                </div>
              </details>
            </div>
          )}
        </section>

        {/* Change password */}
        <section className="bg-background rounded-2xl border border-border p-6">
          <h2 className="font-bold text-lg mb-4">Change Password</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-foreground/60">Current password</label>
              <input
                type="password"
                className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={pw.current_password}
                onChange={(e) => setPw((s) => ({ ...s, current_password: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs text-foreground/60">New password</label>
              <input
                type="password"
                className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={pw.new_password}
                onChange={(e) => setPw((s) => ({ ...s, new_password: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-xs text-foreground/60">Confirm new password</label>
              <input
                type="password"
                className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                value={pw.confirm}
                onChange={(e) => setPw((s) => ({ ...s, confirm: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <button
                className="inline-flex items-center justify-center rounded-lg font-medium transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
                disabled={changePassword.isPending}
                onClick={async () => {
                  if (!pw.current_password || !pw.new_password) {
                    alert("Please fill in current and new password.");
                    return;
                  }
                  if (pw.new_password !== pw.confirm) {
                    alert("New password and confirmation do not match.");
                    return;
                  }

                  await changePassword.mutateAsync({
                    current_password: pw.current_password,
                    new_password: pw.new_password,
                  });

                  setPw({ current_password: "", new_password: "", confirm: "" });
                  alert("Password changed successfully.");
                }}
              >
                {changePassword.isPending ? "Updating…" : "Change Password"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default AccountDashboardPage;