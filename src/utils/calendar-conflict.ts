/**
 * Calendar Conflict Detection
 * Issue 8: Check agent availability and prevent double-booking
 */

import type { CalendarEvent } from '../types';

const BUFFER_MINUTES = 30;

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Add minutes to a time string
 */
function addMinutesToTime(timeStr: string, minutes: number): string {
  const totalMinutes = parseTimeToMinutes(timeStr) + minutes;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Check if two time ranges overlap (including buffer)
 */
function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
  bufferMinutes: number = BUFFER_MINUTES
): boolean {
  // Add buffer to both ranges
  const start1Minutes = parseTimeToMinutes(start1) - bufferMinutes;
  const end1Minutes = parseTimeToMinutes(end1) + bufferMinutes;
  const start2Minutes = parseTimeToMinutes(start2) - bufferMinutes;
  const end2Minutes = parseTimeToMinutes(end2) + bufferMinutes;

  // Check for overlap
  return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
}

/**
 * Normalize date to YYYY-MM-DD format
 */
function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

/**
 * Check for calendar conflicts
 */
export function checkCalendarConflict(
  newEvent: {
    agentId: number;
    date: string;
    startTime: string;
    endTime: string;
  },
  existingEvents: CalendarEvent[],
  excludeEventId?: number
): { hasConflict: boolean; conflictingEvents: CalendarEvent[] } {
  const newDate = normalizeDate(newEvent.date);
  
  const conflictingEvents = existingEvents.filter((event) => {
    // Skip if this is the same event (for updates)
    if (excludeEventId && event.id === excludeEventId) {
      return false;
    }

    // Must be same agent
    if (event.agentId !== newEvent.agentId) {
      return false;
    }

    // Must be same date
    const eventDate = normalizeDate(event.date);
    if (eventDate !== newDate) {
      return false;
    }

    // Check for time overlap with buffer
    return timeRangesOverlap(
      newEvent.startTime,
      newEvent.endTime,
      event.startTime,
      event.endTime
    );
  });

  return {
    hasConflict: conflictingEvents.length > 0,
    conflictingEvents,
  };
}

/**
 * Get conflict details message
 */
export function getConflictMessage(conflictingEvents: CalendarEvent[]): string {
  if (conflictingEvents.length === 0) return '';

  const messages = conflictingEvents.map((event) => {
    const eventDate = new Date(event.date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return `- ${event.title} on ${eventDate} from ${event.startTime} to ${event.endTime}`;
  });

  return `This time slot conflicts with existing event(s) (including ${BUFFER_MINUTES}-minute buffer):\n${messages.join('\n')}`;
}

/**
 * Find available time slots for an agent on a specific date
 */
export function findAvailableTimeSlots(
  agentId: number,
  date: string,
  existingEvents: CalendarEvent[],
  slotDurationMinutes: number = 60
): Array<{ startTime: string; endTime: string }> {
  const normalizedDate = normalizeDate(date);
  
  // Get all events for this agent on this date
  const agentEvents = existingEvents
    .filter((event) => {
      return (
        event.agentId === agentId &&
        normalizeDate(event.date) === normalizedDate
      );
    })
    .sort((a, b) => {
      return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
    });

  const availableSlots: Array<{ startTime: string; endTime: string }> = [];
  
  // Business hours: 8 AM to 8 PM
  const dayStart = '08:00';
  const dayEnd = '20:00';
  let currentTime = dayStart;

  for (const event of agentEvents) {
    // Check if there's a gap before this event
    const eventStart = addMinutesToTime(event.startTime, -BUFFER_MINUTES);
    if (parseTimeToMinutes(currentTime) + slotDurationMinutes + BUFFER_MINUTES <= parseTimeToMinutes(eventStart)) {
      availableSlots.push({
        startTime: currentTime,
        endTime: addMinutesToTime(eventStart, -BUFFER_MINUTES),
      });
    }
    
    // Move current time to after this event (including buffer)
    currentTime = addMinutesToTime(event.endTime, BUFFER_MINUTES);
  }

  // Check if there's time remaining at the end of the day
  if (parseTimeToMinutes(currentTime) + slotDurationMinutes <= parseTimeToMinutes(dayEnd)) {
    availableSlots.push({
      startTime: currentTime,
      endTime: dayEnd,
    });
  }

  return availableSlots;
}

/**
 * Validate event time range
 */
export function validateEventTime(
  startTime: string,
  endTime: string
): { valid: boolean; error?: string } {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (endMinutes <= startMinutes) {
    return {
      valid: false,
      error: 'End time must be after start time',
    };
  }

  const duration = endMinutes - startMinutes;
  if (duration < 30) {
    return {
      valid: false,
      error: 'Event duration must be at least 30 minutes',
    };
  }

  if (duration > 480) {
    // 8 hours
    return {
      valid: false,
      error: 'Event duration cannot exceed 8 hours',
    };
  }

  return { valid: true };
}

/**
 * Get recommended time slots based on existing bookings
 */
export function getRecommendedTimeSlots(
  agentId: number,
  date: string,
  existingEvents: CalendarEvent[]
): Array<{ startTime: string; endTime: string; label: string }> {
  const availableSlots = findAvailableTimeSlots(agentId, date, existingEvents, 60);
  
  return availableSlots.slice(0, 5).map((slot) => ({
    ...slot,
    label: `${slot.startTime} - ${slot.endTime}`,
  }));
}

/**
 * Check if an agent is available at a specific time
 */
export function isAgentAvailable(
  agentId: number,
  date: string,
  startTime: string,
  endTime: string,
  existingEvents: CalendarEvent[]
): boolean {
  const conflict = checkCalendarConflict(
    { agentId, date, startTime, endTime },
    existingEvents
  );
  return !conflict.hasConflict;
}
