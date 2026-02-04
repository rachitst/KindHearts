import React, { useState } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { 
  Home, 
  ShoppingBag, 
  Package, 
  Truck, 
  CreditCard, 
  Star, 
  LogOut, 
  Menu, 
  X,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { navigate, Route } from '../../store/slices/navigationSlice';
import { tourSteps } from '../Tour/TourSteps';
import { RootState } from '../../store';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItemProps {
  route: Route;
  icon: React.ElementType;
  label: string;
  isOpen: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ route, icon: Icon, label, isOpen }) => {
  const dispatch = useDispatch();
  const currentRoute = useSelector((state: RootState) => state.navigation.currentRoute);
  const isActive = currentRoute === route;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(navigate(route));
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={`
        flex items-center p-2 rounded-lg transition-colors
        ${isActive 
          ? 'bg-purple-600 text-white' 
          : 'text-gray-300 hover:bg-gray-800'
        }
        ${isOpen ? 'space-x-3' : 'justify-center'}
      `}
    >
      <Icon size={20} />
      {isOpen && <span>{label}</span>}
    </a>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const [runTour, setRunTour] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await dispatch(logout());
      
      // Clear all auth related data
      localStorage.clear();
      sessionStorage.clear();
      
      // Close the confirmation dialog
      setShowLogoutConfirm(false);
      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/sign-in';
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTour(false);
    }
  };

  return (
    <>
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            primaryColor: '#2563eb',
            zIndex: 1000,
          }
        }}
        callback={handleTourCallback}
      />

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 transform transition-all animate-fade-in">
            <div className="flex items-center gap-3 text-gray-800 mb-4">
              <AlertCircle className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold">Confirm Logout</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You'll need to login again to access your account.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-gray-900 transition-all duration-300 ease-in-out z-30
          ${isOpen ? 'w-64' : 'w-16'}
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {isOpen && (
            <h1 className="text-white font-semibold text-lg">Shop Dashboard</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          <NavItem route="dashboard" icon={Home} label="Dashboard" isOpen={isOpen} />
          <NavItem route="incoming-orders" icon={ShoppingBag} label="Incoming Orders" isOpen={isOpen} />
          <NavItem route="order-processing" icon={Package} label="Order Processing" isOpen={isOpen} />
          <NavItem route="delivery" icon={Truck} label="Delivery" isOpen={isOpen} />
          <NavItem route="payments" icon={CreditCard} label="Payments" isOpen={isOpen} />
          <NavItem route="feedback" icon={Star} label="Feedback" isOpen={isOpen} />
        </nav>
        
        <div className={`absolute bottom-0 w-full p-2 border-t border-gray-800 ${!isOpen && 'flex flex-col items-center'}`}>
          <button
            onClick={() => setRunTour(true)}
            className={`flex items-center w-full p-2 mb-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors
              ${isOpen ? 'space-x-3' : 'justify-center'}`}
          >
            <HelpCircle size={20} />
            {isOpen && <span>Start Tour</span>}
          </button>
          <button 
            onClick={handleLogoutClick}
            className={`flex items-center w-full p-2 rounded-lg text-gray-300 hover:bg-red-600/10 
              hover:text-red-500 transition-colors group
              ${isOpen ? 'space-x-3' : 'justify-center'}`}
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
