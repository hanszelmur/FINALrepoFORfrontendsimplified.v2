/**
 * Vite Configuration for Agent Portal
 * Port 3003
 */
import { defineConfig } from 'vite';

export default defineConfig({
  root: './public',
  server: {
    port: 3003,
    open: '/agent/index.html'
  },
  build: {
    outDir: '../dist/agent',
    emptyOutDir: true
  }
});
