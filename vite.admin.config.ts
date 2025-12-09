/**
 * Vite Configuration for Admin Portal
 * Port 3002
 */
import { defineConfig } from 'vite';

export default defineConfig({
  root: './public',
  server: {
    port: 3002,
    open: '/admin/index.html'
  },
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true
  }
});
