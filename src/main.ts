import Alpine from 'alpinejs';
import './style.css';
import { isInitialized, loadSampleData } from './utils';

// Initialize Alpine.js
window.Alpine = Alpine;
Alpine.start();

// Auto-load sample data on first visit
if (!isInitialized()) {
  loadSampleData();
  console.log('Sample data loaded successfully!');
}

// Export Alpine for global access
declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}
