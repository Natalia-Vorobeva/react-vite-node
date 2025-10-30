import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	server: {		
		proxy: {
			'/api': {
				target: 'https://localhost:44305',
			}
		},
	},
	plugins: [react(), mkcert()]
})