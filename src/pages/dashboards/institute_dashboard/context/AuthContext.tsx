import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const instituteData = localStorage.getItem('institute_data');
    if (isAuth === 'true' && instituteData) {
      const data = JSON.parse(instituteData);
      setUser(data);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    } else if (!isAuth) {
      setCurrentPage('register');
    }
  }, [setCurrentPage, setIsAuthenticated]);

  const registerAndLogin = (instituteData: any) => {
    localStorage.setItem('institute_data', JSON.stringify(instituteData));
    setUser(instituteData);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setCurrentPage('dashboard');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('institute_data');
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