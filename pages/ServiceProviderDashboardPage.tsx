import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getBookingsForProvider, updateBookingStatus, getProviderById, addPortfolioImage, deletePortfolioImage } from '../services/dataService';
import { ServiceProvider, Booking, BookingStatus } from '../types';
import Spinner from '../components/Spinner';
import Button from '../components/Button';

const getStatusDetails = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return {
          colors: 'bg-blue-100 text-blue-800',
          icon: 'fa-solid fa-calendar-check',
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

const BookingCard: React.FC<{ booking: Booking, onStatusChange: (booking: Booking, status: BookingStatus) => void }> = ({ booking, onStatusChange }) => {
    const { colors, icon } = getStatusDetails(booking.status);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Customer ID: {booking.customerId}</p>
                        <p className="text-xl font-bold text-dark">{booking.serviceName}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${colors}`}>
                        <i className={icon}></i>
                        <span>{booking.status}</span>
                    </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                    <p className="text-sm text-gray-800 flex items-center">
                        <i className="fa-solid fa-calendar-day w-6 text-center text-primary"></i>
                        <span className="ml-2 font-medium">{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                    </p>
                    {booking.notes && (
                        <p className="text-sm text-gray-800 flex items-start">
                            <i className="fa-solid fa-file-alt w-6 text-center text-primary mt-1"></i>
                            <span className="ml-2 italic">"{booking.notes}"</span>
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-6 flex gap-2 justify-end">
                {booking.status === BookingStatus.Pending && (
                    <>
                        <Button variant="success" size="sm" onClick={() => onStatusChange(booking, BookingStatus.Confirmed)}>Accept</Button>
                        <Button variant="danger" size="sm" onClick={() => onStatusChange(booking, BookingStatus.Declined)}>Decline</Button>
                    </>
                )}
                {booking.status === BookingStatus.Confirmed && (
                    <>
                        <Button variant="primary" size="sm" onClick={() => onStatusChange(booking, BookingStatus.Completed)}>Mark as Completed</Button>
                        <Button variant="secondary" size="sm" onClick={() => onStatusChange(booking, BookingStatus.Cancelled)}>Cancel</Button>
                    </>
                )}
            </div>
        </div>
    );
};


const ServiceProviderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [providerData, providerBookings] = await Promise.all([
        getProviderById(user.id),
        getBookingsForProvider(user.id),
      ]);
      setProvider(providerData || null);
      setBookings(providerBookings);
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

  const handleAddImage = async () => {
    if (!user) return;
    // Simulate adding a new image. In a real app, this would involve a file upload.
    const newImageUrl = `https://picsum.photos/seed/${Date.now()}/400/300`;
    await addPortfolioImage(user.id, newImageUrl);
    fetchData(); // Re-fetch to update UI
  };

  const handleDeleteImage = async (imageUrl: string) => {
      if (!user) return;
      if (window.confirm('Are you sure you want to delete this image?')) {
          await deletePortfolioImage(user.id, imageUrl);
          fetchData(); // Re-fetch to update UI
      }
  };

  const newRequests = bookings.filter(b => b.status === BookingStatus.Pending);
  const upcomingAppointments = bookings.filter(b => b.status === BookingStatus.Confirmed);
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
            <BookingCard key={booking.id} booking={booking} onStatusChange={handleStatusChange} />
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
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2 flex items-center">
            <i className="fas fa-images mr-3 text-primary"></i>
            Manage Portfolio
        </h2>
        {provider ? (
            <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                    {provider.portfolio.map((img, index) => (
                        <div key={index} className="relative group">
                            <img src={img} alt={`Portfolio image ${index + 1}`} className="w-full h-40 object-cover rounded-lg shadow-md" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center rounded-lg">
                                <button 
                                    onClick={() => handleDeleteImage(img)}
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-danger rounded-full hover:bg-red-700"
                                    aria-label="Delete image"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button onClick={handleAddImage} variant="primary">
                    <i className="fas fa-plus mr-2"></i> Add New Image
                </Button>
            </div>
        ) : (
          <p>Loading portfolio...</p>
        )}
      </section>

      {renderBookingSection(
        "New Booking Requests",
        "fa-bell",
        newRequests,
        "You have no new booking requests."
      )}

      {renderBookingSection(
        "Upcoming Appointments",
        "fa-calendar-alt",
        upcomingAppointments,
        "You have no upcoming appointments."
      )}

      {renderBookingSection(
        "Job History",
        "fa-history",
        jobHistory,
        "You have no past jobs."
      )}
      
    </div>
  );
};

export default ServiceProviderDashboardPage;