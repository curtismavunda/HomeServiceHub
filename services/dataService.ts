import { ServiceProvider, ServiceCategory, Review, Booking, BookingStatus, Notification } from '../types';

const reviews: Review[] = [
  { id: 'r1', authorName: 'Jane Doe', rating: 5, comment: 'Excellent and timely service!', date: '2024-07-15' },
  { id: 'r2', authorName: 'John Smith', rating: 4, comment: 'Good work, but arrived a bit late.', date: '2024-07-10' },
  { id: 'r3', authorName: 'Emily White', rating: 5, comment: 'Very professional and fixed the issue quickly.', date: '2024-06-28' },
];

let providers: ServiceProvider[] = [
  {
    id: '1', name: 'Mike Miller', email: 'mike@plumbing.com', role: 'provider', businessName: 'Pro Plumbers',
    description: '20 years of experience in residential and commercial plumbing. Fast, reliable, and affordable. Available 24/7 for emergencies.',
    category: 'Plumbing',
    services: [{ name: 'Leaky Faucet Repair', startingPrice: 50 }, { name: 'Drain Unclogging', startingPrice: 80 }],
    portfolio: Array.from({ length: 8 }, (_, i) => `https://picsum.photos/seed/${i+1}/400/300`),
    reviews: reviews, rating: 4.8, photoUrl: 'https://i.pravatar.cc/150?u=mike',
    location: { lat: -26.2041, lng: 28.0473 }, // Johannesburg
  },
  {
    id: '2', name: 'Sarah Adams', email: 'sarah@electrical.com', role: 'provider', businessName: 'Sparky Electrical',
    description: 'Certified electrician specializing in home wiring, fixture installation, and safety inspections.',
    category: 'Electrical',
    services: [{ name: 'Light Fixture Installation', startingPrice: 70 }, { name: 'Full Home Rewiring', startingPrice: 2000 }],
    portfolio: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${i+11}/400/300`),
    reviews: [reviews[0]], rating: 5, photoUrl: 'https://i.pravatar.cc/150?u=sarah',
    location: { lat: -26.1952, lng: 28.0341 }, // Randburg
  },
   {
    id: '3', name: 'Chris Green', email: 'chris@green.com', role: 'provider', businessName: 'Green Thumb Gardens',
    description: 'Passionate about creating beautiful and sustainable garden spaces. We offer design, maintenance, and landscaping services.',
    category: 'Gardening',
    services: [{ name: 'Lawn Mowing', startingPrice: 30 }, { name: 'Garden Design', startingPrice: 150 }],
    portfolio: Array.from({ length: 10 }, (_, i) => `https://picsum.photos/seed/${i+21}/400/300`),
    reviews: [reviews[1], reviews[2]], rating: 4.5, photoUrl: 'https://i.pravatar.cc/150?u=chris',
    location: { lat: -26.1076, lng: 28.0567 }, // Sandton
  },
  {
    id: '4', name: 'Anna Cleaning Co.', email: 'anna@clean.com', role: 'provider', businessName: 'Spotless Homes',
    description: 'Professional and trustworthy home cleaning services. We use eco-friendly products.',
    category: 'Housekeeping',
    services: [{ name: 'Standard Clean', startingPrice: 40 }, { name: 'Deep Clean', startingPrice: 100 }],
    portfolio: Array.from({ length: 4 }, (_, i) => `https://picsum.photos/seed/${i+31}/400/300`),
    reviews: [reviews[0]], rating: 4.9, photoUrl: 'https://i.pravatar.cc/150?u=anna',
    location: { lat: -26.2708, lng: 28.0333 }, // Soweto
  },
  {
    id: '5', name: 'Jessica Jones', email: 'jessica@glamour.com', role: 'provider', businessName: 'Glamour Cuts',
    description: 'Trendy haircuts, vibrant color, and professional styling. Let us bring out your best look!',
    category: 'Salon & Hair',
    services: [{ name: 'Haircut & Style', startingPrice: 25 }, { name: 'Color & Highlights', startingPrice: 90 }],
    portfolio: Array.from({ length: 7 }, (_, i) => `https://picsum.photos/seed/${i+41}/400/300`),
    reviews: [reviews[0], reviews[2]], rating: 4.7, photoUrl: 'https://i.pravatar.cc/150?u=jessica',
    location: { lat: -26.1846, lng: 28.0125 }, // Rosebank
  },
  {
    id: '6', name: 'David Chen', email: 'david@tech.com', role: 'provider', businessName: 'Tech Solutions',
    description: 'Your friendly neighborhood IT expert. From PC builds to network troubleshooting, we handle all your tech needs.',
    category: 'I.T Services',
    services: [{ name: 'PC Repair & Diagnosis', startingPrice: 60 }, { name: 'Home Network Setup', startingPrice: 120 }],
    portfolio: Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${i+51}/400/300`),
    reviews: [reviews[1]], rating: 4.6, photoUrl: 'https://i.pravatar.cc/150?u=david',
    location: { lat: -26.1741, lng: 28.0473 }, // Parktown
  },
  {
    id: '7', name: 'Maria Garcia', email: 'maria@gadgetfix.com', role: 'provider', businessName: 'Gadget Fix',
    description: 'We bring your electronics back to life! Specializing in TV, audio, and mobile device repairs.',
    category: 'Electronics Services',
    services: [{ name: 'TV Repair', startingPrice: 85 }, { name: 'Phone Screen Replacement', startingPrice: 55 }],
    portfolio: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${i+61}/400/300`),
    reviews: [reviews[0], reviews[2]], rating: 4.8, photoUrl: 'https://i.pravatar.cc/150?u=maria',
    location: { lat: -26.1552, lng: 28.0341 }, // Fourways
  }
];

