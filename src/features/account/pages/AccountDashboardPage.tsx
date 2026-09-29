import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/layouts";
import { AccountGateway } from "@/features/account/components/AccountGateway";
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

import { AccountSidebar, type AccountTabKey } from "@/features/account/components/AccountSidebar";
import { ProfileTab } from "@/features/account/components/ProfileTab";
import { OrdersTab } from "@/features/account/components/OrdersTab";
import { AddressesTab } from "@/features/account/components/AddressesTab";
import { SecurityTab } from "@/features/account/components/SecurityTab";

const TAB_HASH: Record<AccountTabKey, string> = {
  profile: "#profile",
  orders: "#orders",
  addresses: "#addresses",
  security: "#security",
};

const HASH_TAB: Record<string, AccountTabKey> = {
  "#profile": "profile",
  "#orders": "orders",
  "#addresses": "addresses",
  "#security": "security",
};

const getTabFromHash = (hash: string | undefined | null): AccountTabKey => {
  if (!hash) return "profile";
  return HASH_TAB[String(hash).toLowerCase()] ?? "profile";
};

const AccountDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // IMPORTANT: All hooks must run unconditionally (no early return before hooks)
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

  const [activeTab, setActiveTab] = useState<AccountTabKey>(() => getTabFromHash(location.hash));

  useEffect(() => {
    if (isAuthenticated && !location.hash) {
      navigate({ pathname: location.pathname, hash: "#profile" }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const next = getTabFromHash(location.hash);
    setActiveTab((cur) => (cur === next ? cur : next));
  }, [location.hash]);

  const onChangeTab = (tab: AccountTabKey) => {
    setActiveTab(tab);

    const nextHash = TAB_HASH[tab] ?? "#profile";
    if (location.hash !== nextHash) {
      navigate({ pathname: location.pathname, hash: nextHash }, { replace: true });
    }
  };

  // Logged-out visitors get the account gateway (sign in / create account).
  // Logout navigates home itself, so no redirect is needed here.
  if (!isAuthenticated) {
    return <MainLayout><AccountGateway /></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">My Account</h1>
              <p className="text-sm text-foreground/60 mt-1">Manage profile, orders, addresses, and security.</p>
            </div>

            <button
              className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm border border-border bg-background hover:bg-secondary/10 disabled:opacity-60"
              disabled={logout.isPending}
              onClick={async () => {
                await logout.mutateAsync();
                // navigate home (optional). Redirect effect will also kick in due to auth cleared.
                navigate("/", { replace: true });
              }}
            >
              {logout.isPending ? "Logging out…" : "Logout"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-3">
              <AccountSidebar
                activeTab={activeTab}
                onChangeTab={onChangeTab}
                email={email}
                fullName={fullNameValue}
                avatarUrl={avatarValue}
              />
            </aside>

            {/* Content */}
            <section className="lg:col-span-9 min-w-0">
              <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-border bg-background">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">
                      {activeTab === "profile"
                        ? "Profile"
                        : activeTab === "orders"
                          ? "Orders"
                          : activeTab === "addresses"
                            ? "Addresses"
                            : "Security"}
                    </div>

                    <div className="text-xs text-foreground/60">
                      {activeTab === "orders"
                        ? `${ordersQuery.data?.orders?.length ?? 0} order(s)`
                        : activeTab === "addresses"
                          ? `${addressesQuery.data?.length ?? 0} address(es)`
                          : ""}
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {activeTab === "profile" && (
                    <ProfileTab
                      profileQuery={profileQuery}
                      updateProfile={updateProfile}
                      profile={profile}
                      editProfile={editProfile}
                      setEditProfile={setEditProfile}
                      email={email}
                      phone={phone}
                      fullNameValue={fullNameValue}
                      avatarValue={avatarValue}
                      bioValue={bioValue}
                    />
                  )}

                  {activeTab === "orders" && <OrdersTab ordersQuery={ordersQuery} />}

                  {activeTab === "addresses" && (
                    <AddressesTab
                      addressesQuery={addressesQuery}
                      createAddress={createAddress}
                      updateAddress={updateAddress}
                      deleteAddress={deleteAddress}
                      setDefault={setDefault}
                      newAddress={newAddress}
                      setNewAddress={setNewAddress}
                    />
                  )}

                  {activeTab === "security" && (
                    <SecurityTab pw={pw} setPw={setPw} changePassword={changePassword} />
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="h-2" />
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountDashboardPage;