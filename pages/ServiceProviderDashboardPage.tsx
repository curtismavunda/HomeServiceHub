
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBookingsForProvider, updateBookingStatus, getProviderById, updateProviderLocation, getEarningsForProvider, sendQuote } from '../services/dataService';
import { ServiceProvider, Booking, BookingStatus, RequestType, Earning, Quote } from '../types';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import EarningsSummary from '../components/EarningsSummary';
import ProviderWeeklySchedule from '../components/ProviderWeeklySchedule';
import QuoteModal from '../components/QuoteModal';

const getStatusDetails = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return {
          colors: 'bg-blue-100 text-blue-800',
          icon: 'fa-solid fa-calendar-check',
        };
      case BookingStatus.OnTheWay:
        return {
          colors: 'bg-teal-100 text-teal-800',
          icon: 'fa-solid fa-truck-fast',
        };
      case BookingStatus.Completed:
        return {
          colors: 'bg-green-100 text-green-800',
          icon: 'fa-solid fa-star',
        };
      case BookingStatus.Pending:
        return {
          colors: 'bg-yellow-100 text-yellow-800',
          icon: 'fa-solid fa-hourglass-start',
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

const BookingCard: React.FC<{ booking: Booking, onStatusChange: (booking: Booking, status: BookingStatus) => void, onSendQuote: (booking: Booking) => void }> = ({ booking, onStatusChange, onSendQuote }) => {
    const { colors, icon } = getStatusDetails(booking.status);

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

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xl font-bold text-dark">{booking.serviceName}</p>
                        <p className="text-sm text-gray-500">For: {booking.customerName}</p>
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
                        <span className="ml-2 font-medium">{booking.address}</span>
                    </p>
                     {booking.price && (
                        <p className="text-sm text-gray-800 flex items-center">
                            <i className="fa-solid fa-tag w-6 text-center text-primary"></i>
                            <span className="ml-2 font-bold text-lg text-primary">${booking.price.toFixed(2)}</span>
                        </p>
                     )}
                    {booking.notes && (
                        <p className="text-sm text-gray-800 flex items-start bg-yellow-50 p-3 rounded-md">
                            <i className="fa-solid fa-file-alt w-6 text-center text-yellow-600 mt-1"></i>
                            <span className="ml-2 italic">"{booking.notes}"</span>
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-6 flex gap-2 justify-end flex-wrap">
                <Link to={`/chat/${booking.id}`}>
                    <Button variant="secondary" size="sm"><i className="fas fa-comments mr-2"></i>Chat with Customer</Button>
                </Link>
                 {booking.status === BookingStatus.QuoteRequested && (
                    <Button variant="primary" size="sm" onClick={() => onSendQuote(booking)}>
                        <i className="fas fa-paper-plane mr-2"></i>Send Quote
                    </Button>
                )}
                {booking.status === BookingStatus.Pending && (
                    <>
                        <Button variant="success" size="sm" onClick={() => onStatusChange(booking, BookingStatus.Confirmed)}>Accept</Button>
                        <Button variant="danger" size="sm" onClick={() => onStatusChange(booking, BookingStatus.Declined)}>Decline</Button>
                    </>
                )}
                {booking.status === BookingStatus.Confirmed && (
                    <>
                         {booking.requestType !== RequestType.StoreVisit && (
                            <Button variant="primary" size="sm" onClick={() => onStatusChange(booking, BookingStatus.OnTheWay)}>
                                <i className="fas fa-truck-fast mr-2"></i>I'm On My Way
                            </Button>
                         )}
                        <Button variant="secondary" size="sm" onClick={() => onStatusChange(booking, BookingStatus.Cancelled)}>Cancel</Button>
                    </>
                )}
                 {booking.status === BookingStatus.OnTheWay && (
                    <Button variant="success" size="sm" onClick={() => onStatusChange(booking, BookingStatus.Completed)}>
                        <i className="fas fa-check-circle mr-2"></i>Mark as Completed
                    </Button>
                )}
            </div>
        </div>
    );
};


const ServiceProviderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocationUpdating, setIsLocationUpdating] = useState(false);
  const [quoteModalState, setQuoteModalState] = useState<{ isOpen: boolean; booking: Booking | null }>({ isOpen: false, booking: null });

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [providerData, providerBookings, providerEarnings] = await Promise.all([
        getProviderById(user.id),
        getBookingsForProvider(user.id),
        getEarningsForProvider(user.id),
      ]);
      setProvider(providerData || null);
      setBookings(providerBookings);
      setEarnings(providerEarnings);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (booking: Booking, newStatus: BookingStatus) => {
    await updateBookingStatus(booking.id, newStatus, booking.providerName, booking.serviceName);
    await fetchData(); // Refetch all data to update the UI
  };

  const handleSendQuote = (booking: Booking) => {
    setQuoteModalState({ isOpen: true, booking });
  };

  const handleQuoteSubmit = async (quoteData: Quote) => {
    if (!quoteModalState.booking) return;
    try {
        await sendQuote(quoteModalState.booking.id, quoteData);
        alert("Quote sent successfully!");
        setQuoteModalState({ isOpen: false, booking: null });
        fetchData();
    } catch (error) {
        console.error("Failed to send quote:", error);
        alert("There was an error sending the quote.");
    }
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation || !user) {
        alert("Geolocation is not available or you are not logged in.");
        return;
    }
    setIsLocationUpdating(true);
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                await updateProviderLocation(user.id, { lat: latitude, lng: longitude });
                alert("Location updated successfully!");
                fetchData();
            } catch (error) {
                alert("Failed to update location.");
                console.error(error);
            } finally {
                setIsLocationUpdating(false);
            }
        },
        () => {
            alert("Unable to retrieve your location.");
            setIsLocationUpdating(false);
        }
    );
  };


  const newBookingRequests = bookings.filter(b => b.status === BookingStatus.Pending);
  const newQuoteRequests = bookings.filter(b => b.status === BookingStatus.QuoteRequested);
  const upcomingAppointments = bookings.filter(b => b.status === BookingStatus.Confirmed || b.status === BookingStatus.OnTheWay || b.status === BookingStatus.QuoteSent);
  const jobHistory = bookings.filter(b => b.status === BookingStatus.Completed || b.status === BookingStatus.Cancelled || b.status === BookingStatus.Declined);

  if (loading) {
    return <Spinner />;
  }

  const renderBookingSection = (title: string, icon: string, bookingList: Booking[], emptyMessage: string) => (
    <section className="mt-12 first:mt-0">
      <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2 flex items-center">
        <i className={`fas ${icon} mr-3 text-primary`}></i>
        {title} <span className="ml-2 bg-primary text-white text-sm font-semibold rounded-full px-2">{bookingList.length}</span>
      </h2>
      {bookingList.length > 0 ? (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {bookingList.map(booking => (
            <BookingCard key={booking.id} booking={booking} onStatusChange={handleStatusChange} onSendQuote={handleSendQuote} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
          <i className={`fas fa-inbox text-4xl mb-4 text-gray-300`}></i>
          <p>{emptyMessage}</p>
        </div>
      )}
    </section>
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Provider Dashboard</h1>
      
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <div className="xl:col-span-2">
                <ProviderWeeklySchedule bookings={bookings} />
            </div>
            <div>
                <EarningsSummary earnings={earnings} />
            </div>
        </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2 flex items-center">
            <i className="fas fa-tools mr-3 text-primary"></i>
            Business Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <i className="fas fa-images text-3xl text-primary mb-3"></i>
                <h3 className="font-bold mb-2">Manage Portfolio</h3>
                <p className="text-sm text-gray-500 mb-4 flex-grow">Showcase your best work to attract customers.</p>
                <Button variant="secondary" size="sm" onClick={() => alert('Portfolio management can be found in Settings. This is a placeholder for a dedicated page.')}>Manage Images</Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <i className="fas fa-location-dot text-3xl text-primary mb-3"></i>
                <h3 className="font-bold mb-2">Update Location</h3>
                <p className="text-sm text-gray-500 mb-4 flex-grow">Keep your service area up-to-date for accurate map results.</p>
                <Button variant="secondary" size="sm" onClick={handleUpdateLocation} disabled={isLocationUpdating}>
                    {isLocationUpdating ? 'Updating...' : 'Sync My Location'}
                </Button>
            </div>
            <Link to="/provider-resources" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center text-center">
                <i className="fas fa-rocket text-3xl text-primary mb-3"></i>
                <h3 className="font-bold mb-2">Training & Resources</h3>
                <p className="text-sm text-gray-500 mb-4 flex-grow">Access courses and tips to grow your business.</p>
                <div className="text-primary font-semibold mt-auto">Go to Resource Center &rarr;</div>
            </Link>
        </div>
      </section>

      {renderBookingSection(
        "New Quote Requests",
        "fa-file-invoice-dollar",
        newQuoteRequests,
        "You have no new quote requests."
      )}

      {renderBookingSection(
        "New Booking Requests",
        "fa-bell",
        newBookingRequests,
        "You have no new booking requests."
      )}

      {renderBookingSection(
        "Upcoming & Quoted Jobs",
        "fa-calendar-alt",
        upcomingAppointments,
        "You have no upcoming appointments or sent quotes."
      )}

      {renderBookingSection(
        "Job History",
        "fa-history",
        jobHistory,
        "You have no past jobs."
      )}
      
      <QuoteModal 
        isOpen={quoteModalState.isOpen}
        onClose={() => setQuoteModalState({isOpen: false, booking: null})}
        onSubmit={handleQuoteSubmit}
        booking={quoteModalState.booking}
      />
    </div>
  );
};

export default ServiceProviderDashboardPage;