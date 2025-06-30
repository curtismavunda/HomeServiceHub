
import React, { useState } from 'react';

const faqData = [
  {
    question: "How do I book a service?",
    answer: "To book a service, simply find a service provider you like, go to their profile, and click the 'Book Now' button. Fill out the required details in the booking form and submit your request. The provider will then confirm your appointment."
  },
  {
    question: "How are service providers verified?",
    answer: "All service providers on our platform go through a verification process. For providers in certified trades, we require them to upload their certifications. We also verify their identity using a South African ID or passport."
  },
  {
    question: "Can I cancel a booking?",
    answer: "Yes, you can cancel a booking from your customer dashboard. Please note that cancellation policies may vary by provider, so it's a good idea to check their profile for any specific terms."
  },
  {
    question: "How do I become a service provider?",
    answer: "Click the 'Register' button on the homepage, select 'Service Provider', and fill out the registration form. You will need to provide your business details, contact information, and any required certifications for verification."
  },
];

const FaqItem: React.FC<{ q: string, a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center p-4 focus:outline-none"
      >
        <span className="text-lg font-medium">{q}</span>
        <i className={`fas fa-chevron-down transform transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="p-4 bg-light">
          <p className="text-gray-700">{a}</p>
        </div>
      )}
    </div>
  );
};


const SupportPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Support Center</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions (FAQ)</h2>
        <div className="space-y-2">
          {faqData.map((item, index) => (
            <FaqItem key={index} q={item.question} a={item.answer} />
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg mt-8 text-center">
         <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
         <p className="text-gray-600 mb-4">Our support team is here for you. Contact us anytime.</p>
         <a href="mailto:support@homeserviceshub.com" className="bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-primary-hover transition duration-300">
            <i className="fas fa-envelope mr-2"></i> Contact Support
         </a>
      </div>
    </div>
  );
};

export default SupportPage;
