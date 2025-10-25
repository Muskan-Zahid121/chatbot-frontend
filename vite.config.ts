import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Forward frontend "/api/*" calls to your backend during dev
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // remove the leading /api if your backend route doesn't include it
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})