import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Heart, ShieldCheck, TrendingUp, Users, ShoppingBag, Building, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const LandingPage = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  // Add state for animated numbers
  const [donations, setDonations] = useState({
    food: 45230,
    medical: 32150,
    education: 28750
  });

  // Simulate increasing numbers
  useEffect(() => {
    const interval = setInterval(() => {
      setDonations(prev => ({
        food: prev.food + Math.floor(Math.random() * 100),
        medical: prev.medical + Math.floor(Math.random() * 80),
        education: prev.education + Math.floor(Math.random() * 60)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress;
      
      // Check email_role_map for existing role
      const emailRoleMap = JSON.parse(localStorage.getItem('email_role_map') || '{}');
      const userRole = emailRoleMap[email];

      if (userRole) {
        // If user has a role, redirect to their dashboard
        navigate(`/dashboard/${userRole}`);
      } else {
        // If no role found, redirect to role selection
        navigate('/dashboard');
      }
    } else {
      // If not signed in, redirect to sign up
      navigate('/sign-up');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Make a difference with</span>
                <span className="block text-rose-600">every donation</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                Connect donors directly with verified shops and institutions. Ensure your donations reach those who need them most, with full transparency and accountability.
              </p>
              <div className="mt-10 sm:flex">
                <div className="rounded-md shadow">
                  <button
                    onClick={handleGetStarted}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 transition-colors duration-200 md:py-4 md:text-lg md:px-10"
                  >
                    {isSignedIn ? 'Go to Dashboard' : 'Get Started'}
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/#how-it-works"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-rose-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:w-1/2">
              <img
                className="h-auto w-full object-cover rounded-lg shadow-xl"
                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="People donating goods"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-slate-50 overflow-hidden shadow-sm rounded-lg border border-slate-100">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-rose-100 rounded-md p-3">
                    <Heart className="h-6 w-6 text-rose-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Donations</dt>
                      <dd className="text-3xl font-semibold text-gray-900">$1.2M+</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">People Helped</dt>
                      <dd className="text-3xl font-semibold text-gray-900">50,000+</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Building className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Partner Institutions</dt>
                      <dd className="text-3xl font-semibold text-gray-900">120+</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Verified Shops</dt>
                      <dd className="text-3xl font-semibold text-gray-900">250+</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Our platform connects donors, institutions, and shops in a transparent ecosystem.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-500 text-white">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">1. Donate</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Choose an institution to support and make a secure donation through our platform. You can specify what items you'd like to donate.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-500 text-white">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">2. Institution Receives</h3>
                  <p className="mt-2 text-base text-gray-500">
                    The institution receives your donation and can use it to purchase needed items from verified shops on our platform.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-500 text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">3. Track Impact</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Follow your donation's journey and see the real impact it makes. Get updates from institutions about how your contribution helped.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trust & Security
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              We prioritize transparency and security at every step.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-rose-100">
                  <ShieldCheck className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Verified Partners</h3>
                <p className="mt-2 text-base text-center text-gray-500">
                  All institutions and shops on our platform undergo a rigorous verification process to ensure legitimacy.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-rose-100">
                  <TrendingUp className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Transparent Tracking</h3>
                <p className="mt-2 text-base text-center text-gray-500">
                  Follow your donation from start to finish with our real-time tracking system.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-rose-100">
                  <ShieldCheck className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Fraud Prevention</h3>
                <p className="mt-2 text-base text-center text-gray-500">
                  Our advanced security measures protect against fraud and ensure donations reach their intended recipients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Donation Tracker */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Live Donation Tracker
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Watch our impact grow in real-time
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-slate-100"
            >
              <div className="flex flex-col items-center">
                <Heart className="h-8 w-8 text-slate-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Food Donations</h3>
                <motion.span 
                  key={donations.food}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-slate-800 mt-2"
                >
                  ${donations.food.toLocaleString()}
                </motion.span>
                <p className="text-sm text-gray-500 mt-2">This month</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-slate-100"
            >
              <div className="flex flex-col items-center">
                <ShieldCheck className="h-8 w-8 text-slate-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Medical Supplies</h3>
                <motion.span
                  key={donations.medical}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-slate-800 mt-2"
                >
                  ${donations.medical.toLocaleString()}
                </motion.span>
                <p className="text-sm text-gray-500 mt-2">This month</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-slate-100"
            >
              <div className="flex flex-col items-center">
                <TrendingUp className="h-8 w-8 text-slate-700 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Education</h3>
                <motion.span
                  key={donations.education}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-slate-800 mt-2"
                >
                  ${donations.education.toLocaleString()}
                </motion.span>
                <p className="text-sm text-gray-500 mt-2">This month</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to make a difference?</span>
            <span className="block text-slate-300">Join our platform today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex rounded-md shadow"
            >
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-white hover:bg-slate-50 transition-colors duration-200"
              >
                {isSignedIn ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-rose-500" />
                <span className="ml-2 text-xl font-bold text-white">HopeBridge </span>
              </div>
              <p className="text-gray-300 text-base">
                Making donations transparent, secure, and impactful.
              </p>
              <div className="flex space-x-6">
                {/* Social media links would go here */}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Platform
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        How it works
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        For Donors
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        For Institutions
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        For Shops
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                    Support
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-400 hover:text-white">
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2025 HopeBridge . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;