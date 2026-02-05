import React from 'react';
import { Bell } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

interface HeaderProps {
  toggleNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleNotifications,
}) => {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-purple-100 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleNotifications}
              className="relative p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors duration-200"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-400 rounded-full"></span>
            </button>
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
      </div>
    </header>
  );
};

export default Header;
