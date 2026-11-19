// Builds the whole site into ONE self-contained HTML file (for quick previews / sharing).
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { outDir: "dist-single", assetsInlineLimit: 100000000, chunkSizeWarningLimit: 4000 },
});
