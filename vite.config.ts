import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// proxy server 설정 

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://3.39.235.166:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    },

    port: 8080,
  }
})
