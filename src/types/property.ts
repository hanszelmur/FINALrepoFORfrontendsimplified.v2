export type PropertyStatus = 'Available' | 'Reserved' | 'Pending' | 'Sold' | 'Withdrawn';
export type ReservationType = 'fee' | 'deposit';

export interface PropertyPhoto {
  data: string;
  caption: string;
  order: number;
}

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
  photos: PropertyPhoto[];
  description: string;
  features: string[];
  reservationFee: number;
  commission: number;
  reservationType?: ReservationType;
  salePrice?: number;
  finalCommission?: number;
  createdAt: string;
}
