
import { ServiceProvider, ServiceCategory, Review, Booking, BookingStatus, Notification, RequestType, Message, User, Earning, Quote } from '../types';

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
    services: [
        { name: 'Leaky Faucet Repair', startingPrice: 75, pricingModel: 'Fixed' }, 
        { name: 'Pipe Installation', startingPrice: 90, pricingModel: 'Hourly'},
        { name: 'Full Bathroom Plumbing', startingPrice: 0, pricingModel: 'Quote' }
    ],
    portfolio: Array.from({ length: 8 }, (_, i) => `https://picsum.photos/seed/${i+1}/400/300`),
    reviews: reviews, rating: 4.8, photoUrl: 'https://i.pravatar.cc/150?u=mike',
    location: { lat: -26.2041, lng: 28.0473 }, // Johannesburg
    vettingStatus: { backgroundChecked: true, skillsVerified: true, referencesChecked: true, isTopPro: true },
  },
  {
    id: '2', name: 'Sarah Adams', email: 'sarah@electrical.com', role: 'provider', businessName: 'Sparky Electrical',
    description: 'Certified electrician specializing in home wiring, fixture installation, and safety inspections.',
    category: 'Electrical',
    services: [
        { name: 'Light Fixture Installation', startingPrice: 70, pricingModel: 'Fixed' }, 
        { name: 'Fault Finding', startingPrice: 85, pricingModel: 'Hourly'},
        { name: 'Full Home Rewiring', startingPrice: 0, pricingModel: 'Quote' }
    ],
    portfolio: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${i+11}/400/300`),
    reviews: [reviews[0]], rating: 5, photoUrl: 'https://i.pravatar.cc/150?u=sarah',
    location: { lat: -26.1952, lng: 28.0341 }, // Randburg
    vettingStatus: { backgroundChecked: true, skillsVerified: true, referencesChecked: false, isTopPro: false },
  },
   {
    id: '3', name: 'Chris Green', email: 'chris@green.com', role: 'provider', businessName: 'Green Thumb Gardens',
    description: 'Passionate about creating beautiful and sustainable garden spaces. We offer design, maintenance, and landscaping services.',
    category: 'Gardening',
    services: [{ name: 'Lawn Mowing', startingPrice: 30, pricingModel: 'Fixed' }, { name: 'Garden Design', startingPrice: 0, pricingModel: 'Quote' }],
    portfolio: Array.from({ length: 10 }, (_, i) => `https://picsum.photos/seed/${i+21}/400/300`),
    reviews: [reviews[1], reviews[2]], rating: 4.5, photoUrl: 'https://i.pravatar.cc/150?u=chris',
    location: { lat: -26.1076, lng: 28.0567 }, // Sandton
    vettingStatus: { backgroundChecked: true, skillsVerified: false, referencesChecked: true, isTopPro: false },
  },
  {
    id: '4', name: 'Anna Cleaning Co.', email: 'anna@clean.com', role: 'provider', businessName: 'Spotless Homes',
    description: 'Professional and trustworthy home cleaning services. We use eco-friendly products.',
    category: 'Housekeeping',
    services: [{ name: 'Standard Clean', startingPrice: 40, pricingModel: 'Hourly' }, { name: 'Deep Clean', startingPrice: 100, pricingModel: 'Fixed' }],
    portfolio: Array.from({ length: 4 }, (_, i) => `https://picsum.photos/seed/${i+31}/400/300`),
    reviews: [reviews[0]], rating: 4.9, photoUrl: 'https://i.pravatar.cc/150?u=anna',
    location: { lat: -26.2708, lng: 28.0333 }, // Soweto
    vettingStatus: { backgroundChecked: true, skillsVerified: true, referencesChecked: true, isTopPro: false },
  },
  {
    id: '5', name: 'Jessica Jones', email: 'jessica@glamour.com', role: 'provider', businessName: 'Glamour Cuts',
    description: 'Trendy haircuts, vibrant color, and professional styling. Let us bring out your best look!',
    category: 'Salon & Hair',
    services: [{ name: 'Haircut & Style', startingPrice: 25, pricingModel: 'Fixed' }, { name: 'Color & Highlights', startingPrice: 90, pricingModel: 'Fixed' }],
    portfolio: Array.from({ length: 7 }, (_, i) => `https://picsum.photos/seed/${i+41}/400/300`),
    reviews: [reviews[0], reviews[2]], rating: 4.7, photoUrl: 'https://i.pravatar.cc/150?u=jessica',
    location: { lat: -26.1846, lng: 28.0125 }, // Rosebank
    vettingStatus: { backgroundChecked: false, skillsVerified: true, referencesChecked: true, isTopPro: false },
  },
  {
    id: '6', name: 'David Chen', email: 'david@tech.com', role: 'provider', businessName: 'Tech Solutions',
    description: 'Your friendly neighborhood IT expert. From PC builds to network troubleshooting, we handle all your tech needs.',
    category: 'I.T Services',
    services: [{ name: 'PC Repair & Diagnosis', startingPrice: 60, pricingModel: 'Hourly' }, { name: 'Home Network Setup', startingPrice: 120, pricingModel: 'Fixed' }],
    portfolio: Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${i+51}/400/300`),
    reviews: [reviews[1]], rating: 4.6, photoUrl: 'https://i.pravatar.cc/150?u=david',
    location: { lat: -26.1741, lng: 28.0473 }, // Parktown
    vettingStatus: { backgroundChecked: true, skillsVerified: true, referencesChecked: false, isTopPro: false },
  },
  {
    id: '7', name: 'Maria Garcia', email: 'maria@gadgetfix.com', role: 'provider', businessName: 'Gadget Fix',
    description: 'We bring your electronics back to life! Specializing in TV, audio, and mobile device repairs.',
    category: 'Electronics Services',
    services: [{ name: 'TV Repair', startingPrice: 0, pricingModel: 'Quote' }, { name: 'Phone Screen Replacement', startingPrice: 55, pricingModel: 'Fixed' }],
    portfolio: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/seed/${i+61}/400/300`),
    reviews: [reviews[0], reviews[2]], rating: 4.8, photoUrl: 'https://i.pravatar.cc/150?u=maria',
    location: { lat: -26.1552, lng: 28.0341 }, // Fourways
    vettingStatus: { backgroundChecked: true, skillsVerified: true, referencesChecked: true, isTopPro: false },
  },
  {
    id: '8', name: 'Peter Woof', email: 'peter@pets.com', role: 'provider', businessName: 'Pawsitive Care',
    description: 'Experienced and loving pet care services. From daily walks to overnight sitting, your pet is in great hands.',
    category: 'Pet Care',
    services: [{ name: 'Dog Walking (30 min)', startingPrice: 15, pricingModel: 'Fixed' }, { name: 'Overnight Pet Sitting', startingPrice: 50, pricingModel: 'Fixed' }],
    portfolio: Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${i+71}/400/300`),
    reviews: [], rating: 5, photoUrl: 'https://i.pravatar.cc/150?u=peter',
    location: { lat: -26.16, lng: 28.05 },
    vettingStatus: { backgroundChecked: true, skillsVerified: false, referencesChecked: true, isTopPro: false },
  },
  {
    id: '9', name: 'Dr. Evelyn Reed', email: 'evelyn@tutor.com', role: 'provider', businessName: 'Brainy Tutors',
    description: 'PhD in Mathematics with 10+ years of tutoring experience. Helping students from high school to university level.',
    category: 'Tutoring',
    services: [{ name: 'High School Math Tutoring', startingPrice: 40, pricingModel: 'Hourly' }, { name: 'University Physics Tutoring', startingPrice: 60, pricingModel: 'Hourly' }],
    portfolio: Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${i+81}/400/300`),
    reviews: [], rating: 4.9, photoUrl: 'https://i.pravatar.cc/150?u=evelyn',
    location: { lat: -26.14, lng: 28.02 },
    vettingStatus: { backgroundChecked: true, skillsVerified: true, referencesChecked: true, isTopPro: true },
  },
  {
    id: '10', name: 'Alex Fitness', email: 'alex@fit.com', role: 'provider', businessName: 'Body Sculpt',
    description: 'Certified personal trainer dedicated to helping you reach your fitness goals. Personalized workout and nutrition plans.',
    category: 'Personal Fitness',
    services: [{ name: 'One-on-One Training Session', startingPrice: 45, pricingModel: 'Hourly' }, { name: 'Custom 1-Month Nutrition Plan', startingPrice: 75, pricingModel: 'Fixed' }],
    portfolio: Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${i+91}/400/300`),
    reviews: [], rating: 4.8, photoUrl: 'https://i.pravatar.cc/150?u=alex',
    location: { lat: -26.12, lng: 28.08 },
    vettingStatus: { backgroundChecked: true, skillsVerified: true, referencesChecked: false, isTopPro: false },
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
  { id: 'cat10', name: 'Pet Care', icon: 'fa-solid fa-paw', subcategories: ['Dog Walking', 'Pet Sitting', 'Grooming'], description: "Loving care for your furry friends when you're away." },
  { id: 'cat11', name: 'Tutoring', icon: 'fa-solid fa-graduation-cap', subcategories: ['Math', 'Science', 'Languages'], description: 'Expert academic help for all ages and subjects.' },
  { id: 'cat12', name: 'Personal Fitness', icon: 'fa-solid fa-dumbbell', subcategories: ['Personal Training', 'Yoga Instruction', 'Nutrition Coaching'], description: 'Achieve your health goals with a dedicated fitness professional.' }
];

let bookings: Booking[] = [
    { id: 'b1', customerId: 'c1', customerName: 'John Customer', providerId: '1', providerName: 'Pro Plumbers', serviceName: 'Leaky Faucet Repair', date: '2024-08-01', time: '10:00', status: BookingStatus.Confirmed, address: '123 Main St, Sandton', requestType: RequestType.HouseCall, price: 75, reviewed: false },
    { id: 'b2', customerId: 'c1', customerName: 'John Customer', providerId: '3', providerName: 'Green Thumb Gardens', serviceName: 'Lawn Mowing', date: '2024-07-25', time: '14:00', status: BookingStatus.Completed, address: '456 Oak Ave, Randburg', requestType: RequestType.HouseCall, price: 30, reviewed: true },
    { id: 'b3', customerId: 'c1', customerName: 'John Customer', providerId: '1', providerName: 'Pro Plumbers', serviceName: 'Full Bathroom Plumbing', date: '2024-08-10', time: '11:00', status: BookingStatus.QuoteRequested, address: '789 Pine Rd, Johannesburg', requestType: RequestType.Emergency, price: undefined, reviewed: false },
    { id: 'b4', customerId: 'c1', customerName: 'John Customer', providerId: '4', providerName: 'Spotless Homes', serviceName: 'Deep Clean', date: '2024-07-20', time: '09:00', status: BookingStatus.Completed, address: '101 Pine Rd, Johannesburg', requestType: RequestType.HouseCall, price: 100, reviewed: false },
    { 
      id: 'b5', customerId: 'c1', customerName: 'John Customer', providerId: '2', providerName: 'Sparky Electrical', serviceName: 'Full Home Rewiring', date: '2024-08-12', time: '09:00', status: BookingStatus.QuoteSent, address: '111 Maple Dr, Sandton', requestType: RequestType.HouseCall, price: 2500, reviewed: false,
      quote: {
          items: [
              { description: 'Labour (2 electricians, 2 days)', cost: 1600 },
              { description: 'Materials (cabling, fixtures, etc.)', cost: 800 },
              { description: 'Certificate of Compliance', cost: 100 }
          ],
          total: 2500,
          providerNotes: 'This quote is valid for 14 days and includes all necessary materials and compliance certification.'
      }
    },
];

let notifications: Notification[] = [];
let messages: Message[] = [
    {id: 'm1', bookingId: 'b1', senderId: 'c1', senderName: 'John Customer', text: 'Hi, just confirming our appointment for tomorrow.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()},
    {id: 'm2', bookingId: 'b1', senderId: '1', senderName: 'Mike Miller', text: 'Confirmed! See you at 10:00 AM.', timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()},
];
let favoriteProvidersByCustomer: { [customerId: string]: string[] } = {
    'c1': ['3', '5']
};
let earnings: Earning[] = [
    { bookingId: 'b2', bookingDate: '2024-07-25', serviceName: 'Lawn Mowing', amountEarned: 25.50, payoutDate: '2024-08-01', status: 'Paid' }, // 30 * 0.85
    { bookingId: 'b4', bookingDate: '2024-07-20', serviceName: 'Deep Clean', amountEarned: 85.00, payoutDate: '2024-08-01', status: 'Paid' }, // 100 * 0.85
];

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

export const getProviders = async (category?: string, searchQuery?: string): Promise<ServiceProvider[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            let filteredProviders = providers;
            if (category) {
                filteredProviders = filteredProviders.filter(p => p.category === category);
            }
            if (searchQuery) {
                const lowercasedQuery = searchQuery.toLowerCase();
                filteredProviders = filteredProviders.filter(p => 
                    p.businessName.toLowerCase().includes(lowercasedQuery) ||
                    p.name.toLowerCase().includes(lowercasedQuery) ||
                    p.category.toLowerCase().includes(lowercasedQuery) ||
                    p.description.toLowerCase().includes(lowercasedQuery) ||
                    p.services.some(s => s.name.toLowerCase().includes(lowercasedQuery))
                );
            }
            resolve(filteredProviders);
        }, 500);
    });
};

export const getFeaturedProviders = async (): Promise<ServiceProvider[]> => {
    return new Promise(resolve => setTimeout(() => resolve(providers.slice(0, 3)), 500));
};


export const getProviderById = async (id: string): Promise<ServiceProvider | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(providers.find(p => p.id === id)), 500));
};

export const getCustomerById = async (id: string): Promise<User | undefined> => {
    // This is a mock; in a real app you'd fetch any user
    if (id === 'c1') {
        return new Promise(resolve => setTimeout(() => resolve({ id: 'c1', name: 'John Customer', email: 'john@customer.com', role: 'customer', location: { lat: -26.18, lng: 28.04 } }), 500));
    }
    return new Promise(resolve => setTimeout(() => resolve(undefined), 500));
}


export const getBookingById = async (id: string): Promise<Booking | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(bookings.find(b => b.id === id)), 500));
};

export const getBookingsForCustomer = async (customerId: string): Promise<Booking[]> => {
    return new Promise(resolve => setTimeout(() => resolve(bookings.filter(b => b.customerId === customerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())), 500));
}

export const getBookingsForProvider = async (providerId: string): Promise<Booking[]> => {
    return new Promise(resolve => setTimeout(() => resolve(bookings.filter(b => b.providerId === providerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())), 500));
}

export const createBooking = async (booking: Omit<Booking, 'id' | 'status' | 'price'> & { price?: number }): Promise<Booking> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const provider = providers.find(p => p.id === booking.providerId);
            const service = provider?.services.find(s => s.name === booking.serviceName);

            const isQuote = service?.pricingModel === 'Quote';

            const newBooking: Booking = {
                ...booking,
                id: `b${bookings.length + 1}`,
                status: isQuote ? BookingStatus.QuoteRequested : BookingStatus.Pending,
                price: isQuote ? undefined : booking.price,
                reviewed: false,
            };
            bookings.push(newBooking);
            
            const notificationMessage = isQuote 
                ? `You have a new quote request for ${newBooking.serviceName}.`
                : `You have a new ${newBooking.requestType} request for ${newBooking.serviceName}.`;

            // Create notification for the provider
            createNotification({
                userId: newBooking.providerId,
                message: notificationMessage,
                link: '/provider-dashboard',
            });

            resolve(newBooking);
        }, 500);
    });
}

export const sendQuote = async (bookingId: string, quoteData: Quote): Promise<Booking | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const bookingIndex = bookings.findIndex(b => b.id === bookingId);
            if (bookingIndex > -1) {
                const updatedBooking = { 
                    ...bookings[bookingIndex], 
                    quote: quoteData,
                    price: quoteData.total,
                    status: BookingStatus.QuoteSent,
                };
                bookings[bookingIndex] = updatedBooking;
                
                 createNotification({
                    userId: updatedBooking.customerId,
                    message: `You have received a quote from ${updatedBooking.providerName} for ${updatedBooking.serviceName}.`,
                    link: '/dashboard',
                });

                resolve(updatedBooking);
            } else {
                resolve(undefined);
            }
        }, 500);
    });
};


export const updateBookingStatus = async (bookingId: string, status: BookingStatus, providerName: string, serviceName: string): Promise<Booking | undefined> => {
     return new Promise(resolve => {
        setTimeout(() => {
            const bookingIndex = bookings.findIndex(b => b.id === bookingId);
            if (bookingIndex > -1) {
                const originalBooking = bookings[bookingIndex];
                const updatedBooking = { ...originalBooking, status };
                bookings[bookingIndex] = updatedBooking;

                let message = '';
                if (status === BookingStatus.Confirmed) {
                    if (originalBooking.status === BookingStatus.QuoteSent) {
                        message = `You accepted the quote for ${serviceName}. Your booking is confirmed.`
                    } else {
                        message = `${providerName} has confirmed your booking for ${serviceName}.`;
                    }
                } else if (status === BookingStatus.OnTheWay) {
                    message = `${providerName} is on the way for your service: ${serviceName}.`;
                } else if (status === BookingStatus.Declined) {
                     if (originalBooking.status === BookingStatus.QuoteSent) {
                        message = `You declined the quote for ${serviceName}.`;
                    } else {
                        message = `${providerName} has declined your booking for ${serviceName}.`;
                    }
                } else if (status === BookingStatus.Completed) {
                    message = `Your service for ${serviceName} with ${providerName} is now complete. Please leave a review!`;
                    if(updatedBooking.price){
                        // Generate an earning record for the provider
                        const commissionRate = 0.85; // 15% commission
                        const amountEarned = updatedBooking.price * commissionRate;
                        const newEarning: Earning = {
                            bookingId: updatedBooking.id,
                            bookingDate: updatedBooking.date,
                            serviceName: updatedBooking.serviceName,
                            amountEarned: amountEarned,
                            payoutDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Payout in 15 days
                            status: 'Pending'
                        };
                        earnings.push(newEarning);
                    }
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

export const addReview = async (reviewData: { providerId: string; bookingId: string; rating: number; comment: string; authorName: string }): Promise<ServiceProvider | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const providerIndex = providers.findIndex(p => p.id === reviewData.providerId);
            const bookingIndex = bookings.findIndex(b => b.id === reviewData.bookingId);

            if (providerIndex > -1 && bookingIndex > -1) {
                // Add review to provider
                const newReview: Review = {
                    id: `r${Date.now()}`,
                    authorName: reviewData.authorName,
                    rating: reviewData.rating,
                    comment: reviewData.comment,
                    date: new Date().toISOString().split('T')[0],
                };
                providers[providerIndex].reviews.unshift(newReview);

                // Recalculate average rating for the provider
                const totalRating = providers[providerIndex].reviews.reduce((acc, r) => acc + r.rating, 0);
                providers[providerIndex].rating = totalRating / providers[providerIndex].reviews.length;

                // Mark booking as reviewed
                bookings[bookingIndex].reviewed = true;

                resolve(providers[providerIndex]);
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

export const updateProviderLocation = async (providerId: string, location: { lat: number; lng: number }): Promise<ServiceProvider | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const providerIndex = providers.findIndex(p => p.id === providerId);
            if (providerIndex > -1) {
                providers[providerIndex].location = location;
                resolve(providers[providerIndex]);
            } else {
                resolve(undefined);
            }
        }, 300);
    });
};

// Favorite Providers
export const getFavoriteProviderIdsForCustomer = async (customerId: string): Promise<string[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(favoriteProvidersByCustomer[customerId] || []);
        }, 300);
    });
};

export const addFavoriteProvider = async (customerId: string, providerId: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (!favoriteProvidersByCustomer[customerId]) {
                favoriteProvidersByCustomer[customerId] = [];
            }
            if (!favoriteProvidersByCustomer[customerId].includes(providerId)) {
                favoriteProvidersByCustomer[customerId].push(providerId);
            }
            resolve();
        }, 300);
    });
};

export const removeFavoriteProvider = async (customerId: string, providerId: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (favoriteProvidersByCustomer[customerId]) {
                favoriteProvidersByCustomer[customerId] = favoriteProvidersByCustomer[customerId].filter(id => id !== providerId);
            }
            resolve();
        }, 300);
    });
};

// Chat
export const getMessagesForBooking = async (bookingId: string): Promise<Message[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(messages.filter(m => m.bookingId === bookingId).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
        }, 200);
    });
};

export const sendMessage = async (messageData: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newMessage: Message = {
                ...messageData,
                id: `m${messages.length + 1}`,
                timestamp: new Date().toISOString(),
            };
            messages.push(newMessage);

            const booking = bookings.find(b => b.id === newMessage.bookingId);
            if (booking) {
                const recipientId = newMessage.senderId === booking.customerId ? booking.providerId : booking.customerId;
                
                createNotification({
                    userId: recipientId,
                    message: `You have a new message from ${newMessage.senderName}.`,
                    link: `/chat/${newMessage.bookingId}`,
                });
            }
            
            resolve(newMessage);
        }, 200);
    });
};

// Earnings
export const getEarningsForProvider = async (providerId: string): Promise<Earning[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const providerBookings = bookings.filter(b => b.providerId === providerId);
            const providerEarnings = earnings.filter(e => providerBookings.some(b => b.id === e.bookingId));
            resolve(providerEarnings);
        }, 500);
    });
};