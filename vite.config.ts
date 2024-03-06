import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    // 使用路径别名时想要省略的后缀名，官方不建议将.vue文件省略后缀
    extensions: [".js", ".ts"],
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "echartsvueShow",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "[name].js",
      },
    },
    lib: {
      entry: resolve(__dirname, "./src/buildMain.ts"),
      formats: ["iife"],
      name: "echartsvueShow",
    },
  },
  server: {
    //https: true, // 是否开启 https
    port: 3000,
    host: "0.0.0.0",
    open: false,
    proxy: {
      "/api": {
        target: "http://localhost:8089",
        changeOrigin: true,
      },
    },
  },
});
