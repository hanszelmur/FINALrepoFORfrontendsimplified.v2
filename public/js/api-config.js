/**
 * API Configuration
 * Centralized API base URL configuration for all portals
 */

// API Base URL - can be changed for different environments
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000'
  : ''; // Use relative URLs in production (same domain)

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_BASE_URL };
}
