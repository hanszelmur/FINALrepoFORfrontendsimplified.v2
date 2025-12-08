/**
 * Migration Utilities
 * Helper functions to migrate data between old and new formats
 */

import type { Property, PropertyPhoto } from '../types';

/**
 * Convert old photo format (string[]) to new format (PropertyPhoto[])
 */
export function migratePhotosToNewFormat(photos: string[] | PropertyPhoto[]): PropertyPhoto[] {
  if (!photos || photos.length === 0) return [];

  // Check if already in new format
  if (typeof photos[0] === 'object' && 'data' in photos[0]) {
    return photos as PropertyPhoto[];
  }

  // Convert from old format (string[]) to new format
  return (photos as string[]).map((photoUrl, index) => ({
    data: photoUrl,
    caption: '',
    order: index,
  }));
}

/**
 * Ensure all properties have photos in new format
 */
export function migratePropertiesPhotos(properties: Property[]): Property[] {
  return properties.map((property) => ({
    ...property,
    photos: migratePhotosToNewFormat(property.photos as unknown as string[]),
  }));
}

/**
 * Run all migrations on stored data
 */
export function runMigrations(): void {
  try {
    // Check if migration is needed
    const propertiesData = localStorage.getItem('tes_properties');
    if (!propertiesData) return;

    const properties = JSON.parse(propertiesData) as Property[];
    
    // Check if migration needed (check first property)
    if (properties.length > 0 && properties[0].photos.length > 0) {
      const firstPhoto = properties[0].photos[0];
      // If it's a string, we need to migrate
      if (typeof firstPhoto === 'string') {
        // eslint-disable-next-line no-console
        console.log('[Migration] Converting photos to new format...');
        const migratedProperties = migratePropertiesPhotos(properties);
        localStorage.setItem('tes_properties', JSON.stringify(migratedProperties));
        // eslint-disable-next-line no-console
        console.log('[Migration] Photo format migration complete');
      }
    }
  } catch (error) {
    console.error('[Migration] Error during migration:', error);
  }
}
