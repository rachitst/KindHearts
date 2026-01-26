import React, { useEffect } from 'react';
import { SignIn as ClerkSignIn, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, Clock, Users } from 'lucide-react';
import { storage } from '../utils/storage';

const SignIn = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSignInComplete = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress;
      
      // Get role from email_role_map in localStorage
      const emailRoleMap = JSON.parse(localStorage.getItem('email_role_map') || '{}');
      const userRole = emailRoleMap[email];

      if (userRole) {
        console.log('Found role for user:', { email, role: userRole });
        // Navigate to the appropriate dashboard
        navigate(`/dashboard/${userRole}`);
      } else {
        // If no role found, redirect to role selection
        navigate('/dashboard');
      }
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
              Welcome Back!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Continue your journey of making a difference in people's lives.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <TrustIndicator 
                Icon={ShieldCheck} 
                value="100%" 
                label="Secure"
              />
              <TrustIndicator 
                Icon={Clock} 
                value="24/7" 
                label="Support"
              />
              <TrustIndicator 
                Icon={Users} 
                value="1M+" 
                label="Users"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Sign In Form */}
        <div className="lg:w-1/2 flex items-center justify-center px-4 py-8 lg:px-16 bg-white/30 backdrop-blur-sm">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
                <p className="text-gray-600 mt-1">Please sign in to your account</p>
              </div>

              <ClerkSignIn 
                appearance={{
                  layout: {
                    socialButtonsPlacement: "bottom",
                    socialButtonsVariant: "iconButton",
                    termsPageUrl: "https://your-terms-page",
                    privacyPageUrl: "https://your-privacy-page",
                    shimmer: true,
                  },
                  elements: {
                    formButtonPrimary: 
                      "w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200",
                    formFieldInput: 
                      "w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors duration-200",
                    formFieldLabel: "text-gray-700 font-medium text-sm mb-1",
                    card: "bg-transparent shadow-none p-0 m-0",
                    header: "hidden",
                    footer: "hidden",
                    dividerLine: "bg-gray-200",
                    dividerText: "text-gray-500 bg-white px-2 text-sm",
                    socialButtonsIconButton: 
                      "flex-1 flex justify-center items-center p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200",
                    socialButtonsBlockButton: 
                      "w-full flex justify-center items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200",
                    socialButtons: "flex gap-2 mt-3",
                    formField: "mb-3",
                    form: "w-full space-y-3",
                    main: "w-full",
                    rootBox: "w-full",
                    alert: "text-sm p-3 rounded-lg",
                    identityPreviewText: "text-sm",
                    formFieldHintText: "text-xs mt-1",
                    formFieldErrorText: "text-xs mt-1 text-red-500",
                    otpCodeFieldInput: "w-12 h-12 text-center border rounded-lg mx-1",
                  },
                }}
                redirectUrl="/dashboard"
                afterSignInUrl="/dashboard"
                onSignInComplete={handleSignInComplete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrustIndicator = ({ Icon, value, label }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center">
    <Icon className="w-5 h-5 text-rose-600 mx-auto mb-1.5" />
    <span className="block text-lg font-bold text-gray-900">{value}</span>
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

export default SignIn;