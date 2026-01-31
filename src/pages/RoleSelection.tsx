import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Users, Building2, Store, ArrowRight, Heart } from 'lucide-react';
import { storage } from '../utils/storage';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Wait for user data to be loaded
      if (!isLoaded) return;

      // If not signed in, redirect to sign in
      if (!isSignedIn) {
        navigate('/sign-in');
        return;
      }

      // Check for user email
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        setIsLoading(false);
        return;
      }

      try {
        // Check email_role_map for existing role
        const emailRoleMap = JSON.parse(localStorage.getItem('email_role_map') || '{}');
        const existingRole = emailRoleMap[email];

        if (existingRole) {
          console.log('Existing role found, redirecting:', { email, role: existingRole });
          navigate(`/dashboard/${existingRole}`);
        } else {
          // No existing role, show role selection
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking role:', error);
        setIsLoading(false);
      }
    };

    checkAndRedirect();
  }, [user, isSignedIn, isLoaded, navigate]);

  const handleRoleSelect = async (role: string) => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      
      if (!email) {
        console.error('No email address found for user');
        return;
      }

      setSelectedRole(role);

      // Get existing email-role map
      const emailRoleMap = JSON.parse(
        localStorage.getItem('email_role_map') || '{}'
      );

      // Update the map with new email-role pair
      const updatedMap = {
        ...emailRoleMap,
        [email]: role
      };

      // Save updated map back to localStorage
      localStorage.setItem('email_role_map', JSON.stringify(updatedMap));

      console.log('Role mapping saved:', { email, role, emailRoleMap: updatedMap });

      // Update user metadata with selected role
      await user.update({
        unsafeMetadata: {
          role: role,
        },
      });

      // Navigate to appropriate dashboard
      navigate(`/dashboard/${role}`);
    } catch (error) {
      console.error('Error in handleRoleSelect:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not signed in, redirect to sign in
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
        <div className="flex items-center mb-8">
          <Heart className="h-8 w-8 text-rose-600" />
          <span className="ml-3 text-xl font-bold text-gray-900">HopeBridge</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Role</h2>
        <p className="text-gray-600 mb-6">Please select your role to continue</p>
        
        <div className="space-y-3">
          <RoleCard
            Icon={Users}
            title="Donor"
            description="Support causes you care about"
            onClick={() => handleRoleSelect('donor')}
            isSelected={selectedRole === 'donor'}
          />
          <RoleCard
            Icon={Building2}
            title="Institute"
            description="Register your organization"
            onClick={() => handleRoleSelect('institute')}
            isSelected={selectedRole === 'institute'}
          />
          <RoleCard
            Icon={Store}
            title="Shopkeeper"
            description="Partner with us"
            onClick={() => handleRoleSelect('shopkeeper')}
            isSelected={selectedRole === 'shopkeeper'}
          />
        </div>
      </div>
    </div>
  );
};

interface RoleCardProps {
  Icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  isSelected: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({ Icon, title, description, onClick, isSelected }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md group
      ${isSelected 
        ? 'border-rose-500 ring-2 ring-rose-500 ring-opacity-50' 
        : 'border-gray-100 hover:border-rose-100'}`}
  >
    <div className={`flex-shrink-0 p-2 rounded-lg transition-colors duration-200
      ${isSelected ? 'bg-rose-100' : 'bg-rose-50 group-hover:bg-rose-100'}`}>
      <Icon className="w-5 h-5 text-rose-600" />
    </div>
    <div className="ml-3 text-left">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <ArrowRight className={`w-4 h-4 ml-auto transition-colors duration-200
      ${isSelected ? 'text-rose-600' : 'text-gray-400 group-hover:text-rose-600'}`} />
  </button>
);

export default RoleSelection; 