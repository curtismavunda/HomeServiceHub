
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
      <img className="w-full h-48 object-cover" src={provider.portfolio[0]} alt={provider.businessName} />
      <div className="p-4">
        <h3 className="text-xl font-bold text-dark">{provider.businessName}</h3>
        <p className="text-sm text-secondary mb-2">{provider.category}</p>
        <StarRating rating={provider.rating} />
        <p className="text-gray-700 mt-2 text-sm truncate">{provider.description}</p>
        <div className="mt-4">
          <Link to={`/provider/${provider.id}`}>
            <Button variant="primary" size="sm" className="w-full">View Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
