
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { User, UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock login logic
    let user: User | null = null;
    if (email.toLowerCase().includes('customer')) {
      user = { id: 'c1', name: 'John Customer', email, role: 'customer', location: { lat: -26.2041, lng: 28.0473 } };
    } else if (email.toLowerCase().includes('provider')) {
      user = { id: '1', name: 'Mike Miller', email, role: 'provider', location: { lat: -26.2041, lng: 28.0473 } };
    }

    if (user && password === 'password') { // Simple password check
      login(user);
      navigate(user.role === 'provider' ? '/provider-dashboard' : from, { replace: true });
    } else {
      setError('Invalid email or password. Use "customer@test.com" or "provider@test.com" with password "password".');
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-danger text-sm bg-red-100 p-3 rounded-md">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg">Login</Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="font-medium text-primary hover:text-primary-hover">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
