import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				// additionalData: `
        //   @use "sass:color";
        //   @use "sass:map";
        //   @use "sass:list";
        //   @use "sass:string";
        //    @import "./src/assets/styles/_variables.scss";
        // `
				//   additionalData: `
        //   @import "./src/assets/styles/_variables.scss";
        // `
      // }
			}
		}
	},
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
	build: {
		outDir: 'dist',
		sourcemap: false,
	},
})