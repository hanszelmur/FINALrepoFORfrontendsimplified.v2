/**
 * Vite Configuration for Super Admin Portal (HR Management)
 * Port 3004
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3004,
    open: '/superadmin/index.html'
  },
  build: {
    outDir: './dist/superadmin',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/superadmin/index.html')
      }
    }
  }
});
