import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/features/admin/shared/components/AdminSidebar";
import { AdminTopbar } from "@/features/admin/shared/components/AdminTopbar";
import { useAdminUiStore } from "@/features/admin/shared/store/adminUiStore";
import { cn } from "@/shared/utils/cn";

const AdminLayout = () => {
  const sidebarCollapsed = useAdminUiStore((s) => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1 min-w-0">
          <AdminTopbar />

          <main
            className={cn(
              "px-4 sm:px-6 lg:px-8 py-6",
              "max-w-[1400px] mx-auto",
              sidebarCollapsed ? "" : ""
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;