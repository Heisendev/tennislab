import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from 'vite'

import path from 'path'

// https://vite.dev/config/
export default defineConfig(() => {
  const analyzePlugins = process.env.ANALYZE === 'true' ? [visualizer({ open: true })] : []

  return {
    plugins: [react(), tailwindcss(), ...analyzePlugins],
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@providers': path.resolve(__dirname, 'src/providers'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@types': path.resolve(__dirname, 'src/types'),
      },
    },
    build: {
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            zod: ['zod'],
            motion: ['motion-dom'],
            query: ['@tanstack/react-query'],
            datepicker: ['react-datepicker'],
          },
        },
      },
    },
  }
})
