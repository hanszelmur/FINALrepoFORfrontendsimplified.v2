/**
 * Bulk Operations (Feature 2)
 * Select multiple inquiries and perform bulk actions
 */

import type { Inquiry, InquiryStatus } from '../types';
import { updateInquiry, saveInquiries } from './storage';

export interface BulkUpdateResult {
  success: boolean;
  updatedCount: number;
  failedCount: number;
  errors: string[];
}

/**
 * Bulk update inquiry status
 */
export function bulkUpdateStatus(
  inquiryIds: number[],
  newStatus: InquiryStatus,
  inquiries: Inquiry[]
): BulkUpdateResult {
  const result: BulkUpdateResult = {
    success: true,
    updatedCount: 0,
    failedCount: 0,
    errors: [],
  };

  inquiryIds.forEach((id) => {
    try {
      const updated = updateInquiry(id, { status: newStatus });
      if (updated) {
        result.updatedCount++;
      } else {
        result.failedCount++;
        result.errors.push(`Failed to update inquiry ${id}`);
      }
    } catch (error) {
      result.failedCount++;
      result.errors.push(`Error updating inquiry ${id}: ${error}`);
    }
  });

  result.success = result.failedCount === 0;
  return result;
}

/**
 * Bulk assign inquiries to agent
 */
export function bulkAssignAgent(
  inquiryIds: number[],
  agentId: number,
  agentName: string,
  inquiries: Inquiry[]
): BulkUpdateResult {
  const result: BulkUpdateResult = {
    success: true,
    updatedCount: 0,
    failedCount: 0,
    errors: [],
  };

  inquiryIds.forEach((id) => {
    const inquiry = inquiries.find((i) => i.id === id);
    
    if (!inquiry) {
      result.failedCount++;
      result.errors.push(`Inquiry ${id} not found`);
      return;
    }

    // Can't reassign Deposit Paid or Successful inquiries
    if (inquiry.status === 'Deposit Paid' || inquiry.status === 'Successful') {
      result.failedCount++;
      result.errors.push(
        `Cannot reassign inquiry ${id} (status: ${inquiry.status})`
      );
      return;
    }

    try {
      const updated = updateInquiry(id, {
        assignedAgentId: agentId,
        assignedAgentName: agentName,
        status: inquiry.status === 'New' ? 'Assigned' : inquiry.status,
      });
      
      if (updated) {
        result.updatedCount++;
      } else {
        result.failedCount++;
        result.errors.push(`Failed to assign inquiry ${id}`);
      }
    } catch (error) {
      result.failedCount++;
      result.errors.push(`Error assigning inquiry ${id}: ${error}`);
    }
  });

  result.success = result.failedCount === 0;
  return result;
}

/**
 * Bulk cancel inquiries
 */
export function bulkCancelInquiries(
  inquiryIds: number[],
  reason: string,
  inquiries: Inquiry[]
): BulkUpdateResult {
  const result: BulkUpdateResult = {
    success: true,
    updatedCount: 0,
    failedCount: 0,
    errors: [],
  };

  inquiryIds.forEach((id) => {
    const inquiry = inquiries.find((i) => i.id === id);
    
    if (!inquiry) {
      result.failedCount++;
      result.errors.push(`Inquiry ${id} not found`);
      return;
    }

    // Can't cancel Successful inquiries
    if (inquiry.status === 'Successful') {
      result.failedCount++;
      result.errors.push(`Cannot cancel successful inquiry ${id}`);
      return;
    }

    try {
      const notes = inquiry.notes
        ? `${inquiry.notes}\n\nBulk cancelled: ${reason}`
        : `Bulk cancelled: ${reason}`;
      
      const updated = updateInquiry(id, {
        status: 'Cancelled',
        notes,
      });
      
      if (updated) {
        result.updatedCount++;
      } else {
        result.failedCount++;
        result.errors.push(`Failed to cancel inquiry ${id}`);
      }
    } catch (error) {
      result.failedCount++;
      result.errors.push(`Error cancelling inquiry ${id}: ${error}`);
    }
  });

  result.success = result.failedCount === 0;
  return result;
}

/**
 * Bulk add notes to inquiries
 */
export function bulkAddNotes(
  inquiryIds: number[],
  note: string,
  inquiries: Inquiry[]
): BulkUpdateResult {
  const result: BulkUpdateResult = {
    success: true,
    updatedCount: 0,
    failedCount: 0,
    errors: [],
  };

  inquiryIds.forEach((id) => {
    const inquiry = inquiries.find((i) => i.id === id);
    
    if (!inquiry) {
      result.failedCount++;
      result.errors.push(`Inquiry ${id} not found`);
      return;
    }

    try {
      const timestamp = new Date().toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
      });
      const notes = inquiry.notes
        ? `${inquiry.notes}\n\n[${timestamp}] ${note}`
        : `[${timestamp}] ${note}`;
      
      const updated = updateInquiry(id, { notes });
      
      if (updated) {
        result.updatedCount++;
      } else {
        result.failedCount++;
        result.errors.push(`Failed to add note to inquiry ${id}`);
      }
    } catch (error) {
      result.failedCount++;
      result.errors.push(`Error adding note to inquiry ${id}: ${error}`);
    }
  });

  result.success = result.failedCount === 0;
  return result;
}

/**
 * Validate bulk operation is allowed
 */
export function validateBulkOperation(
  operation: 'assign' | 'cancel' | 'status' | 'notes',
  inquiryIds: number[],
  inquiries: Inquiry[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (inquiryIds.length === 0) {
    errors.push('No inquiries selected');
  }

  if (inquiryIds.length > 50) {
    errors.push('Cannot perform bulk operation on more than 50 inquiries at once');
  }

  inquiryIds.forEach((id) => {
    const inquiry = inquiries.find((i) => i.id === id);
    if (!inquiry) {
      errors.push(`Inquiry ${id} not found`);
    }
  });

  if (operation === 'assign') {
    const protectedInquiries = inquiries.filter(
      (i) =>
        inquiryIds.includes(i.id) &&
        (i.status === 'Deposit Paid' || i.status === 'Successful')
    );
    if (protectedInquiries.length > 0) {
      errors.push(
        `Cannot reassign ${protectedInquiries.length} inquiries with status Deposit Paid or Successful`
      );
    }
  }

  if (operation === 'cancel') {
    const successfulInquiries = inquiries.filter(
      (i) => inquiryIds.includes(i.id) && i.status === 'Successful'
    );
    if (successfulInquiries.length > 0) {
      errors.push(`Cannot cancel ${successfulInquiries.length} successful inquiries`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format bulk operation result message
 */
export function formatBulkResult(result: BulkUpdateResult, operation: string): string {
  if (result.success) {
    return `✓ Successfully ${operation} ${result.updatedCount} ${result.updatedCount === 1 ? 'inquiry' : 'inquiries'}`;
  }

  let message = `Partially completed: ${result.updatedCount} succeeded, ${result.failedCount} failed`;
  if (result.errors.length > 0) {
    message += '\n\nErrors:\n' + result.errors.slice(0, 5).join('\n');
    if (result.errors.length > 5) {
      message += `\n... and ${result.errors.length - 5} more errors`;
    }
  }
  return message;
}
