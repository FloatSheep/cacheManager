import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      entry: "src/main.ts",
      name: "cacheManager",
    },
    sourcemap: true,
    minify: true,
  },
});
