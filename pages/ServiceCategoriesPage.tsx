
import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/dataService';
import { ServiceCategory } from '../types';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

const ServiceCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-dark">All Service Categories</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <i className={`${category.icon} text-3xl text-primary mr-4`}></i>
                <h2 className="text-2xl font-bold text-dark">{category.name}</h2>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">{category.description}</p>
              <div>
                <h4 className="font-semibold mb-2 text-gray-700">Popular services:</h4>
                <ul className="space-y-1">
                  {category.subcategories.map(sub => (
                    <li key={sub} className="text-sm text-gray-500 flex items-center">
                       <i className="fas fa-check-circle text-success mr-2"></i> {sub}
                    </li>
                  ))}
                </ul>
              </div>
               <Link to={`/map?category=${category.name}`} className="mt-6 bg-primary text-white text-center font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition duration-300">
                Find {category.name} Pros
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceCategoriesPage;
