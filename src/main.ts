import Alpine from 'alpinejs';
import './style.css';
import { isInitialized, loadSampleData, getProperties } from './utils';
import { formatPHP } from './utils/formatter';
import type { Property } from './types';

// Auto-load sample data on first visit
if (!isInitialized()) {
  loadSampleData();
  // eslint-disable-next-line no-console
  console.log('Sample data loaded successfully!');
}

// Register Alpine components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Alpine.data('propertyBrowser', (): any => {
  return {
    mobileMenuOpen: false,
    loading: true,
    allProperties: [] as Property[],
    filteredProperties: [] as Property[],
    filters: {
      price: '',
      type: '',
      location: '',
      status: '',
    },

    init() {
    this.loadProperties();
    // Auto-refresh every 30 seconds
    setInterval(() => this.loadProperties(), 30000);
  },

  loadProperties() {
    this.allProperties = getProperties().filter(
      (p) => p.status === 'Available' || p.status === 'Reserved' || p.status === 'Pending'
    );
    this.filteredProperties = this.allProperties;
    this.loading = false;
  },

  applyFilters() {
    this.filteredProperties = this.allProperties.filter((property: Property) => {
      // Price filter
      if (this.filters.price) {
        const [min, max] = this.filters.price.split('-').map(Number);
        if (property.price < min || property.price > max) return false;
      }

      // Type filter
      if (this.filters.type && property.type !== this.filters.type) {
        return false;
      }

      // Location filter
      if (this.filters.location && !property.address.city.includes(this.filters.location)) {
        return false;
      }

      // Status filter
      if (this.filters.status && property.status !== this.filters.status) {
        return false;
      }

      return true;
    });
  },

  formatPHP(amount: number) {
      return formatPHP(amount);
    },
  };
});

// Initialize Alpine.js
window.Alpine = Alpine;
Alpine.start();

// Export Alpine for global access
declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}
