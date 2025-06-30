
export type UserRole = 'customer' | 'provider';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Service {
  name: string;
  startingPrice: number;
}

export interface ServiceProvider extends User {
  businessName: string;
  description: string;
  category: string;
  services: Service[];
  portfolio: string[];
  reviews: Review[];
  rating: number;
  certifications?: string[];
  photoUrl: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string; // FontAwesome icon class
  subcategories: string[];
  description: string;
}

export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Declined = 'Declined',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  date: string;
  time: string;
  status: BookingStatus;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  date: string;
  link?: string;
}
