import { useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";

export const AddressesTab = ({
  addressesQuery,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefault,
  newAddress,
  setNewAddress,
}: {
  addressesQuery: any;
  createAddress: any;
  updateAddress: any;
  deleteAddress: any;
  setDefault: any;
  newAddress: any;
  setNewAddress: any;
}) => {
  const [openAdd, setOpenAdd] = useState(false);

  const addresses = addressesQuery.data ?? [];
  const defaultId = useMemo(() => addresses.find((a: any) => a.is_default)?.id ?? null, [addresses]);

  if (addressesQuery.isLoading) {
    return <p className="text-sm text-foreground/60">Loading addresses…</p>;
  }

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Saved Addresses</h3>
          <p className="text-sm text-foreground/60 mt-1">Manage delivery addresses and set a default.</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm bg-primary text-white hover:opacity-90"
          onClick={() => setOpenAdd((v) => !v)}
        >
          {openAdd ? "Close" : "Add New Address"}
        </button>
      </div>

      {/* Add address (styled expandable card) */}
      {openAdd && (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-sm font-semibold">Add a new address</div>
              <div className="text-xs text-foreground/60 mt-1">Fill in the details below.</div>
            </div>

            <button
              type="button"
              className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-border hover:bg-secondary/10"
              onClick={() => setOpenAdd(false)}
              aria-label="Close add address"
            >
              ×
            </button>
          </div>

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
                <label className="text-xs font-medium text-foreground/60">{label}</label>
                <input
                  className="mt-1 w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={(newAddress as any)[key]}
                  onChange={(e) => setNewAddress((s: any) => ({ ...s, [key]: e.target.value }))}
                />
              </div>
            ))}

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-foreground/60">Address line 1</label>
              <input
                className="mt-1 w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={newAddress.address_line_1}
                onChange={(e) => setNewAddress((s: any) => ({ ...s, address_line_1: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-foreground/60">Address line 2 (optional)</label>
              <input
                className="mt-1 w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={newAddress.address_line_2}
                onChange={(e) => setNewAddress((s: any) => ({ ...s, address_line_2: e.target.value }))}
              />
            </div>

            <label className="sm:col-span-2 flex items-center gap-2 text-sm text-foreground/70">
              <input
                type="checkbox"
                checked={newAddress.is_default}
                onChange={(e) => setNewAddress((s: any) => ({ ...s, is_default: e.target.checked }))}
                className="accent-primary"
              />
              Set as default
            </label>

            <div className="sm:col-span-2 flex items-center justify-end gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-4 text-sm border border-border hover:bg-secondary/10"
                onClick={() => setOpenAdd(false)}
              >
                Cancel
              </button>

              <button
                className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
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
                  setOpenAdd(false);
                }}
              >
                {createAddress.isPending ? "Saving…" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address cards */}
      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background shadow-sm p-8 text-center">
          <div className="text-sm font-semibold">No addresses</div>
          <div className="text-sm text-foreground/60 mt-1">Add a delivery address to speed up checkout.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((a: any) => (
            <div
              key={a.id}
              className={cn(
                "rounded-2xl border border-border bg-background shadow-sm p-5 hover:shadow-md transition",
                a.id === defaultId && "border-primary/30"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-sm">{a.full_name}</div>
                    {a.is_default && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-foreground/60 mt-1">{a.phone_number}</div>

                  <div className="text-sm text-foreground/80 mt-3">
                    <div className="text-sm">
                      {a.address_line_1}
                      {a.address_line_2 ? `, ${a.address_line_2}` : ""}
                    </div>
                    <div className="text-xs text-foreground/60 mt-1">
                      {a.area ? `${a.area}, ` : ""}
                      {a.city}
                      {a.county ? `, ${a.county}` : ""}
                      {a.country ? ` • ${a.country}` : ""}
                      {a.postal_code ? ` • ${a.postal_code}` : ""}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right space-y-2">
                  {!a.is_default ? (
                    <button
                      className="text-xs text-primary hover:underline disabled:opacity-60"
                      disabled={setDefault.isPending}
                      onClick={async () => {
                        await setDefault.mutateAsync(a.id);
                      }}
                    >
                      Set default
                    </button>
                  ) : (
                    <div className="text-xs text-foreground/50">Default</div>
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
      )}
    </div>
  );
};