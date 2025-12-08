/**
 * Reservation Expiry Checker
 * Issue 9: Check expiry dates and show warnings
 */

import type { Inquiry } from '../types';
import { getInquiries } from './storage';
import { getDaysUntilExpiry, isExpiryWarning, isExpired } from './timezone';

export interface ExpiryWarning {
  inquiry: Inquiry;
  daysRemaining: number;
  isExpired: boolean;
  message: string;
  severity: 'danger' | 'warning';
}

/**
 * Check all reservations for expiry warnings
 */
export function checkReservationExpiry(): ExpiryWarning[] {
  const inquiries = getInquiries();
  const warnings: ExpiryWarning[] = [];

  inquiries.forEach((inquiry) => {
    if (!inquiry.reservationExpiryDate) return;

    // Only check for active reservations
    const activeStatuses = [
      'Waiting - Property Reserved',
      'Viewing Scheduled',
      'Viewed - Interested',
      'Viewed - Undecided',
      'Deposit Paid',
    ];

    if (!activeStatuses.includes(inquiry.status)) return;

    const daysRemaining = getDaysUntilExpiry(inquiry.reservationExpiryDate);
    const expired = isExpired(inquiry.reservationExpiryDate);
    const warning = isExpiryWarning(inquiry.reservationExpiryDate);

    if (expired) {
      warnings.push({
        inquiry,
        daysRemaining: 0,
        isExpired: true,
        message: `Reservation for "${inquiry.propertyName}" has expired!`,
        severity: 'danger',
      });
    } else if (warning) {
      warnings.push({
        inquiry,
        daysRemaining,
        isExpired: false,
        message: `Reservation for "${inquiry.propertyName}" expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`,
        severity: 'warning',
      });
    }
  });

  // Sort by days remaining (most urgent first)
  return warnings.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Check expiry for a specific agent's inquiries
 */
export function checkAgentReservationExpiry(agentId: number): ExpiryWarning[] {
  const allWarnings = checkReservationExpiry();
  return allWarnings.filter((w) => w.inquiry.assignedAgentId === agentId);
}

/**
 * Get count of expiring reservations
 */
export function getExpiringReservationCount(): number {
  const warnings = checkReservationExpiry();
  return warnings.length;
}

/**
 * Get count of expired reservations
 */
export function getExpiredReservationCount(): number {
  const warnings = checkReservationExpiry();
  return warnings.filter((w) => w.isExpired).length;
}

/**
 * Check if daily expiry check should run
 * Returns true if last check was more than 24 hours ago
 */
export function shouldRunDailyExpiryCheck(): boolean {
  const LAST_CHECK_KEY = 'tes_last_expiry_check';
  try {
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    if (!lastCheck) return true;

    const lastCheckTime = new Date(lastCheck).getTime();
    const now = Date.now();
    const hoursSinceLastCheck = (now - lastCheckTime) / (1000 * 60 * 60);

    return hoursSinceLastCheck >= 24;
  } catch (error) {
    console.error('[Expiry Check] Error checking last run:', error);
    return true;
  }
}

/**
 * Mark daily expiry check as completed
 */
export function markDailyExpiryCheckCompleted(): void {
  const LAST_CHECK_KEY = 'tes_last_expiry_check';
  try {
    localStorage.setItem(LAST_CHECK_KEY, new Date().toISOString());
  } catch (error) {
    console.error('[Expiry Check] Error marking check completed:', error);
  }
}

/**
 * Run daily expiry check and return warnings
 * TODO [Fullstack Implementation]:
 * When backend is implemented, replace this with a cron job:
 * 1. Run daily at 8 AM Manila time
 * 2. Check all reservations in database
 * 3. Send email/SMS notifications to customers and agents
 * 4. Create dashboard alerts for admins
 * 5. Auto-update inquiry status if needed
 * 
 * Example cron expression: "0 8 * * *" (every day at 8 AM)
 * Example implementation: node-cron, bull queue, or cloud scheduler
 */
export function runDailyExpiryCheck(): ExpiryWarning[] {
  if (!shouldRunDailyExpiryCheck()) {
    return [];
  }

  const warnings = checkReservationExpiry();
  markDailyExpiryCheckCompleted();

  // Log warnings for debugging
  if (warnings.length > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `[Expiry Check] Found ${warnings.length} reservation(s) expiring soon or expired`
    );
    warnings.forEach((w) => {
      // eslint-disable-next-line no-console
      console.log(`  - ${w.message} (Customer: ${w.inquiry.customerName})`);
    });
  }

  return warnings;
}

/**
 * Create alert HTML for expiry warnings
 */
export function createExpiryAlertHTML(warnings: ExpiryWarning[]): string {
  if (warnings.length === 0) return '';

  const expiredCount = warnings.filter((w) => w.isExpired).length;
  const expiringCount = warnings.length - expiredCount;

  let html = '<div class="expiry-warnings">';

  if (expiredCount > 0) {
    html += `
      <div class="alert alert-danger" role="alert" aria-live="assertive">
        <strong>⚠️ ${expiredCount} Reservation${expiredCount !== 1 ? 's' : ''} Expired!</strong>
        <ul class="mt-2 mb-0">
          ${warnings
            .filter((w) => w.isExpired)
            .map(
              (w) =>
                `<li>
                  <a href="/admin/inquiries.html?id=${w.inquiry.id}">
                    ${w.inquiry.propertyName} - ${w.inquiry.customerName}
                  </a>
                </li>`
            )
            .join('')}
        </ul>
      </div>
    `;
  }

  if (expiringCount > 0) {
    html += `
      <div class="alert alert-warning" role="alert" aria-live="polite">
        <strong>⏰ ${expiringCount} Reservation${expiringCount !== 1 ? 's' : ''} Expiring Soon!</strong>
        <ul class="mt-2 mb-0">
          ${warnings
            .filter((w) => !w.isExpired)
            .map(
              (w) =>
                `<li>
                  <a href="/admin/inquiries.html?id=${w.inquiry.id}">
                    ${w.inquiry.propertyName} - ${w.inquiry.customerName} 
                    (${w.daysRemaining} day${w.daysRemaining !== 1 ? 's' : ''} remaining)
                  </a>
                </li>`
            )
            .join('')}
        </ul>
      </div>
    `;
  }

  html += '</div>';
  return html;
}
