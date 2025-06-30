
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import { getNotificationsForUser, markNotificationsAsRead } from '../services/dataService';
import { Notification } from '../types';


const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const userNotifications = await getNotificationsForUser(user.id);
        setNotifications(userNotifications);
      }
    };
    if (isAuthenticated) {
      fetchNotifications();
    } else {
        setNotifications([]);
    }
  }, [user, isAuthenticated]);
  
  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-primary text-white' : 'text-dark hover:bg-gray-200'
    }`;
  
  const handleNotificationClick = async () => {
    setIsDropdownOpen(prev => !prev);
    if (!isDropdownOpen && unreadCount > 0 && user) {
      // Mark as read when opening dropdown
      await markNotificationsAsRead(user.id);
      const updatedNotifications = await getNotificationsForUser(user.id);
      setNotifications(updatedNotifications);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-primary text-2xl font-bold flex items-center">
              <i className="fas fa-home mr-2"></i>
              HomeServices
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/categories" className={navLinkClass}>Categories</NavLink>
            <NavLink to="/map" className={navLinkClass}>Map View</NavLink>
            {isAuthenticated && (
                <NavLink 
                    to={user?.role === 'provider' ? "/provider-dashboard" : "/dashboard"} 
                    className={navLinkClass}
                >
                    Dashboard
                </NavLink>
            )}
            <NavLink to="/support" className={navLinkClass}>Support</NavLink>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">Welcome, {user?.name.split(' ')[0]}</span>
                
                {/* Notifications Bell */}
                <div className="relative">
                    <button onClick={handleNotificationClick} className="text-gray-600 hover:text-primary text-xl focus:outline-none" aria-label="Notifications">
                        <i className="fas fa-bell"></i>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-danger text-white text-xs items-center justify-center">{unreadCount}</span>
                            </span>
                        )}
                    </button>
                    {isDropdownOpen && (
                        <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                            <div className="py-2 px-4 font-bold text-dark border-b">Notifications</div>
                            <div className="divide-y max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(n => (
                                    <Link to={n.link || '#'} key={n.id} className="block px-4 py-3 hover:bg-light" onClick={() => setIsDropdownOpen(false)}>
                                        <p className={`text-sm ${!n.read ? 'font-semibold text-dark' : 'text-gray-700'}`}>{n.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(n.date).toLocaleString()}</p>
                                    </Link>
                                )) : (
                                    <div className="p-4 text-center text-sm text-gray-500">You have no new notifications.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Link to="/settings"><i className="fas fa-cog text-gray-600 hover:text-primary text-xl"></i></Link>
                <Button onClick={handleLogout} variant="secondary" size="sm">Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
