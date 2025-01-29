import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // Generates both formats
  dts: true, // Generate .d.ts type declarations
  sourcemap: true, // Optional source maps
  clean: true, // Clean dist folder before build
  splitting: true, // Enable code splitting
  bundle: true, // Bundle dependencies (adjust per needs)
  target: "es2017", // Modern browser target
  outDir: "dist",
  esbuildOptions(options) {
    options.jsx = "automatic"; // For React 17+ JSX transform
  },
});
