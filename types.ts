
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

export type PricingModel = 'Fixed' | 'Hourly' | 'Quote';

export interface Service {
  name: string;
  startingPrice: number;
  pricingModel: PricingModel;
}

export interface VettingStatus {
  backgroundChecked: boolean;
  skillsVerified: boolean;
  referencesChecked: boolean;
  isTopPro: boolean;
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
  vettingStatus: VettingStatus;
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
  QuoteRequested = 'Quote Requested',
  QuoteSent = 'Quote Sent',
  Confirmed = 'Confirmed',
  OnTheWay = 'On The Way',
  Declined = 'Declined',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum RequestType {
  StoreVisit = 'Store Visit',
  HouseCall = 'House-Call',
  Emergency = 'Emergency',
}

export interface Quote {
    items: {
        description: string;
        cost: number;
    }[];
    total: number;
    providerNotes?: string;
    expires?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  date: string;
  time: string;
  status: BookingStatus;
  requestType: RequestType;
  price?: number;
  address: string;
  notes?: string;
  reviewed?: boolean;
  quote?: Quote;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  date: string;
  link?: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Earning {
    bookingId: string;
    bookingDate: string;
    serviceName: string;
    amountEarned: number; // After commission
    payoutDate: string;
    status: 'Paid' | 'Pending';
}