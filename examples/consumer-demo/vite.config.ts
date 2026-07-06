import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@tgoliveira/horizontal-carousel": path.resolve(rootDir, "../../src/index.ts"),
    },
  },
  server: {
    port: 5180,
    open: true,
  },
});
