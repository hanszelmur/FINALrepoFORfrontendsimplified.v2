/**
 * Timezone Utilities
 * Issue 15: Proper timezone handling for Asia/Manila
 * Always store dates in ISO format, display in local timezone
 */

const MANILA_TIMEZONE = 'Asia/Manila';

/**
 * Get current date/time in ISO format
 */
export function getCurrentISODateTime(): string {
  return new Date().toISOString();
}

/**
 * Format date for display in Manila timezone
 */
export function formatDateManila(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-PH', {
    timeZone: MANILA_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time for display in Manila timezone
 */
export function formatDateTimeManila(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-PH', {
    timeZone: MANILA_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format time only in Manila timezone
 */
export function formatTimeManila(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-PH', {
    timeZone: MANILA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get time ago relative to now
 */
export function getTimeAgoManila(isoString: string): string {
  if (!isoString) return '';

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDateManila(isoString);
}

/**
 * Parse date input and return ISO string
 */
export function parseToISO(dateInput: string | Date): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toISOString();
}

/**
 * Get days remaining until expiry
 */
export function getDaysUntilExpiry(expiryISO: string): number {
  if (!expiryISO) return 0;
  const expiry = new Date(expiryISO);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Check if date is expired
 */
export function isExpired(expiryISO: string): boolean {
  if (!expiryISO) return false;
  return new Date(expiryISO).getTime() < Date.now();
}

/**
 * Check if expiry is within warning threshold (2 days)
 */
export function isExpiryWarning(expiryISO: string): boolean {
  const daysRemaining = getDaysUntilExpiry(expiryISO);
  return daysRemaining > 0 && daysRemaining <= 2;
}

/**
 * Format date for input[type="date"] value (YYYY-MM-DD)
 */
export function formatForDateInput(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toISOString().split('T')[0];
}

/**
 * Format time for input[type="time"] value (HH:MM)
 */
export function formatForTimeInput(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toTimeString().split(':').slice(0, 2).join(':');
}

/**
 * Combine date and time inputs into ISO string
 */
export function combineDateTimeToISO(dateStr: string, timeStr: string): string {
  if (!dateStr || !timeStr) return '';
  const dateTime = new Date(`${dateStr}T${timeStr}:00`);
  return dateTime.toISOString();
}
