
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getFeaturedProviders } from '../services/dataService';
import { ServiceCategory, ServiceProvider } from '../types';
import Spinner from '../components/Spinner';
import ProviderCard from '../components/ProviderCard';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, provs] = await Promise.all([getCategories(), getFeaturedProviders()]);
        setCategories(cats.slice(0, 6)); // Show top 6 categories
        setProviders(provs);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-4 bg-gray-700 text-white rounded-lg overflow-hidden">
         <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{backgroundImage: "url('https://picsum.photos/seed/homepage/1200/400')", opacity: 0.4}}>
        </div>
        <div className="relative z-10">
            <h1 className="text-5xl font-extrabold mb-4">Find Trusted Home Service Professionals</h1>
            <p className="text-xl mb-8">From plumbing to painting, we connect you with the best in your area.</p>
            <div className="max-w-2xl mx-auto">
                <div className="flex">
                    <input 
                        type="text" 
                        placeholder="What service do you need? (e.g., plumbing)"
                        className="w-full p-4 rounded-l-md border-0 text-gray-800"
                    />
                    <Button size="lg" className="rounded-l-none">Search</Button>
                </div>
            </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map(cat => (
              <Link to="/categories" key={cat.id} className="block text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300">
                <i className={`${cat.icon} text-4xl text-primary mb-3`}></i>
                <h3 className="font-semibold text-dark">{cat.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Providers Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Featured Providers</h2>
        {loading ? <Spinner /> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {providers.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
