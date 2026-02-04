import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper; 