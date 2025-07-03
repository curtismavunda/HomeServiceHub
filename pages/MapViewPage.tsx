
import React, { useState, useEffect } from 'react';
import { getProviders } from '../services/dataService';
import { ServiceProvider } from '../types';
import Spinner from '../components/Spinner';
import { Link, useLocation } from 'react-router-dom';
import StarRating from '../components/StarRating';

const MapViewPage: React.FC = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const provs = await getProviders(category || undefined, searchQuery || undefined);
        setProviders(provs);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, searchQuery]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] gap-4">
      {/* Provider List */}
      <div className="md:w-1/3 h-full overflow-y-auto bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : (category ? `${category} Providers` : 'Nearby Providers')}
        </h2>
        {loading ? <Spinner /> : (
            providers.length > 0 ? (
          <ul className="space-y-4">
            {providers.map(provider => (
              <li 
                key={provider.id} 
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${selectedProviderId === provider.id ? 'bg-primary text-white shadow-xl' : 'bg-light hover:bg-gray-200'}`}
                onClick={() => setSelectedProviderId(provider.id)}
              >
                <h3 className="font-bold">{provider.businessName}</h3>
                <p className={`text-sm ${selectedProviderId === provider.id ? 'text-gray-200' : 'text-secondary'}`}>{provider.category}</p>
                <div className={`${selectedProviderId === provider.id ? '[&_i]:text-yellow-300' : ''}`}>
                    <StarRating rating={provider.rating} />
                </div>
                <Link to={`/provider/${provider.id}`} className={`mt-2 inline-block text-sm font-semibold ${selectedProviderId === provider.id ? 'text-yellow-300' : 'text-primary'}`}>
                  View Profile &rarr;
                </Link>
              </li>
            ))}
          </ul>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    <i className="fas fa-search-location fa-3x mb-4"></i>
                    <p>No providers found matching your criteria.</p>
                </div>
            )
        )}
      </div>

      {/* Map Placeholder */}
      <div className="flex-1 bg-gray-300 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
        <img src="https://www.mapsofworld.com/south-africa/maps/johannesburg-map.jpg" alt="Map of Johannesburg" className="w-full h-full object-cover opacity-50"/>
        <div className="absolute inset-0 flex items-center justify-center">
            {providers.map((p, index) => (
                <div 
                    key={p.id} 
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${selectedProviderId === p.id ? 'z-10' : 'z-0'}`} 
                    style={{ 
                        top: `${40 + Math.sin(index * 0.5) * 25}%`, 
                        left: `${50 + Math.cos(index * 0.5) * 35}%` 
                    }}
                    onClick={() => setSelectedProviderId(p.id)}
                >
                    <i className={`fas fa-map-marker-alt text-4xl cursor-pointer ${selectedProviderId === p.id ? 'text-danger scale-150' : 'text-primary'}`}></i>
                    {selectedProviderId === p.id && (
                        <div className="absolute bottom-full mb-2 w-48 bg-white p-2 rounded-lg shadow-xl text-center">
                            <h4 className="font-bold text-sm">{p.businessName}</h4>
                            <p className="text-xs text-gray-500">{p.category}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg">Interactive Map</h3>
            <p className="text-sm text-gray-600">Click a provider or a pin!</p>
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;
