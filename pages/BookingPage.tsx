
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getProviderById, createBooking } from '../services/dataService';
import { ServiceProvider, RequestType, Service } from '../types';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const BookingPage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isEmergency = new URLSearchParams(location.search).get('emergency') === 'true';

  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [requestType, setRequestType] = useState<RequestType>(isEmergency ? RequestType.Emergency : RequestType.HouseCall);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [priceDetails, setPriceDetails] = useState({ base: 0, surcharge: 0, total: 0 });

  const isQuoteRequest = selectedService?.pricingModel === 'Quote';

  const HOUSE_CALL_SURCHARGE = 15;
  const EMERGENCY_SURCHARGE = 50;
  
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

  useEffect(() => {
    if (!selectedService || isQuoteRequest) {
      setPriceDetails({ base: 0, surcharge: 0, total: 0 });
      return;
    }
    const base = selectedService.startingPrice;
    let surcharge = 0;
    if (requestType === RequestType.HouseCall) {
      surcharge = HOUSE_CALL_SURCHARGE;
    } else if (requestType === RequestType.Emergency) {
      surcharge = EMERGENCY_SURCHARGE;
    }
    setPriceDetails({ base, surcharge, total: base + surcharge });
  }, [selectedService, requestType, isQuoteRequest]);


  const handleGeolocate = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            // In a real app, you'd use a reverse geocoding service.
            // For this demo, we'll just use the coordinates.
            setAddress(`From GPS: Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
            setIsLocating(false);
        },
        () => {
            alert("Unable to retrieve your location. Please enter it manually.");
            setIsLocating(false);
        }
    );
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !provider) return;

    let finalAddress = address;
    if (requestType === RequestType.StoreVisit) {
        finalAddress = `${provider.businessName} (Provider Location)`;
    } else if (!address) {
        alert('Please provide a service address for the house-call.');
        return;
    }

    if (!selectedService || !date || !time) {
        alert('Please fill out all required fields.');
        return;
    }

    try {
        await createBooking({
            customerId: user.id,
            customerName: user.name,
            providerId: provider.id,
            providerName: provider.businessName,
            serviceName: selectedService.name,
            date,
            time,
            address: finalAddress,
            notes,
            requestType,
            price: isQuoteRequest ? undefined : priceDetails.total,
        });
        const alertMessage = isQuoteRequest
            ? `Quote request sent to ${provider?.businessName}! You will be notified when they respond.`
            : `Booking request sent to ${provider?.businessName}! You will be notified when they respond.`;
        alert(alertMessage);
        navigate('/dashboard');
    } catch (error) {
        console.error("Failed to create booking:", error);
        alert("There was an error sending your booking request.");
    }
  };

  if (loading) return <Spinner />;
  if (!provider) return <div className="text-center text-danger">Provider not found.</div>;

  return (
    <div className={`max-w-2xl mx-auto ${isEmergency ? 'border-4 border-danger rounded-lg' : ''}`}>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {isEmergency ? (
            <div className="text-center mb-6">
                 <i className="fas fa-bolt fa-3x text-danger mb-2"></i>
                <h1 className="text-3xl font-bold text-danger">Emergency Service Request</h1>
                <p className="text-lg text-secondary">with {provider.businessName}</p>
            </div>
        ) : (
            isQuoteRequest ? (
                <>
                    <h1 className="text-3xl font-bold mb-2">Request a Quote</h1>
                    <p className="text-lg text-secondary mb-6">from {provider.businessName}</p>
                </>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
                    <p className="text-lg text-secondary mb-6">with {provider.businessName}</p>
                </>
            )
        )}


        <form onSubmit={handleSubmit} className="space-y-6">
        
         {!isEmergency && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
              <div className="flex rounded-md shadow-sm">
                 <button
                    type="button"
                    onClick={() => setRequestType(RequestType.HouseCall)}
                    className={`flex-1 p-3 rounded-l-md text-sm font-semibold transition flex items-center justify-center gap-2 ${requestType === RequestType.HouseCall ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    <i className="fas fa-truck"></i> House-Call
                </button>
                <button
                    type="button"
                    onClick={() => setRequestType(RequestType.StoreVisit)}
                    className={`flex-1 p-3 rounded-r-md text-sm font-semibold transition flex items-center justify-center gap-2 ${requestType === RequestType.StoreVisit ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    <i className="fas fa-store"></i> Store Visit
                </button>
              </div>
            </div>
         )}
          

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">Select a Service</label>
            <select
              id="service"
              required
              value={selectedService?.name || ''}
              onChange={e => {
                  const service = provider.services.find(s => s.name === e.target.value) || null;
                  setSelectedService(service);
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">-- Choose a service --</option>
              {provider.services.map(service => (
                <option key={service.name} value={service.name}>
                  {service.name} ({service.pricingModel === 'Quote' ? 'By Quote' : (service.pricingModel === 'Hourly' ? `$${service.startingPrice}/hr` : `from $${service.startingPrice}`)})
                </option>
              ))}
            </select>
          </div>
          
          {requestType !== RequestType.StoreVisit ? (
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Service Address</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        type="text"
                        id="address"
                        required
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="e.g. 123 Main St, Sandton"
                        className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-none rounded-l-md focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <button
                        type="button"
                        onClick={handleGeolocate}
                        disabled={isLocating}
                        className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-200 disabled:cursor-not-allowed"
                    >
                        {isLocating ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                            <i className="fas fa-location-crosshairs text-primary"></i>
                        )}
                    </button>
                </div>
            </div>
          ) : (
            <div>
                <label className="block text-sm font-medium text-gray-700">Service Location</label>
                <div className="mt-1 p-3 bg-light rounded-md border border-gray-200">
                    <p className="text-gray-800">You will visit the provider at their location.</p>
                    <p className="text-sm text-gray-500">Address will be provided upon booking confirmation.</p>
                </div>
            </div>
          )}


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
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">{isQuoteRequest ? 'Describe the Job in Detail' : 'Additional Notes'}</label>
            <textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={isQuoteRequest ? "The more detail you provide, the more accurate the quote will be. e.g., 'I need to replace all the old galvanized pipes in my 3-bedroom house...'" : "Please provide any relevant details about the job..."}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
          
          {selectedService && !isQuoteRequest && (
            <div className="p-4 bg-light rounded-lg border border-gray-200 space-y-2">
                <h4 className="font-semibold text-lg">Price Breakdown</h4>
                <div className="flex justify-between text-gray-700"><span>Base Service Price:</span> <span>${priceDetails.base.toFixed(2)}</span></div>
                {priceDetails.surcharge > 0 && (
                    <div className="flex justify-between text-gray-700"><span>{requestType} Surcharge:</span> <span>${priceDetails.surcharge.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between font-bold text-dark text-xl border-t pt-2 mt-2"><span>Estimated Total:</span> <span>${priceDetails.total.toFixed(2)}</span></div>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" variant={isEmergency ? 'danger' : 'primary'}>
            {isEmergency ? 'Confirm Emergency Request' : (isQuoteRequest ? 'Submit Quote Request' : 'Send Booking Request')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;