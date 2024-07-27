import { defineConfig } from "vite";
import dns from "node:dns";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

dns.setDefaultResultOrder("verbatim");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "https://agile-estimate-fastify.vercel.app",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
