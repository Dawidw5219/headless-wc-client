import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    external: ["next", "next/cache", "@opentelemetry/api"],
    format: ["cjs", "esm"],
    splitting: false,
    sourcemap: false,
    clean: true,
    dts: true,
  },
  {
    entry: { next: "src/next/index.ts" },
    external: ["next", "next/cache", "@opentelemetry/api"],
    format: ["cjs", "esm"],
    splitting: false,
    sourcemap: false,
    clean: false,
    dts: true,
  },
]);
