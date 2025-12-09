/**
 * Vite Configuration for Admin Portal
 * Port 3002 - Admin management interface
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public/assets',
  server: {
    port: 3002,
    open: '/public/admin/index.html'
  },
  build: {
    outDir: 'dist/admin',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/admin/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
