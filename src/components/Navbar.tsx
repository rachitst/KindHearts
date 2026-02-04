import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { Menu, X, Heart, LogOut } from 'lucide-react';
import { storage } from '../utils/storage';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    storage.clearUserData();
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Heart className="h-8 w-8 text-rose-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">HopeBridge </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Home
            </Link>
            <Link to="/#how-it-works" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              How It Works
            </Link>
            <Link to="/#impact" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Impact
            </Link>
            
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Hello, {user?.firstName || 'User'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/sign-in"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/#how-it-works"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={toggleMenu}
            >
              How It Works
            </Link>
            <Link
              to="/#impact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Impact
            </Link>
            
            {isSignedIn ? (
              <>
                <span className="block px-3 py-2 text-base font-medium text-gray-700">
                  Hello, {user?.firstName || 'User'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-rose-600 hover:bg-rose-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-rose-600 hover:bg-rose-700"
                  onClick={toggleMenu}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;