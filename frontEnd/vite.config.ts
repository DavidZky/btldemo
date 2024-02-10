import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import eslintPlugin from "vite-plugin-eslint2"; // 引入vite-plugin-vue
import vuetify from "vite-plugin-vuetify";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // eslintPlugin(),
    vuetify({
      autoImport: true,
    }),
  ],
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
