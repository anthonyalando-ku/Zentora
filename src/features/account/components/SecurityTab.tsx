export const SecurityTab = ({
  pw,
  setPw,
  changePassword,
}: {
  pw: { current_password: string; new_password: string; confirm: string };
  setPw: React.Dispatch<React.SetStateAction<{ current_password: string; new_password: string; confirm: string }>>;
  changePassword: any;
}) => {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-background shadow-sm p-5">
        <h3 className="text-sm font-semibold text-foreground">Security Settings</h3>
        <p className="text-sm text-foreground/60 mt-1">Update your password to keep your account secure.</p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-foreground/60">Current password</label>
            <input
              type="password"
              className="mt-1 w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={pw.current_password}
              onChange={(e) => setPw((s) => ({ ...s, current_password: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/60">New password</label>
            <input
              type="password"
              className="mt-1 w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={pw.new_password}
              onChange={(e) => setPw((s) => ({ ...s, new_password: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/60">Confirm new password</label>
            <input
              type="password"
              className="mt-1 w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={pw.confirm}
              onChange={(e) => setPw((s) => ({ ...s, confirm: e.target.value }))}
            />
          </div>

          <div className="sm:col-span-2">
            <button
              className="inline-flex items-center justify-center rounded-xl font-medium transition h-10 px-5 text-sm bg-primary text-white hover:opacity-90 disabled:opacity-50"
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
      </div>
    </div>
  );
};