const categories: ServiceCategory[] = [
  { id: 'cat1', name: 'Plumbing', icon: 'fa-solid fa-wrench', subcategories: ['Leak Repair', 'Drain Cleaning', 'Toilet Installation'], description: 'Fixing leaks, clogs, and all your pipe problems.' },
  { id: 'cat2', name: 'Electrical', icon: 'fa-solid fa-bolt', subcategories: ['Wiring', 'Fixture Installation', 'Panel Upgrades'], description: 'Safe and certified electrical work for your home.' },
  { id: 'cat3', name: 'Gardening', icon: 'fa-solid fa-seedling', subcategories: ['Lawn Care', 'Landscaping', 'Tree Trimming'], description: 'Cultivate and maintain your perfect garden.' },
  { id: 'cat4', name: 'Housekeeping', icon: 'fa-solid fa-broom', subcategories: ['Regular Cleaning', 'Deep Cleaning', 'Move-out Cleaning'], description: 'Keep your home sparkling clean and tidy.' },
  { id: 'cat5', name: 'Renovations', icon: 'fa-solid fa-paint-roller', subcategories: ['Painting', 'Tiling', 'Kitchen Remodeling'], description: 'Transform your space with professional renovations.' },
  { id: 'cat6', name: 'Babysitting', icon: 'fa-solid fa-baby', subcategories: ['Evening Care', 'Daytime Care', 'Nanny Services'], description: 'Trusted and caring sitters for your little ones.' },
  { id: 'cat7', name: 'Salon & Hair', icon: 'fa-solid fa-scissors', subcategories: ['Haircuts', 'Coloring', 'Styling'], description: 'Professional hair care, from classic cuts to modern styles.' },
  { id: 'cat8', name: 'I.T Services', icon: 'fa-solid fa-desktop', subcategories: ['PC Repair', 'Virus Removal', 'Network Setup'], description: 'Expert support for your computers and network infrastructure.' },
  { id: 'cat9', name: 'Electronics Services', icon: 'fa-solid fa-tv', subcategories: ['TV Repair', 'Audio System Setup', 'Mobile Device Repair'], description: 'Get your gadgets and home electronics repaired by pros.' },
];

let bookings: Booking[] = [
    { id: 'b1', customerId: 'c1', providerId: '1', providerName: 'Pro Plumbers', serviceName: 'Leaky Faucet Repair', date: '2024-08-01', time: '10:00', status: BookingStatus.Confirmed },
    { id: 'b2', customerId: 'c1', providerId: '1', providerName: 'Pro Plumbers', serviceName: 'Lawn Mowing', date: '2024-07-25', time: '14:00', status: BookingStatus.Completed },
    { id: 'b3', customerId: 'c1', providerId: '1', providerName: 'Pro Plumbers', serviceName: 'Drain Unclogging', date: '2024-08-10', time: '11:00', status: BookingStatus.Pending },
];

