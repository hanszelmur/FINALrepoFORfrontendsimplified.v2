/**
 * API Client for communicating with backend server
 * Replaces direct localStorage access with server API calls
 */

import type { Property, Inquiry, User, CalendarEvent } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Properties API
export const propertiesAPI = {
  getAll: async (): Promise<Property[]> => {
    return apiRequest<Property[]>('/properties');
  },

  getById: async (id: number): Promise<Property> => {
    return apiRequest<Property>(`/properties/${id}`);
  },

  create: async (property: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
    return apiRequest<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  },

  update: async (id: number, updates: Partial<Property>): Promise<Property> => {
    return apiRequest<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/properties/${id}`, {
      method: 'DELETE',
    });
  },

  search: async (params: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    type?: string;
    status?: string;
  }): Promise<Property[]> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return apiRequest<Property[]>(`/properties/search?${searchParams.toString()}`);
  },
};

// Inquiries API
export const inquiriesAPI = {
  getAll: async (): Promise<Inquiry[]> => {
    return apiRequest<Inquiry[]>('/inquiries');
  },

  getById: async (id: number): Promise<Inquiry> => {
    return apiRequest<Inquiry>(`/inquiries/${id}`);
  },

  create: async (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Inquiry> => {
    return apiRequest<Inquiry>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiry),
    });
  },

  update: async (id: number, updates: Partial<Inquiry>): Promise<Inquiry> => {
    return apiRequest<Inquiry>(`/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  bulkUpdate: async (ids: number[], updates: Partial<Inquiry>): Promise<{ success: boolean; updatedCount: number }> => {
    return apiRequest<{ success: boolean; updatedCount: number }>('/inquiries/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ ids, updates }),
    });
  },
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<User[]> => {
    return apiRequest<User[]>('/users');
  },

  login: async (email: string, password: string): Promise<User> => {
    return apiRequest<User>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Calendar API
export const calendarAPI = {
  getAll: async (): Promise<CalendarEvent[]> => {
    return apiRequest<CalendarEvent[]>('/calendar');
  },

  create: async (event: Omit<CalendarEvent, 'id' | 'createdAt'>): Promise<CalendarEvent> => {
    return apiRequest<CalendarEvent>('/calendar', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  update: async (id: number, updates: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    return apiRequest<CalendarEvent>(`/calendar/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/calendar/${id}`, {
      method: 'DELETE',
    });
  },
};

// Activity Log API
export const activityLogAPI = {
  getAll: async (): Promise<Array<{
    timestamp: string;
    action: string;
    section: string;
    note: string;
    details: Record<string, unknown>;
  }>> => {
    return apiRequest('/activity-log');
  },
};

// Stats API
export const statsAPI = {
  getNewPropertiesCount: async (): Promise<{ count: number }> => {
    return apiRequest<{ count: number }>('/new-properties/count');
  },

  getNewInquiriesCount: async (): Promise<{ count: number }> => {
    return apiRequest<{ count: number }>('/new-inquiries/count');
  },
};

// Health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  return apiRequest<{ status: string; timestamp: string }>('/health');
};

/**
 * Check if API server is available
 * Falls back to localStorage if server is not available
 */
export async function isAPIAvailable(): Promise<boolean> {
  try {
    await healthCheck();
    return true;
  } catch {
    return false;
  }
}
