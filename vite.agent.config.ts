/**
 * Vite Configuration for Agent Portal
 * Port 3003 - Agent dashboard and management
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './public',
  server: {
    port: 3003,
    open: '/agent/index.html'
  },
  build: {
    outDir: '../dist/agent',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/agent/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
