/**
 * Import CSV (Feature 4)
 * Upload CSV file with properties, validate, preview, and import
 * Uses PapaParse library for CSV parsing
 */

import type { Property, PropertyPhoto } from '../types';

// Note: PapaParse will be imported dynamically
let Papa: any = null;

/**
 * Lazy load PapaParse
 */
async function loadPapaParse() {
  if (!Papa) {
    const module = await import('papaparse');
    Papa = module.default || module;
  }
  return Papa;
}

export interface CSVImportResult {
  success: boolean;
  validProperties: Property[];
  invalidRows: Array<{
    row: number;
    data: any;
    errors: string[];
  }>;
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
}

export interface CSVPropertyRow {
  name: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  zip: string;
  price: string | number;
  status: string;
  type: string;
  description: string;
  features: string; // Pipe-separated
  reservationFee: string | number;
  commission: string | number;
  photoUrls?: string; // Pipe-separated URLs
}

/**
 * Expected CSV columns
 */
export const CSV_COLUMNS = [
  'name',
  'street',
  'barangay',
  'city',
  'province',
  'zip',
  'price',
  'status',
  'type',
  'description',
  'features',
  'reservationFee',
  'commission',
  'photoUrls',
];

/**
 * Generate CSV template
 */
export function generateCSVTemplate(): string {
  const headers = CSV_COLUMNS.join(',');
  const exampleRow = [
    'Sunset Villa',
    '123 Sunset Boulevard',
    'Poblacion',
    'Makati',
    'Metro Manila',
    '1200',
    '3500000',
    'Available',
    'House',
    'Beautiful 3-bedroom house with modern amenities',
    '3 Bedrooms|2 Bathrooms|Garage|Garden|150 sqm',
    '100000',
    '70000',
    'https://example.com/photo1.jpg|https://example.com/photo2.jpg',
  ].join(',');

  return `${headers}\n${exampleRow}`;
}

/**
 * Download CSV template
 */
export function downloadCSVTemplate(): void {
  const template = generateCSVTemplate();
  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'property-import-template.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Validate property row
 */
function validatePropertyRow(row: CSVPropertyRow): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!row.name || !row.name.trim()) {
    errors.push('Name is required');
  }
  if (!row.street || !row.street.trim()) {
    errors.push('Street address is required');
  }
  if (!row.barangay || !row.barangay.trim()) {
    errors.push('Barangay is required');
  }
  if (!row.city || !row.city.trim()) {
    errors.push('City is required');
  }
  if (!row.province || !row.province.trim()) {
    errors.push('Province is required');
  }
  if (!row.zip || !String(row.zip).trim()) {
    errors.push('ZIP code is required');
  } else if (!/^\d{4}$/.test(String(row.zip))) {
    errors.push('ZIP code must be 4 digits');
  }

  // Price validation
  const price = Number(row.price);
  if (isNaN(price) || price <= 0) {
    errors.push('Price must be a positive number');
  } else if (price < 100000 || price > 999000000) {
    errors.push('Price must be between ₱100,000 and ₱999,000,000');
  }

  // Status validation
  const validStatuses = ['Available', 'Reserved', 'Pending', 'Sold', 'Withdrawn'];
  if (!validStatuses.includes(row.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  // Type validation
  const validTypes = ['House', 'Condo', 'Townhouse', 'Lot', 'Commercial'];
  if (!validTypes.includes(row.type)) {
    errors.push(`Type must be one of: ${validTypes.join(', ')}`);
  }

  // Description
  if (!row.description || row.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  // Features
  if (!row.features || !row.features.trim()) {
    errors.push('At least one feature is required');
  }

  // Reservation fee
  const reservationFee = Number(row.reservationFee);
  if (isNaN(reservationFee) || reservationFee < 0) {
    errors.push('Reservation fee must be a non-negative number');
  }

  // Commission
  const commission = Number(row.commission);
  if (isNaN(commission) || commission < 0) {
    errors.push('Commission must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Convert CSV row to Property object
 */
function rowToProperty(row: CSVPropertyRow, id: number): Property {
  // Parse features (pipe-separated)
  const features = row.features
    .split('|')
    .map((f) => f.trim())
    .filter((f) => f.length > 0);

  // Parse photo URLs (pipe-separated)
  const photoUrls = row.photoUrls
    ? row.photoUrls
        .split('|')
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    : [];

  const photos: PropertyPhoto[] = photoUrls.map((url, index) => ({
    data: url,
    caption: '',
    order: index,
  }));

  return {
    id,
    name: row.name.trim(),
    address: {
      street: row.street.trim(),
      barangay: row.barangay.trim(),
      city: row.city.trim(),
      province: row.province.trim(),
      zip: String(row.zip).trim(),
    },
    price: Number(row.price),
    status: row.status as Property['status'],
    type: row.type as Property['type'],
    photos,
    description: row.description.trim(),
    features,
    reservationFee: Number(row.reservationFee),
    commission: Number(row.commission),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Parse and validate CSV file
 */
export async function parseCSVFile(file: File): Promise<CSVImportResult> {
  const PapaLib = await loadPapaParse();

  return new Promise((resolve, reject) => {
    PapaLib.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results: any) => {
        const validProperties: Property[] = [];
        const invalidRows: CSVImportResult['invalidRows'] = [];
        let nextId = Date.now();

        results.data.forEach((row: CSVPropertyRow, index: number) => {
          const validation = validatePropertyRow(row);

          if (validation.valid) {
            const property = rowToProperty(row, nextId++);
            validProperties.push(property);
          } else {
            invalidRows.push({
              row: index + 2,
              data: row,
              errors: validation.errors,
            });
          }
        });

        const result: CSVImportResult = {
          success: invalidRows.length === 0,
          validProperties,
          invalidRows,
          summary: {
            total: results.data.length,
            valid: validProperties.length,
            invalid: invalidRows.length,
          },
        };

        resolve(result);
      },
      error: (error: Error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
}

/**
 * Format import result summary
 */
export function formatImportSummary(result: CSVImportResult): string {
  const { summary } = result;
  let message = `CSV Import Results:\n\n`;
  message += `Total rows: ${summary.total}\n`;
  message += `✓ Valid properties: ${summary.valid}\n`;
  message += `✗ Invalid rows: ${summary.invalid}\n\n`;

  if (result.invalidRows.length > 0) {
    message += 'Errors:\n';
    result.invalidRows.slice(0, 10).forEach((item) => {
      message += `\nRow ${item.row}: ${item.data.name || 'Unnamed'}\n`;
      item.errors.forEach((error) => {
        message += `  • ${error}\n`;
      });
    });

    if (result.invalidRows.length > 10) {
      message += `\n... and ${result.invalidRows.length - 10} more errors`;
    }
  }

  return message;
}

/**
 * Export properties to CSV
 */
export function exportPropertiesToCSV(properties: Property[]): void {
  const rows = properties.map((property) => ({
    name: property.name,
    street: property.address.street,
    barangay: property.address.barangay,
    city: property.address.city,
    province: property.address.province,
    zip: property.address.zip,
    price: property.price,
    status: property.status,
    type: property.type,
    description: property.description,
    features: property.features.join('|'),
    reservationFee: property.reservationFee,
    commission: property.commission,
    photoUrls: property.photos.map((p) => p.data).join('|'),
  }));

  const csv = [
    CSV_COLUMNS.join(','),
    ...rows.map((row) =>
      CSV_COLUMNS.map((col) => {
        const value = (row as any)[col] || '';
        // Escape commas and quotes
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `properties-export-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
