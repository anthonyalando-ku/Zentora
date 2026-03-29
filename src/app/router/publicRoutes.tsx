import React, { Suspense } from "react";
import { LoaderFallback } from "@/shared/components/ui";
import { RouteError } from "@/core/error/RouteError";

const AboutUsPage = React.lazy(() => import("@/features/public/pages/AboutUsPage"));
const ContactUsPage = React.lazy(() => import("@/features/public/pages/ContactUsPage"));
const HelpCenterPage = React.lazy(() => import("@/features/public/pages/HelpCenterPage"));

const HomePage = React.lazy(() => import("@/features/public/home/pages/HomePage"));
const UnauthorizedPage = React.lazy(() => import("@/features/public/unauthorized/pages/UnauthorizedPage"));
const ProductsPage = React.lazy(() => import("@/features/products/pages/ProductsPage"));
const ProductDetailPage = React.lazy(() => import("@/features/products/pages/ProductDetailPage"));
const CartPage = React.lazy(() => import("@/features/cart/pages/CartPage"));
const CheckoutPage = React.lazy(() => import("@/features/checkout/pages/CheckoutPage"));
const AccountDashboardPage = React.lazy(() => import("@/features/account/pages/AccountDashboardPage"));


const wrap = (component: React.ReactNode) => (
  <Suspense fallback={<LoaderFallback />}>{component}</Suspense>
);

export const publicRoutes = [
  {
    path: "/",
    element: wrap(<HomePage />),
    errorElement: <RouteError />,
  },
  {
    path: "/unauthorized",
    element: wrap(<UnauthorizedPage />),
  },
  {
    path: "/products",
    element: wrap(<ProductsPage />),
  },
  {
    path: "/products/:slug",
    element: wrap(<ProductDetailPage />),
  },
  {
    path: "/cart",
    element: wrap(<CartPage />),
  },
  {
    path: "/checkout",
    element: wrap(<CheckoutPage />),
  },
  {
    path: "/account",
    element: wrap(<AccountDashboardPage />),
  },
  { path: "/about", element: wrap(<AboutUsPage />) },
  { path: "/contact", element: wrap(<ContactUsPage />) },
  { path: "/help", element: wrap(<HelpCenterPage />) },
];