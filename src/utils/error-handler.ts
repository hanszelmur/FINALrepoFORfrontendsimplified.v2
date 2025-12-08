/**
 * Global Error Handling
 * Issue 7: Comprehensive error handling with user-friendly messages
 */

export class StorageError extends Error {
  constructor(
    message: string,
    public code: 'QUOTA_EXCEEDED' | 'PARSE_ERROR' | 'UNKNOWN' = 'UNKNOWN'
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Safe localStorage wrapper with error handling
 */
export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`[Storage Error] Failed to get ${key}:`, error);
    showErrorMessage(
      'Failed to load data. Please refresh the page.',
      'storage-get'
    );
    return defaultValue;
  }
}

/**
 * Safe localStorage set with quota exceeded handling
 */
export function safeLocalStorageSet(key: string, value: unknown): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.error('[Storage Error] Quota exceeded:', error);
        showErrorMessage(
          'Storage quota exceeded. Please delete some data or clear old records.',
          'quota-exceeded'
        );
        throw new StorageError(
          'Storage quota exceeded. Please clear some data.',
          'QUOTA_EXCEEDED'
        );
      }
    }
    console.error(`[Storage Error] Failed to save ${key}:`, error);
    showErrorMessage(
      'Failed to save data. Please try again.',
      'storage-set'
    );
    return false;
  }
}

/**
 * Safe localStorage remove
 */
export function safeLocalStorageRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[Storage Error] Failed to remove ${key}:`, error);
    return false;
  }
}

/**
 * Check available storage space
 */
export function checkStorageQuota(): { used: number; available: number; percentage: number } {
  let used = 0;
  let available = 5 * 1024 * 1024; // Default 5MB estimate

  try {
    // Calculate used space
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        used += localStorage[key].length + key.length;
      }
    }

    // Modern browsers support StorageManager API
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        if (estimate.usage && estimate.quota) {
          used = estimate.usage;
          available = estimate.quota;
        }
      });
    }
  } catch (error) {
    console.error('[Storage] Failed to check quota:', error);
  }

  const percentage = (used / available) * 100;
  return { used, available, percentage };
}

/**
 * Clear old data if quota is nearly exceeded
 */
export function clearOldDataIfNeeded(): void {
  const { percentage } = checkStorageQuota();
  if (percentage > 90) {
    console.warn('[Storage] Storage is nearly full (>90%). Consider clearing old data.');
    showErrorMessage(
      'Storage is nearly full. Some old data may need to be cleared.',
      'storage-warning'
    );
  }
}

/**
 * Display error message to user
 */
export function showErrorMessage(message: string, type: string = 'error'): void {
  // Create alert element
  const alertId = `alert-${type}-${Date.now()}`;
  const alert = document.createElement('div');
  alert.id = alertId;
  alert.className = `alert alert-danger`;
  alert.setAttribute('role', 'alert');
  alert.setAttribute('aria-live', 'assertive');
  alert.innerHTML = `
    <strong>Error:</strong> ${escapeHtml(message)}
    <button onclick="document.getElementById('${alertId}').remove()" class="alert-close" aria-label="Close">×</button>
  `;

  // Insert at top of body or container
  const container = document.querySelector('.container') || document.body;
  container.insertBefore(alert, container.firstChild);

  // Auto-remove after 7 seconds
  setTimeout(() => {
    const el = document.getElementById(alertId);
    if (el) el.remove();
  }, 7000);
}

/**
 * Display success message to user
 */
export function showSuccessMessage(message: string): void {
  const alertId = `alert-success-${Date.now()}`;
  const alert = document.createElement('div');
  alert.id = alertId;
  alert.className = `alert alert-success`;
  alert.setAttribute('role', 'status');
  alert.setAttribute('aria-live', 'polite');
  alert.innerHTML = `
    ${escapeHtml(message)}
    <button onclick="document.getElementById('${alertId}').remove()" class="alert-close" aria-label="Close">×</button>
  `;

  const container = document.querySelector('.container') || document.body;
  container.insertBefore(alert, container.firstChild);

  setTimeout(() => {
    const el = document.getElementById(alertId);
    if (el) el.remove();
  }, 5000);
}

/**
 * Escape HTML to prevent XSS (Issue 29)
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitize user input to prevent XSS (Issue 29)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Global error event listener
 */
export function setupGlobalErrorHandlers(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise Rejection]', event.reason);
    showErrorMessage(
      'An unexpected error occurred. Please try again.',
      'unhandled-rejection'
    );
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    console.error('[Global Error]', event.error);
    // Don't show alert for every error, as it may be too noisy
    // Only log to console for debugging
  });
}

/**
 * Log error for debugging
 */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);
  if (error instanceof Error) {
    console.error('Stack:', error.stack);
  }
}
