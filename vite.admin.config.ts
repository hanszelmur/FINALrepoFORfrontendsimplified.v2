/**
 * Vite Configuration for Admin Portal
 * Port 3002
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './public',
  server: {
    port: 3002,
    open: '/admin/index.html'
  },
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/admin/index.html')
      }
    }
  }
});
