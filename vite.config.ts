import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { wishlistFromGitHub } from "./wishlist-from-github";

export default defineConfig({
  // Served at djangocontrolroom.com/panels/ through a Cloudflare Worker that strips the prefix.
  base: "/panels/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), tailwindcss(), wishlistFromGitHub()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
