/**
 * Storage Utilities with Error Handling
 * Issue 7: All localStorage operations wrapped in try-catch
 * Issue 14: TODO - Add optimistic locking for multi-admin support
 * 
 * **Breaking Change from v1**: All write operations now return boolean success indicators
 * - Old: `addProperty(property)` - returns void
 * - New: `const success = addProperty(property)` - returns boolean
 * 
 * This allows callers to handle storage errors appropriately without try-catch
 */

import type { Property, Inquiry, User, CalendarEvent } from '../types';
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove, logError } from './error-handler';

const STORAGE_KEYS = {
  PROPERTIES: 'tes_properties',
  INQUIRIES: 'tes_inquiries',
  USERS: 'tes_users',
  CALENDAR: 'tes_calendar',
  CURRENT_USER: 'tes_current_user',
  INITIALIZED: 'tes_initialized',
};

/**
 * TODO [Issue 14 - Race Conditions]:
 * When multiple admins are supported in the future, implement optimistic locking:
 * 1. Add 'version' field to all entities
 * 2. Increment version on each update
 * 3. Check version before saving (if mismatch, show conflict resolution UI)
 * 4. Example: if (entity.version !== currentVersion) throw new ConflictError()
 * 
 * Current limitation: Last write wins. Race conditions possible with multiple admins.
 */

// Properties
export function getProperties(): Property[] {
  return safeLocalStorageGet<Property[]>(STORAGE_KEYS.PROPERTIES, []);
}

export function saveProperties(properties: Property[]): boolean {
  return safeLocalStorageSet(STORAGE_KEYS.PROPERTIES, properties);
}

export function getPropertyById(id: number): Property | undefined {
  try {
    const properties = getProperties();
    return properties.find((p) => p.id === id);
  } catch (error) {
    logError('getPropertyById', error);
    return undefined;
  }
}

export function addProperty(property: Property): boolean {
  try {
    const properties = getProperties();
    properties.push(property);
    return saveProperties(properties);
  } catch (error) {
    logError('addProperty', error);
    return false;
  }
}

export function updateProperty(id: number, updates: Partial<Property>): boolean {
  try {
    const properties = getProperties();
    const index = properties.findIndex((p) => p.id === id);
    if (index !== -1) {
      properties[index] = { ...properties[index], ...updates };
      return saveProperties(properties);
    }
    return false;
  } catch (error) {
    logError('updateProperty', error);
    return false;
  }
}

export function deleteProperty(id: number): boolean {
  try {
    const properties = getProperties();
    const filtered = properties.filter((p) => p.id !== id);
    return saveProperties(filtered);
  } catch (error) {
    logError('deleteProperty', error);
    return false;
  }
}

// Inquiries
export function getInquiries(): Inquiry[] {
  return safeLocalStorageGet<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
}

export function saveInquiries(inquiries: Inquiry[]): boolean {
  return safeLocalStorageSet(STORAGE_KEYS.INQUIRIES, inquiries);
}

export function getInquiryById(id: number): Inquiry | undefined {
  try {
    const inquiries = getInquiries();
    return inquiries.find((i) => i.id === id);
  } catch (error) {
    logError('getInquiryById', error);
    return undefined;
  }
}

export function addInquiry(inquiry: Inquiry): boolean {
  try {
    const inquiries = getInquiries();
    inquiries.push(inquiry);
    return saveInquiries(inquiries);
  } catch (error) {
    logError('addInquiry', error);
    return false;
  }
}

export function updateInquiry(id: number, updates: Partial<Inquiry>): boolean {
  try {
    const inquiries = getInquiries();
    const index = inquiries.findIndex((i) => i.id === id);
    if (index !== -1) {
      inquiries[index] = { ...inquiries[index], ...updates, updatedAt: new Date().toISOString() };
      return saveInquiries(inquiries);
    }
    return false;
  } catch (error) {
    logError('updateInquiry', error);
    return false;
  }
}

export function deleteInquiry(id: number): boolean {
  try {
    const inquiries = getInquiries();
    const filtered = inquiries.filter((i) => i.id !== id);
    return saveInquiries(filtered);
  } catch (error) {
    logError('deleteInquiry', error);
    return false;
  }
}

// Users
export function getUsers(): User[] {
  return safeLocalStorageGet<User[]>(STORAGE_KEYS.USERS, []);
}

export function saveUsers(users: User[]): boolean {
  return safeLocalStorageSet(STORAGE_KEYS.USERS, users);
}

export function getUserById(id: number): User | undefined {
  try {
    const users = getUsers();
    return users.find((u) => u.id === id);
  } catch (error) {
    logError('getUserById', error);
    return undefined;
  }
}

export function getUserByEmail(email: string): User | undefined {
  try {
    const users = getUsers();
    return users.find((u) => u.email === email);
  } catch (error) {
    logError('getUserByEmail', error);
    return undefined;
  }
}

// Calendar
export function getCalendarEvents(): CalendarEvent[] {
  return safeLocalStorageGet<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, []);
}

export function saveCalendarEvents(events: CalendarEvent[]): boolean {
  return safeLocalStorageSet(STORAGE_KEYS.CALENDAR, events);
}

export function addCalendarEvent(event: CalendarEvent): boolean {
  try {
    const events = getCalendarEvents();
    events.push(event);
    return saveCalendarEvents(events);
  } catch (error) {
    logError('addCalendarEvent', error);
    return false;
  }
}

export function updateCalendarEvent(id: number, updates: Partial<CalendarEvent>): boolean {
  try {
    const events = getCalendarEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updates };
      return saveCalendarEvents(events);
    }
    return false;
  } catch (error) {
    logError('updateCalendarEvent', error);
    return false;
  }
}

export function deleteCalendarEvent(id: number): boolean {
  try {
    const events = getCalendarEvents();
    const filtered = events.filter((e) => e.id !== id);
    return saveCalendarEvents(filtered);
  } catch (error) {
    logError('deleteCalendarEvent', error);
    return false;
  }
}

// Current User
export function getCurrentUser(): User | null {
  return safeLocalStorageGet<User | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: User | null): boolean {
  try {
    if (user) {
      return safeLocalStorageSet(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      return safeLocalStorageRemove(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (error) {
    logError('setCurrentUser', error);
    return false;
  }
}

// Initialization flag
export function isInitialized(): boolean {
  try {
    return safeLocalStorageGet<string>(STORAGE_KEYS.INITIALIZED, 'false') === 'true';
  } catch (error) {
    logError('isInitialized', error);
    return false;
  }
}

export function setInitialized(value: boolean): boolean {
  return safeLocalStorageSet(STORAGE_KEYS.INITIALIZED, value.toString());
}

// Clear all data
export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      safeLocalStorageRemove(key);
    });
  } catch (error) {
    logError('clearAllData', error);
  }
}
