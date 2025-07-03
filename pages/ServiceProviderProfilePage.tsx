
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProviderById, getFavoriteProviderIdsForCustomer, addFavoriteProvider, removeFavoriteProvider } from '../services/dataService';
import { ServiceProvider, Review, Service } from '../types';
import Spinner from '../components/Spinner';
import StarRating from '../components/StarRating';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import VettingBadges from '../components/VettingBadges';

const ServiceProviderProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const prov = await getProviderById(id);
        setProvider(prov || null);

        if (user && user.role === 'customer' && prov) {
          const favoriteIds = await getFavoriteProviderIdsForCustomer(user.id);
          setIsFavorite(favoriteIds.includes(prov.id));
        }
      } catch (error) {
        console.error("Failed to fetch provider:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user || user.role !== 'customer' || !provider) return;

    if (isFavorite) {
      await removeFavoriteProvider(user.id, provider.id);
    } else {
      await addFavoriteProvider(user.id, provider.id);
    }
    setIsFavorite(!isFavorite);
  };

  const renderPrice = (service: Service) => {
    switch(service.pricingModel) {
        case 'Hourly':
            return <span className="font-bold text-primary">${service.startingPrice}/hr</span>;
        case 'Quote':
            return <span className="font-semibold text-secondary">By Quote</span>;
        case 'Fixed':
        default:
             return <span className="font-bold text-primary">from ${service.startingPrice}</span>;
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!provider) {
    return <div className="text-center text-danger">Provider not found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
        <img src={provider.photoUrl} alt={provider.name} className="w-32 h-32 rounded-full object-cover border-4 border-primary" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold text-dark">{provider.businessName}</h1>
            {isAuthenticated && user?.role === 'customer' && (
              <button onClick={handleToggleFavorite} className="p-2 rounded-full hover:bg-red-100 transition-colors" aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                  <i className={`fa-heart text-2xl ${isFavorite ? 'fas text-danger' : 'far text-gray-400'}`}></i>
              </button>
            )}
          </div>
          <p className="text-lg text-secondary mb-2">{provider.name} - {provider.category}</p>
          <div className="mb-2">
            <StarRating rating={provider.rating} />
          </div>
          <div className="mb-4">
            <VettingBadges status={provider.vettingStatus} />
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to={`/book/${provider.id}`}>
                <Button variant="primary"><i className="fas fa-calendar-check mr-2"></i>Book or Request Quote</Button>
            </Link>
             <Link to={`/book/${provider.id}?emergency=true`}>
                <Button variant="danger"><i className="fas fa-bolt mr-2"></i>Emergency Service</Button>
            </Link>
            <Button variant="secondary"><i className="fas fa-envelope mr-2"></i>Contact</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">About Us</h2>
            <p className="text-gray-700 whitespace-pre-line">{provider.description}</p>
          </section>
          
          {/* Portfolio */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Portfolio</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {provider.portfolio.map((img, index) => (
                <img key={index} src={img} alt={`Portfolio image ${index + 1}`} className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity" />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div>
          {/* Services */}
          <section className="bg-light p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Services & Pricing</h2>
            <ul className="space-y-3">
              {provider.services.map((service: Service) => (
                <li key={service.name} className="flex justify-between items-center">
                  <span className="text-gray-800">{service.name}</span>
                  {renderPrice(service)}
                </li>
              ))}
            </ul>
          </section>

          {/* Reviews */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Customer Reviews</h2>
            <div className="space-y-4">
              {provider.reviews.map((review: Review) => (
                <div key={review.id} className="bg-light p-4 rounded-lg shadow-inner">
                  <div className="flex items-center justify-between">
                     <h4 className="font-bold">{review.authorName}</h4>
                     <StarRating rating={review.rating}/>
                  </div>
                  <p className="text-gray-600 mt-2 italic">"{review.comment}"</p>
                  <p className="text-xs text-gray-400 text-right mt-2">{review.date}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderProfilePage;