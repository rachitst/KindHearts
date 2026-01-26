import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { user, isLoaded } = useUser();
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const location = useLocation();

  // Check for admin authentication
  const isAdminAuthenticated = localStorage.getItem('adminAuth') === 'true';
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Handle admin routes separately
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return <Navigate to="/" replace />;
    }
    // Directly return children without any wrapping for admin routes
    return children;
  }

  // For non-admin routes, proceed with Clerk authentication
  const updateUserRole = async () => {
    if (!user || isUpdatingRole) return;
    
    try {
      setIsUpdatingRole(true);
      await user.update({
        unsafeMetadata: {
          role: "shopkeeper"
        }
      });
      await user.reload();
      setIsMetadataLoaded(true);
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsMetadataLoaded(true);
      console.log('User Data:', {
        publicMetadata: user.publicMetadata,
        unsafeMetadata: user.unsafeMetadata
      });
    }
  }, [user]);

  // Loading state
  if (!isLoaded || !isMetadataLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading user data...</p>
      </div>
    );
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !user && !isAdminAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // Get user's role from either public or unsafe metadata
  const userRole = (user?.publicMetadata?.role || user?.unsafeMetadata?.role) as string | undefined;

  // If no role is set, show an error message with retry button
  if (requireAuth && !userRole && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Role Not Assigned</h1>
        <p className="text-gray-600 mb-4">
          Your account hasn't been assigned a role yet.
        </p>
        <pre className="bg-gray-100 p-4 rounded mb-4 text-left">
          Debug Info:
          {JSON.stringify({ metadata: user?.publicMetadata }, null, 2)}
        </pre>
        <div className="flex gap-4">
          <button
            onClick={updateUserRole}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={isUpdatingRole}
          >
            {isUpdatingRole ? 'Setting Role...' : 'Set Role as Shopkeeper'}
          </button>
          <button
            onClick={() => window.location.href = '/sign-in'}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // If roles are specified and user's role is not in allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || '') && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>
        <pre className="bg-gray-100 p-4 rounded mb-4 text-left">
          {JSON.stringify({
            currentRole: userRole,
            allowedRoles: allowedRoles,
            publicMetadata: user?.publicMetadata,
            unsafeMetadata: user?.unsafeMetadata
          }, null, 2)}
        </pre>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;