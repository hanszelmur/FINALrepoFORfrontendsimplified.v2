import { getInquiries } from './storage';
import type { InquiryStatus } from '../types';

// Email validation
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Philippine phone number validation
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');

  // Should be 11 digits starting with 09 or 12 digits starting with 63
  if (cleaned.length === 11 && cleaned.startsWith('09')) {
    return true;
  }
  if (cleaned.length === 12 && cleaned.startsWith('63')) {
    return true;
  }

  return false;
}

// Price validation
export function validatePrice(price: number): boolean {
  return price >= 100000 && price <= 999999999;
}

// ZIP code validation (Philippine 4-digit)
export function validateZipCode(zip: string): boolean {
  return /^\d{4}$/.test(zip);
}

// Duplicate inquiry detection
export function checkDuplicateInquiry(
  email: string,
  phone: string,
  propertyId: number
): boolean {
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

  return inquiries.some(
    (inq) =>
      (inq.customerEmail === email || inq.customerPhone === phone) &&
      inq.propertyId === propertyId &&
      activeStatuses.includes(inq.status)
  );
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
    'In Progress': [
      'Waiting - Property Reserved',
      'Viewing Scheduled',
      'Cancelled',
    ],
    'Waiting - Property Reserved': ['Viewing Scheduled', 'Cancelled'],
    'Viewing Scheduled': [
      'Viewed - Interested',
      'Viewed - Not Interested',
      'Viewed - Undecided',
      'Cancelled',
    ],
    'Viewed - Interested': ['Deposit Paid', 'Cancelled'],
    'Viewed - Not Interested': ['Cancelled'],
    'Viewed - Undecided': [
      'Viewed - Interested',
      'Viewed - Not Interested',
      'Cancelled',
    ],
    'Deposit Paid': ['Successful', 'Cancelled'],
    Successful: [],
    Cancelled: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}
