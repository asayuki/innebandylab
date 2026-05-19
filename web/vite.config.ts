import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  plugins: [
    vue(),
    svgLoader()
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: (process.env.APP_PORT as unknown as number) || 3002,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: `http://${process.env.API_HOST ?? 'localhost'}:${process.env.API_PORT || 3000}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
