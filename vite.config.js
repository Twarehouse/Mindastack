import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [],
    },
  },
  // Tell Vite that ROSLIB is a global from CDN
  define: {
    global: "globalThis",
  },
});