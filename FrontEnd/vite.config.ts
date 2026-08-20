import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // plain `process.env` 不會自動吃到 .env.local，要用 loadEnv 讀
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      port: 5173,
      proxy: {
        // 開發時把 /api 轉給後端，前端就不用處理 CORS
        '/api': {
          target: env.VITE_API_TARGET ?? 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  }
})