let notifications: Notification[] = [];


// Simulate API calls with promises
export const createNotification = async (notification: Omit<Notification, 'id' | 'date' | 'read'>): Promise<Notification> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newNotification: Notification = {
                ...notification,
                id: `n${notifications.length + 1}`,
                date: new Date().toISOString(),
                read: false,
            };
            notifications.unshift(newNotification); // Add to the beginning
            resolve(newNotification);
        }, 100);
    });
};

export const getNotificationsForUser = async (userId: string): Promise<Notification[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(notifications.filter(n => n.userId === userId));
        }, 300);
    });
};

export const markNotificationsAsRead = async (userId: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            notifications = notifications.map(n => n.userId === userId ? { ...n, read: true } : n);
            resolve();
        }, 100);
    });
};

export const getCategories = async (): Promise<ServiceCategory[]> => {
  return new Promise(resolve => setTimeout(() => resolve(categories), 500));
};

export const getProviders = async (category?: string): Promise<ServiceProvider[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (category) {
                resolve(providers.filter(p => p.category === category));
            } else {
                resolve(providers);
            }
        }, 500);
    });
};

export const getFeaturedProviders = async (): Promise<ServiceProvider[]> => {
    return new Promise(resolve => setTimeout(() => resolve(providers.slice(0, 3)), 500));
};


export const getProviderById = async (id: string): Promise<ServiceProvider | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(providers.find(p => p.id === id)), 500));
};

export const getBookingsForCustomer = async (customerId: string): Promise<Booking[]> => {
    return new Promise(resolve => setTimeout(() => resolve(bookings.filter(b => b.customerId === customerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())), 500));
}

export const getBookingsForProvider = async (providerId: string): Promise<Booking[]> => {
    return new Promise(resolve => setTimeout(() => resolve(bookings.filter(b => b.providerId === providerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())), 500));
}

export const createBooking = async (booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newBooking: Booking = { 
                ...booking, 
                id: `b${bookings.length + 1}`,
                status: BookingStatus.Pending
            };
            bookings.push(newBooking);
            resolve(newBooking);
        }, 500);
    });
}

export const updateBookingStatus = async (bookingId: string, status: BookingStatus, providerName: string, serviceName: string): Promise<Booking | undefined> => {
     return new Promise(resolve => {
        setTimeout(() => {
            const bookingIndex = bookings.findIndex(b => b.id === bookingId);
            if (bookingIndex > -1) {
                const updatedBooking = { ...bookings[bookingIndex], status };
                bookings[bookingIndex] = updatedBooking;

                let message = '';
                if (status === BookingStatus.Confirmed) {
                    message = `${providerName} has confirmed your booking for ${serviceName}.`;
                } else if (status === BookingStatus.Declined) {
                    message = `${providerName} has declined your booking for ${serviceName}.`;
                } else if (status === BookingStatus.Completed) {
                    message = `Your service for ${serviceName} with ${providerName} is now complete. We hope you had a great experience!`;
                } else if (status === BookingStatus.Cancelled) {
                    message = `Your booking for ${serviceName} with ${providerName} has been cancelled.`;
                }
                
                if (message) {
                    createNotification({
                        userId: updatedBooking.customerId,
                        message: message,
                        link: '/dashboard',
                    });
                }
                
                resolve(updatedBooking);
            } else {
                resolve(undefined);
            }
        }, 500);
    });
};

export const addPortfolioImage = async (providerId: string, imageUrl: string): Promise<ServiceProvider | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const providerIndex = providers.findIndex(p => p.id === providerId);
            if (providerIndex > -1) {
                providers[providerIndex].portfolio.push(imageUrl);
                resolve(providers[providerIndex]);
            } else {
                resolve(undefined);
            }
        }, 300);
    });
};

export const deletePortfolioImage = async (providerId: string, imageUrl: string): Promise<ServiceProvider | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const providerIndex = providers.findIndex(p => p.id === providerId);
            if (providerIndex > -1) {
                providers[providerIndex].portfolio = providers[providerIndex].portfolio.filter(img => img !== imageUrl);
                resolve(providers[providerIndex]);
            } else {
                resolve(undefined);
            }
        }, 300);
    });
};
