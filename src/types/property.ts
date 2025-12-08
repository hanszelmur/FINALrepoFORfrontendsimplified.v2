export type PropertyStatus = 'Available' | 'Reserved' | 'Pending' | 'Sold' | 'Withdrawn';

export interface Property {
  id: number;
  name: string;
  address: {
    street: string;
    barangay: string;
    city: string;
    province: string;
    zip: string;
  };
  price: number;
  status: PropertyStatus;
  type: 'House' | 'Condo' | 'Townhouse' | 'Lot' | 'Commercial';
  photos: string[];
  description: string;
  features: string[];
  reservationFee: number;
  commission: number;
  createdAt: string;
}
