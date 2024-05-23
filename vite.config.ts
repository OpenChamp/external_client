import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	plugins: [react()],
	clearScreen: false,
	resolve: {
		alias: {
			"@": await path.resolve("src/"),
		},
	},
	server: {
		port: 1420,
		strictPort: true,
		watch: {
			ignored: ["**/src-tauri/**"],
		},
	},
}));
