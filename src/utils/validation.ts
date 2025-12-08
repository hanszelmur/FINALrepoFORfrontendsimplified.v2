import { getInquiries } from './storage';
import type { InquiryStatus, Inquiry } from '../types';

// Email validation
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Normalize phone number for comparison
 * Issue 5: Normalize phone numbers before duplicate detection
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Convert +63 to 0
  if (cleaned.startsWith('63')) {
    cleaned = '0' + cleaned.substring(2);
  }
  
  return cleaned;
}

// Philippine phone number validation
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = normalizePhoneNumber(phone);

  // Should be 11 digits starting with 09
  return cleaned.length === 11 && cleaned.startsWith('09');
}

// Price validation
export function validatePrice(price: number): boolean {
  return price >= 100000 && price <= 999999999;
}

// ZIP code validation (Philippine 4-digit)
export function validateZipCode(zip: string): boolean {
  return /^\d{4}$/.test(zip);
}

/**
 * Duplicate inquiry detection with enhanced phone matching
 * Issue 5: Check email OR phone against all active inquiries
 */
export function checkDuplicateInquiry(
  email: string,
  phone: string,
  propertyId: number
): { isDuplicate: boolean; existingInquiry?: Inquiry } {
  const inquiries = getInquiries();
  const activeStatuses: InquiryStatus[] = [
    'New',
    'Assigned',
    'In Progress',
    'Waiting - Property Reserved',
    'Viewing Scheduled',
    'Viewed - Interested',
    'Viewed - Undecided',
    'Deposit Paid',
  ];

  const normalizedPhone = normalizePhoneNumber(phone);
  const normalizedEmail = email.toLowerCase().trim();

  const existingInquiry = inquiries.find((inq) => {
    if (inq.propertyId !== propertyId) return false;
    if (!activeStatuses.includes(inq.status)) return false;

    const inquiryPhone = normalizePhoneNumber(inq.customerPhone);
    const inquiryEmail = inq.customerEmail.toLowerCase().trim();

    return inquiryEmail === normalizedEmail || inquiryPhone === normalizedPhone;
  });

  return {
    isDuplicate: !!existingInquiry,
    existingInquiry,
  };
}

/**
 * Get duplicate inquiry error message with details
 */
export function getDuplicateInquiryMessage(inquiry: Inquiry): string {
  const statusText = inquiry.status;
  const agentText = inquiry.assignedAgentName
    ? ` (Assigned to: ${inquiry.assignedAgentName})`
    : '';
  return `You already have an active inquiry for this property with status "${statusText}"${agentText}. Please contact us if you need to update your inquiry.`;
}

// Check if inquiry can be reassigned
export function canReassignInquiry(status: InquiryStatus): boolean {
  const restrictedStatuses: InquiryStatus[] = ['Deposit Paid', 'Successful'];
  return !restrictedStatuses.includes(status);
}

// Validate inquiry status transition
export function isValidStatusTransition(
  currentStatus: InquiryStatus,
  newStatus: InquiryStatus
): boolean {
  // Define valid transitions
  const validTransitions: Record<InquiryStatus, InquiryStatus[]> = {
    New: ['Assigned', 'Cancelled'],
    Assigned: ['In Progress', 'Cancelled'],
    'In Progress': ['Waiting - Property Reserved', 'Viewing Scheduled', 'Cancelled'],
    'Waiting - Property Reserved': ['Viewing Scheduled', 'Cancelled'],
    'Viewing Scheduled': [
      'Viewed - Interested',
      'Viewed - Not Interested',
      'Viewed - Undecided',
      'Cancelled',
    ],
    'Viewed - Interested': ['Deposit Paid', 'Cancelled'],
    'Viewed - Not Interested': ['Cancelled'],
    'Viewed - Undecided': ['Viewed - Interested', 'Viewed - Not Interested', 'Cancelled'],
    'Deposit Paid': ['Successful', 'Cancelled'],
    Successful: [],
    Cancelled: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}
