import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import checker from "vite-plugin-checker";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  plugins: [
    wasm(),
    react(),
    checker({
      typescript: {
        tsconfigPath: "./tsconfig.app.json",
      },
    }),
  ],

  define: {
    global: {},
  },
  optimizeDeps: {
    exclude: ["manifold-3d"],
  },
});
