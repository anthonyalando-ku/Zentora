import { cn } from "@/shared/utils/cn";
import { Lock, MapPin, Package, User } from "lucide-react";

export type AccountTabKey = "profile" | "orders" | "addresses" | "security";

type AccountSidebarProps = {
  activeTab: AccountTabKey;
  onChangeTab: (tab: AccountTabKey) => void;

  fullName: string;
  email: string;
  avatarUrl: string;
};

const Avatar = ({ name, avatarUrl }: { name: string; avatarUrl: string }) => {
  const initial = (name?.trim()?.[0] ?? "A").toUpperCase();

  return (
    <div className="w-12 h-12 rounded-2xl border border-border bg-primary/10 text-primary flex items-center justify-center overflow-hidden">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name || "Avatar"} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold">{initial}</span>
      )}
    </div>
  );
};

export const AccountSidebar = ({ activeTab, onChangeTab, fullName, email, avatarUrl }: AccountSidebarProps) => {
  const items: Array<{ key: AccountTabKey; label: string; icon: any }> = [
    { key: "profile", label: "Profile", icon: User },
    { key: "orders", label: "Orders", icon: Package },
    { key: "addresses", label: "Addresses", icon: MapPin },
    { key: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
      {/* Sidebar header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar name={fullName || "Account"} avatarUrl={avatarUrl} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground line-clamp-1">{fullName || "My Account"}</div>
            <div className="text-xs text-foreground/60 line-clamp-1">{email}</div>
          </div>
        </div>
      </div>

      {/* Desktop nav */}
      <div className="hidden lg:block p-2">
        {items.map((it) => {
          const Icon = it.icon;
          const active = activeTab === it.key;

          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChangeTab(it.key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-secondary/10 hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("w-4 h-4", active ? "text-primary" : "text-foreground/50")} />
              <span className="flex-1 text-left">{it.label}</span>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      {/* Mobile horizontal tabs */}
      <div className="lg:hidden p-2">
        <div className="grid grid-cols-4 gap-2">
          {items.map((it) => {
            const Icon = it.icon;
            const active = activeTab === it.key;

            return (
              <button
                key={it.key}
                type="button"
                onClick={() => onChangeTab(it.key)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl border border-border px-2 py-2 text-[11px] font-medium transition-colors",
                  active ? "bg-primary/10 text-primary border-primary/30" : "bg-background text-foreground/70 hover:bg-secondary/10"
                )}
              >
                <Icon className={cn("w-4 h-4", active ? "text-primary" : "text-foreground/50")} />
                {it.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};