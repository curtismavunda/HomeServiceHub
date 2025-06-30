
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration logic
    alert(`Registration successful as a ${role}! You can now log in.`);
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>
        
        {/* Role Selection */}
        <div className="mb-6">
          <p className="font-medium text-gray-700 mb-2">I am a...</p>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setRole('customer')}
              className={`flex-1 p-3 rounded-l-md text-sm font-semibold transition ${role === 'customer' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <i className="fas fa-user mr-2"></i>Customer
            </button>
            <button
              onClick={() => setRole('provider')}
              className={`flex-1 p-3 rounded-r-md text-sm font-semibold transition ${role === 'provider' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <i className="fas fa-briefcase mr-2"></i>Service Provider
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <h3 className="text-xl font-semibold">{role === 'customer' ? 'Customer Details' : 'Provider Details'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
          </div>
          
          {role === 'provider' && (
            <>
              <hr className="my-4"/>
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SA ID or Passport Number (for verification)</label>
                <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Certification (PDF)</label>
                <input type="file" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
              </div>
            </>
          )}

          <Button type="submit" className="w-full mt-6" size="lg">Create Account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="font-medium text-primary hover:text-primary-hover">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
