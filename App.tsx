
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServiceCategoriesPage from './pages/ServiceCategoriesPage';
import ServiceProviderProfilePage from './pages/ServiceProviderProfilePage';
import MapViewPage from './pages/MapViewPage';
import BookingPage from './pages/BookingPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import ServiceProviderDashboardPage from './pages/ServiceProviderDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import SupportPage from './pages/SupportPage';
import ChatPage from './pages/ChatPage';
import SmartMatchPage from './pages/SmartMatchPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProviderResourcesPage from './pages/ProviderResourcesPage';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-light">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<ServiceCategoriesPage />} />
              <Route path="/provider/:id" element={<ServiceProviderProfilePage />} />
              <Route path="/map" element={<MapViewPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/smart-match" element={<SmartMatchPage />} />

              {/* Protected Routes */}
              <Route path="/book/:providerId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboardPage /></ProtectedRoute>} />
              <Route path="/provider-dashboard" element={<ProtectedRoute requiredRole="provider"><ServiceProviderDashboardPage /></ProtectedRoute>} />
              <Route path="/provider-resources" element={<ProtectedRoute requiredRole="provider"><ProviderResourcesPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/chat/:bookingId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;