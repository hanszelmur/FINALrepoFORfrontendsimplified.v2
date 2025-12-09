/**
 * Search Functionality (Feature 1)
 * Search properties by name, address, price range with instant results
 */

import type { Property } from '../types';

export interface SearchCriteria {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  status?: string;
  city?: string;
  province?: string;
}

export interface SearchResult {
  properties: Property[];
  count: number;
  criteria: SearchCriteria;
}

/**
 * Search properties with multiple criteria
 */
export function searchProperties(
  properties: Property[],
  criteria: SearchCriteria
): SearchResult {
  let results = [...properties];

  // Text search (name, address)
  if (criteria.query && criteria.query.trim()) {
    const query = criteria.query.toLowerCase().trim();
    results = results.filter((property) => {
      const searchableText = [
        property.name,
        property.address.street,
        property.address.barangay,
        property.address.city,
        property.address.province,
        property.description,
        ...property.features,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }

  // Price range filter
  if (criteria.minPrice !== undefined) {
    results = results.filter((property) => property.price >= criteria.minPrice!);
  }
  if (criteria.maxPrice !== undefined) {
    results = results.filter((property) => property.price <= criteria.maxPrice!);
  }

  // Property type filter
  if (criteria.type) {
    results = results.filter((property) => property.type === criteria.type);
  }

  // Status filter
  if (criteria.status) {
    results = results.filter((property) => property.status === criteria.status);
  }

  // City filter
  if (criteria.city) {
    results = results.filter(
      (property) => property.address.city.toLowerCase() === criteria.city!.toLowerCase()
    );
  }

  // Province filter
  if (criteria.province) {
    results = results.filter(
      (property) =>
        property.address.province.toLowerCase() === criteria.province!.toLowerCase()
    );
  }

  return {
    properties: results,
    count: results.length,
    criteria,
  };
}

/**
 * Get unique cities from properties
 */
export function getUniqueCities(properties: Property[]): string[] {
  const cities = new Set(properties.map((p) => p.address.city));
  return Array.from(cities).sort();
}

/**
 * Get unique provinces from properties
 */
export function getUniqueProvinces(properties: Property[]): string[] {
  const provinces = new Set(properties.map((p) => p.address.province));
  return Array.from(provinces).sort();
}

/**
 * Get price range from properties
 */
export function getPriceRange(properties: Property[]): { min: number; max: number } {
  if (properties.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = properties.map((p) => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

/**
 * Format search summary
 */
export function formatSearchSummary(result: SearchResult): string {
  const { count, criteria } = result;
  const parts: string[] = [];

  if (criteria.query) {
    parts.push(`matching "${criteria.query}"`);
  }
  if (criteria.minPrice || criteria.maxPrice) {
    const minStr = criteria.minPrice ? `₱${criteria.minPrice.toLocaleString()}` : 'any';
    const maxStr = criteria.maxPrice ? `₱${criteria.maxPrice.toLocaleString()}` : 'any';
    parts.push(`price ${minStr} - ${maxStr}`);
  }
  if (criteria.type) {
    parts.push(`type: ${criteria.type}`);
  }
  if (criteria.status) {
    parts.push(`status: ${criteria.status}`);
  }
  if (criteria.city) {
    parts.push(`in ${criteria.city}`);
  }

  const summary = parts.length > 0 ? ` (${parts.join(', ')})` : '';
  return `Found ${count} ${count === 1 ? 'property' : 'properties'}${summary}`;
}

/**
 * Save search to history (Feature 7 - Search History)
 */
export function saveSearchHistory(criteria: SearchCriteria, resultCount: number): void {
  try {
    const history = getSearchHistory();
    const entry = {
      criteria,
      resultCount,
      timestamp: new Date().toISOString(),
    };

    history.unshift(entry);

    // Keep only last 100 searches
    if (history.length > 100) {
      history.splice(100);
    }

    localStorage.setItem('tes_search_history', JSON.stringify(history));
  } catch (error) {
    console.error('[Search History] Failed to save:', error);
  }
}

/**
 * Get search history
 */
export function getSearchHistory(): Array<{
  criteria: SearchCriteria;
  resultCount: number;
  timestamp: string;
}> {
  try {
    const data = localStorage.getItem('tes_search_history');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[Search History] Failed to load:', error);
    return [];
  }
}

/**
 * Get popular search terms (Feature 7)
 */
export function getPopularSearchTerms(limit: number = 10): Array<{
  term: string;
  count: number;
}> {
  const history = getSearchHistory();
  const termCounts: Record<string, number> = {};

  history.forEach((entry) => {
    if (entry.criteria.query) {
      const term = entry.criteria.query.toLowerCase();
      termCounts[term] = (termCounts[term] || 0) + 1;
    }
  });

  return Object.entries(termCounts)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Clear search history
 */
export function clearSearchHistory(): void {
  try {
    localStorage.removeItem('tes_search_history');
  } catch (error) {
    console.error('[Search History] Failed to clear:', error);
  }
}
