/**
 * Vite Configuration for Agent Portal
 * Port 3003
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3003,
    open: '/public/agent/index.html'
  },
  build: {
    outDir: './dist/agent',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/agent/index.html')
      }
    }
  }
});
