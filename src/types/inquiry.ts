export type InquiryStatus =
  | 'New'
  | 'Assigned'
  | 'In Progress'
  | 'Waiting - Property Reserved'
  | 'Viewing Scheduled'
  | 'Viewed - Interested'
  | 'Viewed - Not Interested'
  | 'Viewed - Undecided'
  | 'Deposit Paid'
  | 'Successful'
  | 'Cancelled';

export interface Inquiry {
  id: number;
  propertyId: number;
  propertyName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  message: string;
  status: InquiryStatus;
  assignedAgentId: number | null;
  assignedAgentName: string | null;
  viewingDate: string | null;
  depositAmount: number | null;
  reservationExpiryDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
