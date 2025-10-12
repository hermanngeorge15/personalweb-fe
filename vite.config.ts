import { defineConfig } from 'vite'
import eslintPlugin from '@nabla/vite-plugin-eslint'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      verboseFileRoutes: false,
    }),
    react(),
    eslintPlugin(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/actuator': {
        target:
          process.env.VITE_PROXY_TARGET ?? 'http://localhost:8891',
        changeOrigin: true,
      },
      '/api': {
        target:
          process.env.VITE_PROXY_TARGET ?? 'http://localhost:8891',
        changeOrigin: true,
      },
      // BFF session & SSE endpoints (proxy to BE so we avoid CORS and keep HttpOnly cookies)
      '/session': {
        target:
          process.env.VITE_PROXY_TARGET ?? 'http://localhost:8891',
        changeOrigin: true,
      },
      '/sse': {
        target:
          process.env.VITE_PROXY_TARGET ?? 'http://localhost:8891',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3333,
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  optimizeDeps: {
    include: [
      'react-markdown',
      'remark-gfm',
      'rehype-highlight',
    ],
  },
})
