
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBookingsForCustomer, getFavoriteProviderIdsForCustomer, getProviderById, addReview, updateBookingStatus } from '../services/dataService';
import { Booking, BookingStatus, RequestType, ServiceProvider } from '../types';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import LiveTrackingMap from '../components/LiveTrackingMap';
import ProviderCard from '../components/ProviderCard';
import ReviewModal from '../components/ReviewModal';
import QuoteDetails from '../components/QuoteDetails';

const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favoriteProviders, setFavoriteProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalState, setReviewModalState] = useState<{isOpen: boolean; booking: Booking | null}>({isOpen: false, booking: null});

  const fetchData = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const [userBookings, favIds] = await Promise.all([
          getBookingsForCustomer(user.id),
          getFavoriteProviderIdsForCustomer(user.id)
        ]);

        const favPromises = favIds.map(id => getProviderById(id));
        const favs = (await Promise.all(favPromises)).filter(p => p !== undefined) as ServiceProvider[];
        
        setBookings(userBookings);
        setFavoriteProviders(favs);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateBookingStatus = async (booking: Booking, status: BookingStatus) => {
    await updateBookingStatus(booking.id, status, booking.providerName, booking.serviceName);
    fetchData(); // Refetch all data to update the UI
  };
  
  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!reviewModalState.booking || !user) return;
    try {
        await addReview({
            bookingId: reviewModalState.booking.id,
            providerId: reviewModalState.booking.providerId,
            rating,
            comment,
            authorName: user.name,
        });
        alert("Thank you for your review!");
        setReviewModalState({ isOpen: false, booking: null });
        fetchData(); // Refetch data to update UI
    } catch (error) {
        console.error("Failed to submit review:", error);
        alert("There was an error submitting your review.");
    }
  };

  const getStatusDetails = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return {
          colors: 'bg-green-100 text-green-800',
          icon: 'fa-solid fa-calendar-check',
        };
      case BookingStatus.OnTheWay:
        return {
          colors: 'bg-teal-100 text-teal-800',
          icon: 'fa-solid fa-truck-fast',
        };
      case BookingStatus.Completed:
        return {
          colors: 'bg-blue-100 text-blue-800',
          icon: 'fa-solid fa-star',
        };
      case BookingStatus.Pending:
        return {
          colors: 'bg-yellow-100 text-yellow-800',
          icon: 'fa-solid fa-clock',
        };
       case BookingStatus.QuoteRequested:
        return {
            colors: 'bg-indigo-100 text-indigo-800',
            icon: 'fa-solid fa-file-invoice-dollar'
        };
      case BookingStatus.QuoteSent:
        return {
            colors: 'bg-purple-100 text-purple-800',
            icon: 'fa-solid fa-envelope-open-text'
        };
      case BookingStatus.Cancelled:
      case BookingStatus.Declined:
        return {
          colors: 'bg-red-100 text-red-800',
          icon: 'fa-solid fa-times-circle',
        };
      default:
        return {
          colors: 'bg-gray-100 text-gray-800',
          icon: 'fa-solid fa-question-circle',
        };
    }
  };
  
  const pendingBookings = bookings.filter(b => b.status === BookingStatus.Pending || b.status === BookingStatus.QuoteRequested || b.status === BookingStatus.QuoteSent);
  const activeBookings = bookings.filter(b => b.status === BookingStatus.Confirmed || b.status === BookingStatus.OnTheWay);
  const pastBookings = bookings.filter(b => b.status === BookingStatus.Completed || b.status === BookingStatus.Cancelled || b.status === BookingStatus.Declined);

  if (loading) {
    return <Spinner />;
  }
  
  const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const { colors, icon } = getStatusDetails(booking.status);
    const isActionable = booking.status === BookingStatus.Confirmed || booking.status === BookingStatus.Pending;
    
    const getRequestTypeDetails = (type: RequestType) => {
        switch(type) {
            case RequestType.Emergency:
                return { text: 'Emergency', color: 'bg-red-200 text-red-800', icon: 'fa-solid fa-bolt' };
            case RequestType.HouseCall:
                return { text: 'House-Call', color: 'bg-blue-200 text-blue-800', icon: 'fa-solid fa-truck' };
            case RequestType.StoreVisit:
                return { text: 'Store Visit', color: 'bg-indigo-200 text-indigo-800', icon: 'fa-solid fa-store' };
            default:
                return { text: '', color: '', icon: ''};
        }
    };

    const requestDetails = getRequestTypeDetails(booking.requestType);
    const [provider, setProvider] = useState<ServiceProvider | null>(null);

    useEffect(() => {
        if (booking.status === BookingStatus.OnTheWay) {
            getProviderById(booking.providerId).then(p => setProvider(p || null));
        }
    }, [booking.status, booking.providerId]);


    return (
        <div className="bg-white rounded-lg shadow-lg flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300 overflow-hidden">
            {booking.status === BookingStatus.OnTheWay && provider && user && <LiveTrackingMap provider={provider} customer={user} />}
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xl font-bold text-dark">{booking.providerName}</p>
                        <p className="text-md text-gray-600">{booking.serviceName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                         <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${colors}`}>
                            <i className={icon}></i>
                            <span>{booking.status}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${requestDetails.color}`}>
                            <i className={requestDetails.icon}></i>
                            <span>{requestDetails.text}</span>
                        </div>
                    </div>
                </div>
                <div className="border-t pt-4 space-y-3">
                    <p className="text-sm text-gray-800 flex items-center">
                        <i className="fa-solid fa-calendar-day w-6 text-center text-primary"></i>
                        <span className="ml-2 font-medium">{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                    </p>
                    <p className="text-sm text-gray-800 flex items-start">
                        <i className="fa-solid fa-map-pin w-6 text-center text-primary mt-1"></i>
                        <span className="ml-2">{booking.address}</span>
                    </p>
                    {booking.price && booking.status !== BookingStatus.QuoteSent && (
                        <p className="text-sm text-gray-800 flex items-center">
                            <i className="fa-solid fa-tag w-6 text-center text-primary"></i>
                            <span className="ml-2 font-bold text-lg text-primary">${booking.price.toFixed(2)}</span>
                        </p>
                    )}
                </div>

                {booking.status === BookingStatus.QuoteSent && booking.quote && (
                    <div className="my-4">
                        <QuoteDetails quote={booking.quote} />
                    </div>
                )}
            
                <div className="mt-6 flex gap-2 justify-end flex-wrap">
                     <Link to={`/chat/${booking.id}`}>
                        <Button variant="secondary" size="sm"><i className="fas fa-comments mr-2"></i>Chat</Button>
                    </Link>
                    {booking.status === BookingStatus.QuoteSent && (
                        <>
                            <Button variant="danger" size="sm" onClick={() => handleUpdateBookingStatus(booking, BookingStatus.Declined)}>Decline Quote</Button>
                            <Button variant="success" size="sm" onClick={() => handleUpdateBookingStatus(booking, BookingStatus.Confirmed)}>Accept Quote</Button>
                        </>
                    )}
                    {isActionable && (
                        <>
                            <Button variant="secondary" size="sm">Reschedule</Button>
                            <Button variant="danger" size="sm">Cancel</Button>
                        </>
                    )}
                    {booking.status === BookingStatus.Completed && !booking.reviewed && (
                        <Button variant="primary" size="sm" onClick={() => setReviewModalState({isOpen: true, booking: booking})}>Leave a Review</Button>
                    )}
                    {booking.status === BookingStatus.Completed && booking.reviewed && (
                        <Button variant="secondary" size="sm" disabled>Review Submitted</Button>
                    )}
                    {booking.status !== BookingStatus.QuoteRequested && booking.status !== BookingStatus.QuoteSent && (
                        <Button variant="secondary" size="sm">Book Again</Button>
                    )}
                </div>
            </div>
        </div>
    );
  };


  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2 flex items-center"><i className="fas fa-heart text-primary mr-3"></i>Your Favorite Providers</h2>
        {favoriteProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProviders.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            <i className="fas fa-user-plus text-4xl mb-4 text-gray-300"></i>
            <p>You haven't added any favorite providers yet.</p>
            <p className="text-sm mt-1">Click the <i className="far fa-heart"></i> on a provider's profile to add them.</p>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2">Active Appointments</h2>
        {activeBookings.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {activeBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            <i className="fas fa-calendar-times text-4xl mb-4 text-gray-300"></i>
            <p>You have no active appointments.</p>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2">Pending Requests & Quotes</h2>
        {pendingBookings.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            <i className="fas fa-inbox text-4xl mb-4 text-gray-300"></i>
            <p>You have no pending requests or quotes.</p>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2">Service History</h2>
        {pastBookings.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {pastBookings.map(booking => (
               <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
             <i className="fas fa-history text-4xl mb-4 text-gray-300"></i>
            <p>You have no past services.</p>
          </div>
        )}
      </section>
      
      <ReviewModal
        isOpen={reviewModalState.isOpen}
        onClose={() => setReviewModalState({ isOpen: false, booking: null })}
        onSubmit={handleReviewSubmit}
        booking={reviewModalState.booking}
    />
    </div>
  );
};

export default CustomerDashboardPage;