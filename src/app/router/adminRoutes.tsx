import React, { Suspense } from "react";
import { RoleRoute } from "@/core/guards/RoleRoute";
import { Loader } from "@/shared/components/ui";

const AdminLayout = React.lazy(() => import("@/features/admin/shared/layouts/AdminLayout"));

const AdminDashboardPage = React.lazy(() => import("@/features/admin/dashboard/pages/AdminDashboardPage"));
const AdminProductsPage = React.lazy(() => import("@/features/admin/products/pages/AdminProductsPage"));
const AdminProductNewPage = React.lazy(() => import("@/features/admin/products/pages/AdminProductNewPage"));
const AdminProductDetailPage = React.lazy(() => import("@/features/admin/products/pages/AdminProductDetailPage"));
const AdminInventoryPage = React.lazy(() => import("@/features/admin/inventory/pages/AdminInventoryPage"));
const AdminOrdersPage = React.lazy(() => import("@/features/admin/orders/pages/AdminOrdersPage"));
const AdminOrderDetailPage = React.lazy(() => import("@/features/admin/orders/pages/AdminOrderDetailPage"));

const AdminCategoriesPage = React.lazy(() => import("@/features/admin/catalog/categories/pages/AdminCategoriesPage"));
const AdminBrandsPage = React.lazy(() => import("@/features/admin/catalog/brands/pages/AdminBrandsPage"));
const AdminAttributesPage = React.lazy(() => import("@/features/admin/catalog/attributes/pages/AdminAttributesPage"));
const AdminAttributeValuesPage = React.lazy(
  () => import("@/features/admin/catalog/attributes/pages/AdminAttributeValuesPage")
);

const AdminDiscountsPage = React.lazy(() => import("@/features/admin/catalog/discounts/pages/AdminDiscountsPage"));
const AdminInventoryLocationsPage = React.lazy(
  () => import("@/features/admin/inventory/locations/AdminInventoryLocationsPage")
);
const VariantInventoryPage = React.lazy(
  () => import("@/features/admin/inventory/variantInventory/VariantInventoryPage")
);

const wrap = (el: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="min-h-[200px] flex items-center justify-center">
        <Loader />
      </div>
    }
  >
    {el}
  </Suspense>
);

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <RoleRoute roles={["admin", "super_admin"]}>
        {wrap(<AdminLayout />)}
      </RoleRoute>
    ),
    children: [
      { index: true, element: wrap(<AdminDashboardPage />) },

      { path: "products", element: wrap(<AdminProductsPage />) },
      { path: "products/new", element: wrap(<AdminProductNewPage />) },
      //{ path: "products/:id", element: wrap(<AdminProductDetailPage />) },
      { path: "products/:slug", element: wrap(<AdminProductDetailPage />) },

      { path: "inventory", element: wrap(<AdminInventoryPage />) },

      { path: "orders", element: wrap(<AdminOrdersPage />) },
      { path: "orders/:id", element: wrap(<AdminOrderDetailPage />) },

      { path: "catalog/categories", element: wrap(<AdminCategoriesPage />) },
      { path: "catalog/brands", element: wrap(<AdminBrandsPage />) },
      { path: "catalog/attributes", element: wrap(<AdminAttributesPage />) },
      { path: "catalog/attributes/:id", element: wrap(<AdminAttributeValuesPage />) },

      { path: "catalog/discounts", element: wrap(<AdminDiscountsPage />) },

      { path: "inventory/locations", element: wrap(<AdminInventoryLocationsPage />) },
      { path: "inventory/variant/:variantId", element: wrap(<VariantInventoryPage />) },
    ],
  },
];