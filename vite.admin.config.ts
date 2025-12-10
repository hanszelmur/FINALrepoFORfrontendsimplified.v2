/**
 * Vite Configuration for Admin Portal
 * Port 3002
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3002,
    open: '/public/admin/index.html'
  },
  build: {
    outDir: './dist/admin',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/admin/index.html')
      }
    }
  }
});
