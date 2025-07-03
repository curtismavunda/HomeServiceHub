
import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceProvider } from '../types';
import StarRating from './StarRating';
import Button from './Button';

interface ProviderCardProps {
  provider: ServiceProvider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={provider.portfolio[0]} alt={provider.businessName} />
        {provider.vettingStatus.isTopPro && (
            <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-lg">
                <i className="fas fa-crown mr-1"></i> TOP PRO
            </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-dark truncate">{provider.businessName}</h3>
        <p className="text-sm text-secondary mb-2">{provider.category}</p>
        <StarRating rating={provider.rating} />
        <p className="text-gray-700 mt-2 text-sm h-10 overflow-hidden">{provider.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <Link to={`/provider/${provider.id}`} className="flex-grow">
            <Button variant="primary" size="sm" className="w-full">View Profile</Button>
          </Link>
          {provider.vettingStatus.backgroundChecked && (
              <div className="text-green-500 ml-3 flex-shrink-0" title="Background Checked">
                  <i className="fas fa-user-shield fa-lg"></i>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;