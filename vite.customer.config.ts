/**
 * Vite Configuration for Customer Portal
 * Port 3001
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './public',
  server: {
    port: 3001,
    open: '/index.html'
  },
  build: {
    outDir: '../dist/customer',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html')
      }
    }
  }
});
