/**
 * Vite Configuration for Customer Portal
 * Port 3001
 */
import { defineConfig } from 'vite';

export default defineConfig({
  root: './public',
  server: {
    port: 3001,
    open: '/index.html'
  },
  build: {
    outDir: '../dist/customer',
    emptyOutDir: true
  }
});
