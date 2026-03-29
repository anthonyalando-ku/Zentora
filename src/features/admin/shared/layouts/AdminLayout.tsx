import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/features/admin/shared/components/AdminSidebar";
import { AdminTopbar } from "@/features/admin/shared/components/AdminTopbar";
import { AdminMobileDrawer } from "@/features/admin/shared/components/AdminMobileDrawer";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminMobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        <div className="flex-1 min-w-0">
          <AdminTopbar onOpenMobileMenu={() => setMobileOpen(true)} />

          <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;