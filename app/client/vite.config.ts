import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '')
  const server = environment.VITE_SERVER_URL || 'http://localhost:3000'

  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '~': new URL('./src', import.meta.url).pathname } },
    server: {
      proxy: {
        '/api': { target: server, changeOrigin: true },
        '/graphql': { target: server, changeOrigin: true },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            framework: ['react', 'react-dom', 'react-router-dom'],
            data: ['@tanstack/react-query', 'axios', 'graphql-request'],
            forms: ['@hookform/resolvers', 'react-hook-form', 'zod'],
            ui: [
              '@radix-ui/react-slot',
              'class-variance-authority',
              'clsx',
              'lucide-react',
              'tailwind-merge',
            ],
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
    },
  }
})
