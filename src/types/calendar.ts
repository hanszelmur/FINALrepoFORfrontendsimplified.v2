export type EventType = 'viewing' | 'unavailable';
export type EventStatus = 'confirmed' | 'tentative' | 'unavailable';

export interface CalendarEvent {
  id: number;
  title: string;
  type: EventType;
  status: EventStatus;
  propertyId: number | null;
  propertyName: string | null;
  inquiryId: number | null;
  agentId: number;
  agentName: string;
  customerName: string | null;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  createdAt: string;
}
