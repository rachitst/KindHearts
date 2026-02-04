import React from 'react';
import { 
  Bell, Search, Menu, Settings, HelpCircle
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
  toggleNotifications: () => void;
  isMobile: boolean;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  toggleSidebar,
  toggleNotifications,
}) => {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-purple-100 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 -ml-2 text-purple-600 hover:text-purple-800 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center ml-4">
              <h1 className="text-xl font-semibold text-purple-900">{title}</h1>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search donations, orders, users..."
                className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg
                bg-purple-50/50 focus:bg-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                text-sm transition-colors duration-200"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 
                rounded-lg transition-colors duration-200">
                <HelpCircle size={20} />
              </button>
              <button className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 
                rounded-lg transition-colors duration-200">
                <Settings size={20} />
              </button>
            </div>

            {/* Notifications */}
            <button
              onClick={toggleNotifications}
              className="relative p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 
              rounded-lg transition-colors duration-200"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative flex items-center">
              <div className="hidden md:block text-right mr-3">
                <p className="text-sm font-medium text-purple-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-purple-500">
                  {user?.publicMetadata?.role || user?.unsafeMetadata?.role || 'User'}
                </p>
              </div>
              <UserButton 
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    userButtonBox: "hover:opacity-80 transition-opacity",
                    userButtonTrigger: "rounded-full ring-2 ring-purple-100",
                    userButtonPopoverCard: "bg-white shadow-xl border border-purple-100"
                  }
                }}
                userProfileMode="navigation"
                userProfileUrl="/profile"
              />
            </div>
          </div>
        </div>

        {/* Mobile Search - Shown below header on mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-lg
              bg-purple-50/50 focus:bg-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
              text-sm transition-colors duration-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
