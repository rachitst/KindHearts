import React, { useState } from 'react';
import { Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onNotificationClick, 
  onProfileClick 
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white shadow-sm px-4 lg:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 min-w-0 lg:max-w-xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        
        <div className="flex items-center justify-between lg:justify-end space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              className="relative p-2 rounded-full hover:bg-gray-100"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-800">New donation request received</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                ))}
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile */}
          <div className="relative">
            <button 
              className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <span className="font-medium hidden sm:inline">Admin User</span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <User size={16} className="mr-2" />
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <Settings size={16} className="mr-2" />
                  Settings
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;