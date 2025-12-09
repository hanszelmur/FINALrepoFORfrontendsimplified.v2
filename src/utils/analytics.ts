/**
 * Property Analytics (Feature 6)
 * Track most viewed properties, conversion rates, and trend charts
 */

import type { Property, Inquiry } from '../types';

export interface PropertyView {
  propertyId: number;
  timestamp: string;
  source: 'list' | 'details' | 'search';
}

export interface PropertyAnalytics {
  propertyId: number;
  propertyName: string;
  views: number;
  inquiries: number;
  conversionRate: number;
  lastViewed: string | null;
}

export interface SystemAnalytics {
  totalProperties: number;
  totalInquiries: number;
  totalViews: number;
  overallConversionRate: number;
  topProperties: PropertyAnalytics[];
  recentTrends: {
    period: string;
    views: number;
    inquiries: number;
  }[];
}

const STORAGE_KEY = 'tes_property_views';

/**
 * Track property view
 */
export function trackPropertyView(
  propertyId: number,
  source: PropertyView['source'] = 'details'
): void {
  try {
    const views = getPropertyViews();
    views.push({
      propertyId,
      timestamp: new Date().toISOString(),
      source,
    });

    // Keep only last 1000 views to prevent storage bloat
    if (views.length > 1000) {
      views.splice(0, views.length - 1000);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
  } catch (error) {
    console.error('[Analytics] Failed to track property view:', error);
  }
}

/**
 * Get all property views
 */
export function getPropertyViews(): PropertyView[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[Analytics] Failed to get property views:', error);
    return [];
  }
}

/**
 * Get analytics for a specific property
 */
export function getPropertyAnalytics(
  propertyId: number,
  propertyName: string,
  inquiries: Inquiry[]
): PropertyAnalytics {
  const views = getPropertyViews().filter((v) => v.propertyId === propertyId);
  const propertyInquiries = inquiries.filter((i) => i.propertyId === propertyId);

  const sortedViews = views.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return {
    propertyId,
    propertyName,
    views: views.length,
    inquiries: propertyInquiries.length,
    conversionRate: views.length > 0 ? (propertyInquiries.length / views.length) * 100 : 0,
    lastViewed: sortedViews.length > 0 ? sortedViews[0].timestamp : null,
  };
}

/**
 * Get top viewed properties
 */
export function getTopViewedProperties(
  properties: Property[],
  inquiries: Inquiry[],
  limit: number = 10
): PropertyAnalytics[] {
  const analytics = properties.map((property) =>
    getPropertyAnalytics(property.id, property.name, inquiries)
  );

  return analytics.sort((a, b) => b.views - a.views).slice(0, limit);
}

/**
 * Get properties with highest conversion rates
 */
export function getTopConvertingProperties(
  properties: Property[],
  inquiries: Inquiry[],
  minViews: number = 5,
  limit: number = 10
): PropertyAnalytics[] {
  const analytics = properties.map((property) =>
    getPropertyAnalytics(property.id, property.name, inquiries)
  );

  return analytics
    .filter((a) => a.views >= minViews)
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, limit);
}

/**
 * Get system-wide analytics
 */
export function getSystemAnalytics(
  properties: Property[],
  inquiries: Inquiry[]
): SystemAnalytics {
  const views = getPropertyViews();
  const topProperties = getTopViewedProperties(properties, inquiries, 5);

  // Calculate conversion rate
  const uniquePropertyViews = new Set(views.map((v) => v.propertyId)).size;
  const propertiesWithInquiries = new Set(inquiries.map((i) => i.propertyId)).size;
  const overallConversionRate =
    uniquePropertyViews > 0 ? (propertiesWithInquiries / uniquePropertyViews) * 100 : 0;

  // Get trends (last 7 days)
  const trends = get7DayTrends(views, inquiries);

  return {
    totalProperties: properties.length,
    totalInquiries: inquiries.length,
    totalViews: views.length,
    overallConversionRate,
    topProperties,
    recentTrends: trends,
  };
}

/**
 * Get 7-day trends
 */
function get7DayTrends(
  views: PropertyView[],
  inquiries: Inquiry[]
): SystemAnalytics['recentTrends'] {
  const today = new Date();
  const trends: SystemAnalytics['recentTrends'] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayViews = views.filter((v) => {
      const viewDate = new Date(v.timestamp);
      return viewDate >= date && viewDate < nextDate;
    });

    const dayInquiries = inquiries.filter((inq) => {
      const inquiryDate = new Date(inq.createdAt);
      return inquiryDate >= date && inquiryDate < nextDate;
    });

    trends.push({
      period: date.toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
      }),
      views: dayViews.length,
      inquiries: dayInquiries.length,
    });
  }

  return trends;
}

/**
 * Clear analytics data
 */
export function clearAnalytics(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[Analytics] Failed to clear analytics:', error);
  }
}

/**
 * Export analytics to CSV
 */
export function exportAnalyticsToCSV(analytics: PropertyAnalytics[]): void {
  const headers = ['Property Name', 'Views', 'Inquiries', 'Conversion Rate (%)', 'Last Viewed'];
  const rows = analytics.map((a) => [
    a.propertyName,
    a.views.toString(),
    a.inquiries.toString(),
    a.conversionRate.toFixed(2),
    a.lastViewed
      ? new Date(a.lastViewed).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })
      : 'Never',
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `property-analytics-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
