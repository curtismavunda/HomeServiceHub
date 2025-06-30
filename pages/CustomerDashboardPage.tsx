import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getBookingsForCustomer } from '../services/dataService';
import { Booking, BookingStatus } from '../types';
import Spinner from '../components/Spinner';
import Button from '../components/Button';

const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        setLoading(true);
        try {
          const userBookings = await getBookingsForCustomer(user.id);
          setBookings(userBookings);
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBookings();
  }, [user]);

  const getStatusDetails = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Confirmed:
        return {
          colors: 'bg-green-100 text-green-800',
          icon: 'fa-solid fa-calendar-check',
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
  
  const pendingBookings = bookings.filter(b => b.status === BookingStatus.Pending);
  const confirmedBookings = bookings.filter(b => b.status === BookingStatus.Confirmed);
  const pastBookings = bookings.filter(b => b.status === BookingStatus.Completed || b.status === BookingStatus.Cancelled || b.status === BookingStatus.Declined);

  if (loading) {
    return <Spinner />;
  }
  
  const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const { colors, icon } = getStatusDetails(booking.status);
    const isActionable = booking.status === BookingStatus.Confirmed || booking.status === BookingStatus.Pending;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xl font-bold text-dark">{booking.providerName}</p>
                        <p className="text-md text-gray-600">{booking.serviceName}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${colors}`}>
                        <i className={icon}></i>
                        <span>{booking.status}</span>
                    </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                    <p className="text-sm text-gray-800 flex items-center">
                        <i className="fa-solid fa-calendar-day w-6 text-center text-primary"></i>
                        <span className="ml-2 font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                    </p>
                    <p className="text-sm text-gray-800 flex items-center">
                        <i className="fa-solid fa-clock w-6 text-center text-primary"></i>
                        <span className="ml-2 font-medium">{booking.time}</span>
                    </p>
                </div>
            </div>
            <div className="mt-6 flex gap-2 justify-end">
                {isActionable ? (
                    <>
                        <Button variant="secondary" size="sm">Reschedule</Button>
                        <Button variant="danger" size="sm">Cancel</Button>
                    </>
                ) : (
                    <>
                        {booking.status === BookingStatus.Completed && 
                            <Button variant="primary" size="sm">Leave a Review</Button>
                        }
                        <Button variant="secondary" size="sm">Book Again</Button>
                    </>
                )}
            </div>
        </div>
    );
  };


  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2">Pending Requests</h2>
        {pendingBookings.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            <i className="fas fa-inbox text-4xl mb-4 text-gray-300"></i>
            <p>You have no pending requests.</p>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-dark border-b pb-2">Confirmed Appointments</h2>
        {confirmedBookings.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {confirmedBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            <i className="fas fa-calendar-times text-4xl mb-4 text-gray-300"></i>
            <p>You have no confirmed appointments.</p>
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
    </div>
  );
};

export default CustomerDashboardPage;
