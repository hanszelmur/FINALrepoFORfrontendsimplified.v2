import Alpine from 'alpinejs';
import './style.css';
import { isInitialized, loadSampleData, getProperties } from './utils';
import { formatPHP } from './utils/formatter';
import { setupGlobalErrorHandlers } from './utils/error-handler';
import { runMigrations } from './utils/migration';
import { registerServiceWorker } from './utils/sw-register';
import type { Property } from './types';

// Setup global error handlers (Issue 7)
setupGlobalErrorHandlers();

// Run migrations for data format changes
runMigrations();

// Auto-load sample data on first visit
if (!isInitialized()) {
  loadSampleData();
  // eslint-disable-next-line no-console
  console.log('Sample data loaded successfully!');
}

// Issue 25: Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerServiceWorker().catch((error) => {
      console.error('[SW] Registration error:', error);
    });
  });
}

// Issue 16: Track intervals for cleanup
const activeIntervals: ReturnType<typeof setInterval>[] = [];

// Register Alpine components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Alpine.data('propertyBrowser', (): any => {
  return {
    mobileMenuOpen: false,
    loading: true,
    allProperties: [] as Property[],
    filteredProperties: [] as Property[],
    paginatedProperties: [] as Property[],
    currentPage: 1,
    itemsPerPage: 20,
    totalPages: 1,
    filters: {
      price: '',
      type: '',
      location: '',
      status: '',
    },
    lastRefreshTime: '',
    isRefreshing: false,
    autoRefreshEnabled: true,

    init() {
      this.loadProperties();
      this.updateLastRefreshTime();
      
      // Issue 4: Auto-refresh only when page visible
      const refreshInterval = setInterval(() => {
        if (this.autoRefreshEnabled && document.visibilityState === 'visible') {
          this.loadProperties();
        }
      }, 30000);
      
      activeIntervals.push(refreshInterval);
      
      // Issue 16: Cleanup on page unload
      window.addEventListener('beforeunload', this.cleanup.bind(this));
    },

    loadProperties() {
      this.loading = true;
      setTimeout(() => {
        this.allProperties = getProperties().filter(
          (p) => p.status === 'Available' || p.status === 'Reserved' || p.status === 'Pending'
        );
        this.applyFilters();
        this.loading = false;
        this.updateLastRefreshTime();
        this.isRefreshing = false;
      }, 300); // Small delay to show loading state
    },

    // Issue 4: Manual refresh button
    manualRefresh() {
      this.isRefreshing = true;
      this.loadProperties();
    },

    // Issue 4: Update last refresh timestamp
    updateLastRefreshTime() {
      const now = new Date();
      this.lastRefreshTime = now.toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
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
      
      // Issue 17: Calculate pagination
      this.totalPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage);
      this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages));
      this.updatePaginatedProperties();
    },

    // Issue 17: Update paginated properties
    updatePaginatedProperties() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.paginatedProperties = this.filteredProperties.slice(start, end);
    },

    // Issue 17: Pagination controls
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePaginatedProperties();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    nextPage() {
      this.goToPage(this.currentPage + 1);
    },

    previousPage() {
      this.goToPage(this.currentPage - 1);
    },

    // Issue 16: Cleanup intervals
    cleanup() {
      activeIntervals.forEach((interval) => clearInterval(interval));
      activeIntervals.length = 0;
    },

    formatPHP(amount: number) {
      return formatPHP(amount);
    },

    // Get first photo data
    getFirstPhoto(property: Property) {
      if (property.photos && property.photos.length > 0) {
        const firstPhoto = property.photos[0];
        return typeof firstPhoto === 'string' ? firstPhoto : firstPhoto.data;
      }
      return 'https://via.placeholder.com/400x300?text=No+Image';
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

// Issue 16: Additional cleanup on window close
window.addEventListener('unload', () => {
  activeIntervals.forEach((interval) => clearInterval(interval));
});
