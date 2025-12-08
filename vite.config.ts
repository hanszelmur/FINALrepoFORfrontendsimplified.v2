import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'public',
  publicDir: '../public/assets',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        'property-details': resolve(__dirname, 'public/property-details.html'),
        'inquiry-form': resolve(__dirname, 'public/inquiry-form.html'),
        'how-to-inquire': resolve(__dirname, 'public/how-to-inquire.html'),
        'admin-dashboard': resolve(__dirname, 'public/admin/dashboard.html'),
        'admin-inquiries': resolve(__dirname, 'public/admin/inquiries.html'),
        'admin-properties': resolve(__dirname, 'public/admin/properties.html'),
        'admin-agents': resolve(__dirname, 'public/admin/agents.html'),
        'admin-reports': resolve(__dirname, 'public/admin/reports.html'),
        'agent-dashboard': resolve(__dirname, 'public/agent/dashboard.html'),
        'agent-inquiries': resolve(__dirname, 'public/agent/inquiries.html'),
        'agent-calendar': resolve(__dirname, 'public/agent/calendar.html'),
        'agent-properties': resolve(__dirname, 'public/agent/my-properties.html'),
        'login': resolve(__dirname, 'public/shared/login.html'),
        'calendar-view': resolve(__dirname, 'public/shared/calendar-view.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
