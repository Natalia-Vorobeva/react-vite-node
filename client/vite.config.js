import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	build: {
    outDir: 'dist',
    sourcemap: false, // Для уменьшения размера сборки
  },
	server: {		
		proxy: {
			'/api': {
				target: 'https://localhost:44305',
			}
		},
	},
	plugins: [react(), mkcert()]
})