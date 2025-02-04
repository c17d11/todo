import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
	require('dotenv').config({ path: `./.env` });

	return defineConfig({
		plugins: [vue()],
		server: {
			proxy: {
				'^/todos/.*': {
					target: 'http://' + (process.env.VITE_BACKEND_URL || 'localhost:3333'),
					// changeOrigin: true,
					rewrite: (path) => {
					const x = path.replace(/^\/todos/, '');
						return x;
					}
				}
			}
		},
		build: {
			outDir: '../public'
		}
	});
};
