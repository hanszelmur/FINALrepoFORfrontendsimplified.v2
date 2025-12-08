/**
 * Client-side Rate Limiting
 * Issue 28: Track submission attempts and prevent abuse
 */

interface RateLimitAttempt {
  email: string;
  timestamp: number;
}

const RATE_LIMIT_KEY = 'tes_rate_limits';
const MAX_ATTEMPTS = 3;
const TIME_WINDOW_MS = 60 * 1000; // 1 minute

/**
 * Get rate limit attempts from storage
 */
function getAttempts(): RateLimitAttempt[] {
  try {
    const data = localStorage.getItem(RATE_LIMIT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[Rate Limit] Failed to get attempts:', error);
    return [];
  }
}

/**
 * Save rate limit attempts to storage
 */
function saveAttempts(attempts: RateLimitAttempt[]): void {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(attempts));
  } catch (error) {
    console.error('[Rate Limit] Failed to save attempts:', error);
  }
}

/**
 * Clean old attempts outside the time window
 */
function cleanOldAttempts(attempts: RateLimitAttempt[]): RateLimitAttempt[] {
  const now = Date.now();
  return attempts.filter((attempt) => now - attempt.timestamp < TIME_WINDOW_MS);
}

/**
 * Check if email is rate limited
 */
export function isRateLimited(email: string): boolean {
  const attempts = getAttempts();
  const cleanedAttempts = cleanOldAttempts(attempts);
  
  // Count attempts for this email
  const emailAttempts = cleanedAttempts.filter(
    (attempt) => attempt.email.toLowerCase() === email.toLowerCase()
  );

  return emailAttempts.length >= MAX_ATTEMPTS;
}

/**
 * Record a submission attempt
 */
export function recordAttempt(email: string): void {
  const attempts = getAttempts();
  const cleanedAttempts = cleanOldAttempts(attempts);
  
  cleanedAttempts.push({
    email: email.toLowerCase(),
    timestamp: Date.now(),
  });

  saveAttempts(cleanedAttempts);
}

/**
 * Get remaining attempts for an email
 */
export function getRemainingAttempts(email: string): number {
  const attempts = getAttempts();
  const cleanedAttempts = cleanOldAttempts(attempts);
  
  const emailAttempts = cleanedAttempts.filter(
    (attempt) => attempt.email.toLowerCase() === email.toLowerCase()
  );

  return Math.max(0, MAX_ATTEMPTS - emailAttempts.length);
}

/**
 * Get time until rate limit resets (in seconds)
 */
export function getTimeUntilReset(email: string): number {
  const attempts = getAttempts();
  const emailAttempts = attempts
    .filter((attempt) => attempt.email.toLowerCase() === email.toLowerCase())
    .sort((a, b) => a.timestamp - b.timestamp);

  if (emailAttempts.length === 0) return 0;

  const oldestAttempt = emailAttempts[0];
  const resetTime = oldestAttempt.timestamp + TIME_WINDOW_MS;
  const now = Date.now();
  const secondsUntilReset = Math.ceil((resetTime - now) / 1000);

  return Math.max(0, secondsUntilReset);
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

/**
 * Get rate limit message
 */
export function getRateLimitMessage(email: string): string {
  const timeRemaining = getTimeUntilReset(email);
  return `Too many submission attempts. Please try again in ${formatTimeRemaining(timeRemaining)}.`;
}

/**
 * Clear rate limits for testing (admin only)
 */
export function clearRateLimits(): void {
  try {
    localStorage.removeItem(RATE_LIMIT_KEY);
    // eslint-disable-next-line no-console
    console.log('[Rate Limit] All rate limits cleared');
  } catch (error) {
    console.error('[Rate Limit] Failed to clear rate limits:', error);
  }
}

/**
 * Clear rate limits for specific email
 */
export function clearEmailRateLimit(email: string): void {
  const attempts = getAttempts();
  const filtered = attempts.filter(
    (attempt) => attempt.email.toLowerCase() !== email.toLowerCase()
  );
  saveAttempts(filtered);
}
