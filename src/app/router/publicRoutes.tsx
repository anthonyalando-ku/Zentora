import React, { Suspense } from "react";
import { LoaderFallback } from "@/shared/components/ui";
import { RouteError } from "@/core/error/RouteError";
import { lazyWithRetry } from "@/shared/utils/lazyWithRetry";

const AboutUsPage        = lazyWithRetry(() => import("@/features/public/pages/AboutUsPage"));
const ContactUsPage      = lazyWithRetry(() => import("@/features/public/pages/ContactUsPage"));
const HelpCenterPage     = lazyWithRetry(() => import("@/features/public/pages/HelpCenterPage"));
const ReturnPolicyPage   = lazyWithRetry(() => import("@/features/public/pages/ReturnPolicyPage"));
const PrivacyPolicyPage  = lazyWithRetry(() => import("@/features/public/pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazyWithRetry(() => import("@/features/public/pages/TermsOfServicePage"));

const HomePage             = lazyWithRetry(() => import("@/features/public/home/pages/HomePage"));
const UnauthorizedPage     = lazyWithRetry(() => import("@/features/public/unauthorized/pages/UnauthorizedPage"));
const ProductsPage         = lazyWithRetry(() => import("@/features/products/pages/ProductsPage"));
const CollectionPage       = lazyWithRetry(() => import("@/features/products/pages/CollectionPage"));
const ProductDetailPage    = lazyWithRetry(() => import("@/features/products/pages/ProductDetailPage"));
const CartPage             = lazyWithRetry(() => import("@/features/cart/pages/CartPage"));
const CheckoutPage         = lazyWithRetry(() => import("@/features/checkout/pages/CheckoutPage"));
const AccountDashboardPage = lazyWithRetry(() => import("@/features/account/pages/AccountDashboardPage"));

const withError = (route: object) => ({ ...route, errorElement: <RouteError /> });

const wrap = (component: React.ReactNode) => (
  <Suspense fallback={<LoaderFallback />}>{component}</Suspense>
);

export const publicRoutes = [
    withError({ path: "/", element: wrap(<HomePage />) }),
    withError({ path: "/products", element: wrap(<ProductsPage />) }),
    withError({ path: "/collections/:slug",   element: wrap(<CollectionPage />), }),

    withError({ path: "/products/:slug", element: wrap(<ProductDetailPage />) }),
    withError({ path: "/unauthorized",   element: wrap(<UnauthorizedPage />) }),

  withError({ path: "/cart",           element: wrap(<CartPage />) }),
  withError({ path: "/checkout",       element: wrap(<CheckoutPage />) }),
  withError({ path: "/account",        element: wrap(<AccountDashboardPage />) }),

  // ── Public information pages ──────────────────────────────────────────────
  withError({ path: "/about",   element: wrap(<AboutUsPage />) }),
  withError({ path: "/contact", element: wrap(<ContactUsPage />) }),
  withError({ path: "/help",    element: wrap(<HelpCenterPage />) }),
  withError({ path: "/returns", element: wrap(<ReturnPolicyPage />) }),
  withError({ path: "/privacy", element: wrap(<PrivacyPolicyPage />) }),
  withError({ path: "/terms",   element: wrap(<TermsOfServicePage />) }),
];