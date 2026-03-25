import { cn } from "@/shared/utils/cn";

type ProfileTabProps = {
  profileQuery: any;
  updateProfile: any;

  profile: any;

  editProfile: { full_name: string; avatar_url: string; bio: string };
  setEditProfile: React.Dispatch<
    React.SetStateAction<{ full_name: string; avatar_url: string; bio: string }>
  >;

  email: string;
  phone: string;

  fullNameValue: string;
  avatarValue: string;
  bioValue: string;
};

export const ProfileTab = ({
  profileQuery,
  updateProfile,
  profile,
  editProfile,
  setEditProfile,
  email,
  phone,
  fullNameValue,
  avatarValue,
 // bioValue,
}: ProfileTabProps) => {
  return (
    <div className="space-y-6">
      {/* Profile header card */}
      <div className="rounded-2xl border border-border bg-background shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border border-border bg-primary/10 text-primary overflow-hidden flex items-center justify-center">
            {avatarValue ? (
              <img src={avatarValue} alt={fullNameValue || "Avatar"} className="w-full h-full object-cover" />
            ) : (
              <span className="font-semibold text-lg">{(fullNameValue?.trim()?.[0] ?? "A").toUpperCase()}</span>
            )}
          </div>

          <div className="min-w-0">
            <div className="text-base font-semibold text-foreground line-clamp-1">{fullNameValue || "Your Profile"}</div>
            <div className="text-sm text-foreground/60 mt-1 line-clamp-1">{email}</div>
            <div className="text-sm text-foreground/60 line-clamp-1">{phone}</div>
          </div>

          <div className="sm:ml-auto">
            <span
              className={cn(
                "inline-flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1 border",
                profileQuery.isLoading ? "border-border text-foreground/60" : "border-green-500/20 bg-green-500/10 text-green-700"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", profileQuery.isLoading ? "bg-foreground/30" : "bg-green-600")} />
              {profileQuery.isLoading ? "Loading…" : "Profile loaded"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="rounded-2xl border border-border bg-background shadow-sm p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Edit Profile</h3>

        {profileQuery.isLoading ? (
          <p className="text-sm text-foreground/60">Loading profile…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-foreground/60">Full name</label>
              <input
                className="mt-1 w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={editProfile.full_name}
                onChange={(e) => setEditProfile((s) => ({ ...s, full_name: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-foreground/60">Avatar URL</label>
              <input
                className="mt-1 w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={editProfile.avatar_url}
                onChange={(e) => setEditProfile((s) => ({ ...s, avatar_url: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-foreground/60">Bio</label>
              <textarea
                className="mt-1 w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background min-h-28 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={editProfile.bio}
                onChange={(e) => setEditProfile((s) => ({ ...s, bio: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between gap-4">
              <div className="text-xs text-foreground/60">
                This information appears on your account and receipts.
              </div>

              <button
                className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
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
                {updateProfile.isPending ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};