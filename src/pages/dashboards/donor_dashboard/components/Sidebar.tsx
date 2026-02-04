import React, { useState, useEffect } from "react";
import { Heart, Menu, X } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  activeTab,
  setActiveTab,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Heart size={24} className="text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">
                KindHearts
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay - Move it before the sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Increase z-index */}
      <div
        id="sidebar"
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "fixed inset-y-0 left-0 w-64 z-50"
        } bg-white border-r border-gray-200 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart size={24} className="text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">KindHearts</h1>
            </div>
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-600" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Empowering Change Together
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <ul className="px-3">
            {navItems.map((item) => (
              <li key={item.id} className="mb-1">
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Help Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-medium text-indigo-700 mb-1">Need Help?</h3>
            <p className="text-sm text-indigo-600 mb-2">
              Contact our support team for assistance with your donations.
            </p>
            <button onClick={() => { window.location.href = 'mailto:support@donorconnect.org?subject=Donation%20Support%20Request&body=Hi%20Support%2C%0A%0AI%20need%20assistance%20with%20my%20donation.%20Details%3A%0A-%20Issue%3A%20%0A-%20Transaction%20ID%3A%20%0A-%20Date%3A%20%0A%0AThanks%2C'; }} className="w-full py-2 px-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
