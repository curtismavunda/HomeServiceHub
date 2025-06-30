
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProviderById, createBooking } from '../services/dataService';
import { ServiceProvider } from '../types';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const BookingPage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    const fetchProvider = async () => {
      if (providerId) {
        setLoading(true);
        const prov = await getProviderById(providerId);
        setProvider(prov || null);
        setLoading(false);
      }
    };
    fetchProvider();
  }, [providerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !provider) return;

    if (!selectedService || !date || !time) {
        alert('Please fill out all required fields.');
        return;
    }

    try {
        await createBooking({
            customerId: user.id,
            providerId: provider.id,
            providerName: provider.businessName,
            serviceName: selectedService,
            date,
            time,
            notes,
        });
        alert(`Booking request sent to ${provider?.businessName}! You will be notified when they respond.`);
        navigate('/dashboard');
    } catch (error) {
        console.error("Failed to create booking:", error);
        alert("There was an error sending your booking request.");
    }
  };

  if (loading) return <Spinner />;
  if (!provider) return <div className="text-center text-danger">Provider not found.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-lg text-secondary mb-6">with {provider.businessName}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">Select a Service</label>
            <select
              id="service"
              required
              value={selectedService}
              onChange={e => setSelectedService(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">-- Choose a service --</option>
              {provider.services.map(service => (
                <option key={service.name} value={service.name}>
                  {service.name} (from ${service.startingPrice})
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
              <input
                id="date"
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Preferred Time</label>
              <input
                id="time"
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Please provide any relevant details about the job..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Send Booking Request
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
