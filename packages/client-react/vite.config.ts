import { defineConfig, mergeConfig } from "vite";
import { tanstackViteConfig } from "@tanstack/config/vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
const config = defineConfig({
  plugins: [react()],
});

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: "./src/index.ts",
    srcDir: "./src",
  }),
  // {
  //   build: {
  //     minify: "terser",
  //     rollupOptions: { output: { preserveModules: false } },
  //   },
  // },
);
