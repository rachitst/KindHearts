import React, { useState, useEffect } from 'react';
import { SignUp as ClerkSignUp, useUser } from '@clerk/clerk-react';
import { Heart, Users, Building2, Store, ArrowRight } from 'lucide-react';
import { storage } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Show role dialog when user completes signup
    if (isSignedIn && user) {
      setShowRoleDialog(true);
    }
  }, [isSignedIn]);

  const handleSignUpComplete = () => {
    // After signup, redirect to the role selection page
    navigate('/dashboard');
  };

  const handleRoleSelect = async (role: string) => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      
      if (!email) {
        console.error('No email address found for user');
        return;
      }

      setSelectedRole(role);

      // Get existing email-role map from localStorage
      const existingMap = JSON.parse(
        localStorage.getItem('email_role_map') || '{}'
      );

      // Update the map with new email-role pair
      const updatedMap = {
        ...existingMap,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-50">
      {/* Main Container */}
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - Branding & Info */}
        <div className="lg:w-1/2 flex flex-col justify-center px-4 py-8 lg:px-16">
          <div className="max-w-lg mx-auto w-full">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <Heart className="h-10 w-10 text-rose-600" />
              <span className="ml-3 text-2xl font-bold text-gray-900">HopeBridge</span>
            </div>

            {/* Welcome Text */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Be part of something bigger. Start making a difference today.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-3 gap-3">
              <ImpactStat value="10k+" label="Donations" />
              <ImpactStat value="500+" label="Organizations" />
              <ImpactStat value="50k+" label="Lives Impacted" />
            </div>
          </div>
        </div>

        {/* Right Section - Sign Up Form */}
        <div className="lg:w-1/2 flex items-center justify-center px-4 py-8 lg:px-16 bg-white/30 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-600 mt-1">Join us today</p>
              </div>

              <ClerkSignUp 
                appearance={{
                  layout: {
                    socialButtonsPlacement: "bottom",
                    socialButtonsVariant: "iconButton",
                    shimmer: true,
                  },
                  elements: {
                    formButtonPrimary: 
                      "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200",
                    formFieldInput: 
                      "w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors duration-200",
                    formFieldLabel: "text-gray-700 font-medium text-sm mb-0.5",
                    card: "bg-transparent shadow-none p-0 m-0",
                    header: "hidden",
                    footer: "hidden",
                    dividerLine: "bg-gray-200",
                    dividerText: "text-gray-500 bg-white px-2 text-xs",
                    socialButtonsIconButton: 
                      "flex-1 flex justify-center items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200",
                    socialButtonsBlockButton: 
                      "w-full flex justify-center items-center px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200",
                    socialButtons: "flex gap-2 mt-2",
                    formField: "mb-2",
                    form: "w-full space-y-2",
                    main: "w-full",
                    rootBox: "w-full",
                    alert: "text-xs p-2 rounded-md",
                    identityPreviewText: "text-xs",
                    formFieldHintText: "text-xs mt-0.5",
                    formFieldErrorText: "text-xs mt-0.5 text-red-500",
                  },
                }}
                redirectUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Dialog */}
      {showRoleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
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
      )}
    </div>
  );
};

const RoleCard = ({ Icon, title, description, onClick, isSelected }) => (
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

const ImpactStat = ({ value, label }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
    <span className="block text-lg font-bold text-rose-600">{value}</span>
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

export default SignUp;