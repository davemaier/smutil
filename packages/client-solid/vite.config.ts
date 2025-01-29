import { tanstackViteConfig } from "@tanstack/config/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, mergeConfig } from "vite";

// https://vite.dev/config/
const config = defineConfig({
  plugins: [react()],
});

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: "./src/index.ts",
    srcDir: "./src",
  })
);
