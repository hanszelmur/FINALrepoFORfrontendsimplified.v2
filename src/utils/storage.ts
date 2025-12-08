import type { Property, Inquiry, User, CalendarEvent } from '../types';

const STORAGE_KEYS = {
  PROPERTIES: 'tes_properties',
  INQUIRIES: 'tes_inquiries',
  USERS: 'tes_users',
  CALENDAR: 'tes_calendar',
  CURRENT_USER: 'tes_current_user',
  INITIALIZED: 'tes_initialized',
};

// Properties
export function getProperties(): Property[] {
  const data = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
  return data ? JSON.parse(data) : [];
}

export function saveProperties(properties: Property[]): void {
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
}

export function getPropertyById(id: number): Property | undefined {
  const properties = getProperties();
  return properties.find((p) => p.id === id);
}

export function addProperty(property: Property): void {
  const properties = getProperties();
  properties.push(property);
  saveProperties(properties);
}

export function updateProperty(id: number, updates: Partial<Property>): void {
  const properties = getProperties();
  const index = properties.findIndex((p) => p.id === id);
  if (index !== -1) {
    properties[index] = { ...properties[index], ...updates };
    saveProperties(properties);
  }
}

export function deleteProperty(id: number): void {
  const properties = getProperties();
  const filtered = properties.filter((p) => p.id !== id);
  saveProperties(filtered);
}

// Inquiries
export function getInquiries(): Inquiry[] {
  const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
  return data ? JSON.parse(data) : [];
}

export function saveInquiries(inquiries: Inquiry[]): void {
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
}

export function getInquiryById(id: number): Inquiry | undefined {
  const inquiries = getInquiries();
  return inquiries.find((i) => i.id === id);
}

export function addInquiry(inquiry: Inquiry): void {
  const inquiries = getInquiries();
  inquiries.push(inquiry);
  saveInquiries(inquiries);
}

export function updateInquiry(id: number, updates: Partial<Inquiry>): void {
  const inquiries = getInquiries();
  const index = inquiries.findIndex((i) => i.id === id);
  if (index !== -1) {
    inquiries[index] = { ...inquiries[index], ...updates, updatedAt: new Date().toISOString() };
    saveInquiries(inquiries);
  }
}

export function deleteInquiry(id: number): void {
  const inquiries = getInquiries();
  const filtered = inquiries.filter((i) => i.id !== id);
  saveInquiries(filtered);
}

// Users
export function getUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getUserById(id: number): User | undefined {
  const users = getUsers();
  return users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email === email);
}

// Calendar
export function getCalendarEvents(): CalendarEvent[] {
  const data = localStorage.getItem(STORAGE_KEYS.CALENDAR);
  return data ? JSON.parse(data) : [];
}

export function saveCalendarEvents(events: CalendarEvent[]): void {
  localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(events));
}

export function addCalendarEvent(event: CalendarEvent): void {
  const events = getCalendarEvents();
  events.push(event);
  saveCalendarEvents(events);
}

export function updateCalendarEvent(id: number, updates: Partial<CalendarEvent>): void {
  const events = getCalendarEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    saveCalendarEvents(events);
  }
}

export function deleteCalendarEvent(id: number): void {
  const events = getCalendarEvents();
  const filtered = events.filter((e) => e.id !== id);
  saveCalendarEvents(filtered);
}

// Current User
export function getCurrentUser(): User | null {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

// Initialization flag
export function isInitialized(): boolean {
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
}

export function setInitialized(value: boolean): void {
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, value.toString());
}

// Clear all data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
