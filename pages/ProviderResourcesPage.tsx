
import React from 'react';
import { Link } from 'react-router-dom';

const ResourceCard: React.FC<{ title: string; description: string; link: string; icon: string }> = ({ title, description, link, icon }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center mb-3">
            <i className={`fas ${icon} text-3xl text-primary mr-4`}></i>
            <h3 className="text-xl font-bold text-dark">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
    </a>
);

const ProviderResourcesPage: React.FC = () => {
    const resources = [
        { title: 'Skill Development Courses', description: 'Access online courses to learn new skills and get certified in your trade.', link: '#', icon: 'fa-graduation-cap' },
        { title: 'Business & Marketing 101', description: 'Learn how to market your services, manage your finances, and grow your business.', link: '#', icon: 'fa-chart-line' },
        { title: 'Safety Best Practices', description: 'Stay up-to-date with the latest safety guidelines and protocols for your industry.', link: '#', icon: 'fa-hard-hat' },
        { title: 'Exclusive Partner Discounts', description: 'Get discounts on tools and materials from our partner suppliers.', link: '#', icon: 'fa-tags' },
        { title: 'Customer Service Excellence', description: 'Master the art of customer communication and satisfaction to earn 5-star reviews.', link: '#', icon: 'fa-star' },
        { title: 'Community Forum', description: 'Connect with other providers on our platform to share tips and experiences.', link: '#', icon: 'fa-comments' },
    ];

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-dark">Provider Training & Resources</h1>
                <p className="text-lg text-gray-600 mt-2">Invest in yourself. We're here to help you grow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.map((res, index) => (
                    <ResourceCard key={index} {...res} />
                ))}
            </div>
             <div className="mt-12 text-center">
                <Link to="/provider-dashboard" className="text-primary hover:underline">
                    &larr; Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default ProviderResourcesPage;
