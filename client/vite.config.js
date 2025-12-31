import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  // Загружаем env переменные для текущего режима
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    server: {
      proxy: {
        '/api': {
          target: 'http://a0830433.xsph.ru',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      },
    },
    plugins: [react()],
    // Настройка для production сборки
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  }
})