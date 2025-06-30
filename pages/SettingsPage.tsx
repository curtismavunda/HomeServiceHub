
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to view settings.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings saved successfully! (This is a mock action)");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Account Settings</h1>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              defaultValue={user.name}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              defaultValue={user.email}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
            />
             <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
          </div>
          <Button type="submit" className="mt-4">Save Profile</Button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg mt-8">
        <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <Button type="submit" className="mt-4">Update Password</Button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
