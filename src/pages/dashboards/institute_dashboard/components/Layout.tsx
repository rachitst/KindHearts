import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  Send,
  ClipboardList,
  CheckSquare,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import Chatbot from "./chatbot/chatbot";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { user: clerkUser } = useUser();

  const navLinks = [
    { path: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    {
      path: "raise-request",
      label: "Raise Request",
      icon: <Send size={20} />,
    },
    {
      path: "my-requests",
      label: "My Requests",
      icon: <ClipboardList size={20} />,
    },
    {
      path: "confirm-delivery",
      label: "Confirm Delivery",
      icon: <CheckSquare size={20} />,
    },
    // { path: "history", label: "History", icon: <History size={20} /> },
    { path: "profile", label: "Profile", icon: <User size={20} /> },
  ];

  const isActiveRoute = (path: string) => currentPage === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`relative bg-[#070530] text-white transition-all duration-300 ease-in-out flex flex-col
        ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-white rounded-full p-1 text-[#070530] shadow-lg hover:bg-gray-100"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className="flex-1 p-4">
          {/* Institute Name */}
          <div className={`mb-8 ${isCollapsed ? "text-center" : ""}`}>
            {!isCollapsed ? (
              <h1 className="text-xl font-bold truncate">
                {user?.basicInfo?.instituteName}
              </h1>
            ) : (
              <h1 className="text-xl font-bold">
                {user?.basicInfo?.instituteName?.charAt(0)}
              </h1>
            )}
          </div>

          <nav className="space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => onPageChange(link.path)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors
                  ${
                    isActiveRoute(link.path)
                      ? "bg-white text-[#070530]"
                      : "hover:bg-white/10"
                  }`}
              >
                {link.icon}
                {!isCollapsed && <span className="ml-3">{link.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className={`p-4 border-t border-white/10 ${isCollapsed ? 'items-center' : ''}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <UserButton afterSignOutUrl="/sign-in" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {clerkUser?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-300 truncate">
                  {clerkUser?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default Layout;
