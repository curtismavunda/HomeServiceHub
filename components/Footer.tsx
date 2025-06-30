
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Home Services Hub</h3>
            <p className="text-gray-400">Your one-stop solution for reliable home services.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/categories" className="text-gray-400 hover:text-white">Categories</Link></li>
              <li><Link to="/map" className="text-gray-400 hover:text-white">Map View</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-white">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">For Users</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-400 hover:text-white">Customer Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white">Provider Registration</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter fa-lg"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram fa-lg"></i></a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 border-t border-gray-700 pt-6 mt-8">
          <p>&copy; {new Date().getFullYear()} Home Services Hub. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
