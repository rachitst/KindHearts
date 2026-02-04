import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationsPanel from './NotificationsPanel';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const { currentRoute } = useSelector((state: RootState) => state.navigation);
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (currentRoute) {
      case 'dashboard':
        return 'Dashboard';
      case 'incoming-orders':
        return 'Incoming Orders';
      case 'order-processing':
        return 'Order Processing';
      case 'delivery':
        return 'Delivery & Confirmation';
      case 'payments':
        return 'Payments & Earnings';
      case 'feedback':
        return 'Feedback & Quality Improvement';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className={`
        flex-1 flex flex-col min-h-screen relative
        ${isMobile ? 'w-full' : sidebarOpen ? 'ml-64' : 'ml-16'}
        transition-all duration-300 ease-in-out
      `}>
        <Header 
          title={getPageTitle()}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          toggleNotifications={() => setNotificationsPanelOpen(!notificationsPanelOpen)}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>

        <NotificationsPanel 
          isOpen={notificationsPanelOpen} 
          onClose={() => setNotificationsPanelOpen(false)} 
        />
      </div>
    </div>
  );
};

export default MainLayout;
