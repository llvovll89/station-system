import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import react from '@vitejs/plugin-react'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log(env);

  return {
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            naverClientId: env.VITE_NAVER_MAP_CLIENT_ID
          }
        }
      })
    ],

    server: {
      proxy: {
        "/api": {
          target: "http://3.39.235.166:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      },

      port: 8080,
    },
  }
})
