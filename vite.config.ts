import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: true,
    allowedHosts: [".ngrok-free.app"],

    proxy: {
      "/api": {
        target: "https://zentora-api.onrender.com",
        changeOrigin: true,
        secure: false,

        rewrite: (path) => path.replace(/^\/api/, "/api/v1"),
      },
    },
  },
});