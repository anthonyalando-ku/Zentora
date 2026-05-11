// src/utils/lazyWithRetry.ts
import { lazy } from "react";

export const lazyWithRetry = (factory: () => Promise<any>) =>
  lazy(() =>
    factory().catch((err) => {
      if (err?.message?.includes("Failed to fetch dynamically")) {
        window.location.reload();
        return new Promise(() => {});
      }
      throw err; // let RouteError handle real errors
    })
  );