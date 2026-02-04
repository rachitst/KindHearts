import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { config } from '../../../../config/env';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  registerAndLogin: (instituteData: any) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
  setCurrentPage: (page: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  setCurrentPage, 
  isAuthenticated, 
  setIsAuthenticated 
}) => {
  const [user, setUser] = useState<any | null>(null);
  const { user: clerkUser, isLoaded } = useUser();

  useEffect(() => {
    const fetchInstituteProfile = async () => {
      if (!isLoaded) return;
      
      if (clerkUser?.primaryEmailAddress?.emailAddress) {
        try {
          const response = await axios.get(`${config.apiBaseUrl}${config.apiEndpoints.instituteProfile}/${clerkUser.primaryEmailAddress.emailAddress}`);
          if (response.data.success && response.data.profile) {
             const institute = response.data.profile;
             setUser(institute);
             setIsAuthenticated(true);
             setCurrentPage('dashboard');
          } else {
             // Not registered as institute yet
             setCurrentPage('register');
          }
        } catch (err) {
          console.error("Error fetching institute profile:", err);
          setCurrentPage('register');
        }
      }
    };
    fetchInstituteProfile();
  }, [isLoaded, clerkUser, setCurrentPage, setIsAuthenticated]);

  const registerAndLogin = (instituteData: any) => {
    setUser(instituteData);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('register');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, registerAndLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 