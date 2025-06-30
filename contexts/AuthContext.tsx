
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockCustomer: User = {
    id: 'c1', name: 'John Customer', email: 'john@customer.com', role: 'customer',
    location: { lat: -26.2041, lng: 28.0473 }
};
const mockProvider: User = {
    id: 'p1', name: 'Mike Miller', email: 'mike@provider.com', role: 'provider',
    location: { lat: -26.2041, lng: 28.0473 }
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userToLogin: User) => {
    // In a real app, you'd verify credentials. Here we just set the user.
    setUser(userToLogin);
  };
  
  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
