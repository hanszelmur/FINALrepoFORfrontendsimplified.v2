/**
 * Vite Configuration
 * Issue 26: Bundle optimization with code splitting and tree shaking
 */
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public/assets',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Sourcemaps disabled for production to reduce bundle size
    // Enable for staging/debugging: set to true or 'hidden'
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
      },
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-alpine': ['alpinejs'],
          'vendor-validation': ['joi'],
          'vendor-sanitize': ['dompurify'],
          'vendor-image': ['browser-image-compression'],
          'vendor-workbox': ['workbox-window'],
          
          // App chunks
          'utils-core': [
            './src/utils/storage.ts',
            './src/utils/error-handler.ts',
            './src/utils/timezone.ts',
          ],
          'utils-validation': [
            './src/utils/validation.ts',
            './src/utils/joi-validation.ts',
          ],
          'utils-image': [
            './src/utils/image-upload.ts',
          ],
          'utils-business': [
            './src/utils/agent-stats.ts',
            './src/utils/calendar-conflict.ts',
            './src/utils/expiry-checker.ts',
            './src/utils/rate-limiter.ts',
          ],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'alpinejs',
      'joi',
      'dompurify',
      'browser-image-compression',
      'workbox-window',
    ],
  },
});
