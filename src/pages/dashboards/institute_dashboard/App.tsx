import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RaiseRequest from './pages/RaiseRequest';
import MyRequests from './pages/MyRequests';
import ConfirmDelivery from './pages/ConfirmDelivery';
import History from './pages/History';
import Profile from './pages/Profile';
import { useUser } from '@clerk/clerk-react';
import './index.css';

const InstituteDashboardApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, isLoaded } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.publicMetadata?.role || user.unsafeMetadata?.role;
      if (userRole === 'institute') {
        setIsAuthenticated(true);
        // Check if institute data exists in localStorage
        const instituteData = localStorage.getItem('institute_data');
        setIsRegistered(!!instituteData);
      }
      setIsCheckingRegistration(false);
    }
  }, [isLoaded, user]);

  const handleRegistrationComplete = () => {
    setIsRegistered(true);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (!isLoaded || isCheckingRegistration) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You need to be authenticated as an institute to access this dashboard.
            </p>
            <a
              href="/dashboard"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Back to Dashboard Selection
            </a>
          </div>
        </div>
      );
    }

    // Show registration form if not registered
    if (!isRegistered) {
      return <Register onLogin={handleRegistrationComplete} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'raise-request':
        return <RaiseRequest />;
      case 'my-requests':
        return <MyRequests />;
      case 'confirm-delivery':
        return <ConfirmDelivery />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider 
      setCurrentPage={setCurrentPage} 
      isAuthenticated={isAuthenticated} 
      setIsAuthenticated={setIsAuthenticated}
    >
      {isAuthenticated && isRegistered ? (
        <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
          {renderPage()}
        </Layout>
      ) : (
        renderPage()
      )}
    </AuthProvider>
  );
};

export default InstituteDashboardApp;