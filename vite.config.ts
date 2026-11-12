import fs from "fs";
import path from "path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const SCREENSHOT_DIR = path.resolve(__dirname, "panels/screenshots");
const MAX_SCREENSHOT_BYTES = 500 * 1024;

// Every visitor downloads these, so keep them small. Names and references are checked in
// src/data/panels.ts; this checks what only the file system knows.
function checkPanelScreenshots(): Plugin {
  return {
    name: "check-panel-screenshots",
    apply: "build",
    buildStart() {
      if (!fs.existsSync(SCREENSHOT_DIR)) return;
      const screenshotFileNames = fs.readdirSync(SCREENSHOT_DIR);
      for (const fileName of screenshotFileNames) {
        if (fileName.startsWith(".")) continue;
        if (!/\.(png|jpg|webp)$/.test(fileName)) {
          this.error(`panels/screenshots/${fileName}: use a .png, .jpg or .webp file`);
        }
        const { size } = fs.statSync(path.join(SCREENSHOT_DIR, fileName));
        if (size > MAX_SCREENSHOT_BYTES) {
          this.error(
            `panels/screenshots/${fileName}: ${Math.round(size / 1024)} KB, keep it under 500 KB`,
          );
        }
      }
    },
  };
}

export default defineConfig({
  // Served at djangocontrolroom.com/panels/ through a Cloudflare Worker that strips the prefix.
  base: "/panels/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), tailwindcss(), checkPanelScreenshots()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
