import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';

export const RoleSelectionModal = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState('donor');
  const { user } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already has a role when modal opens
    if (isOpen && user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress;
      
      // Check email_role_map for existing role
      const emailRoleMap = JSON.parse(localStorage.getItem('email_role_map') || '{}');
      const existingRole = emailRoleMap[email];

      if (existingRole) {
        console.log('Existing role found:', { email, role: existingRole });
        // Redirect to the appropriate dashboard
        navigate(`/dashboard/${existingRole}`);
        if (onClose) onClose(); // Close the modal if it's open
      }
    }
  }, [isOpen, user, navigate, onClose]);

  const handleRoleSubmit = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        console.error('No email address found');
        return;
      }

      const email = user.primaryEmailAddress.emailAddress;

      // Get existing email-role map
      const emailRoleMap = JSON.parse(
        localStorage.getItem('email_role_map') || '{}'
      );

      // Check if email already has a role
      if (emailRoleMap[email]) {
        // Redirect to existing role's dashboard
        navigate(`/dashboard/${emailRoleMap[email]}`);
        return;
      }

      // Update user metadata with selected role
      await user.update({
        unsafeMetadata: {
          role: selectedRole,
        },
      });

      // Update email-role map
      emailRoleMap[email] = selectedRole;
      localStorage.setItem('email_role_map', JSON.stringify(emailRoleMap));

      console.log('Role mapping saved:', { email, role: selectedRole });

      // Navigate to appropriate dashboard
      navigate(`/dashboard/${selectedRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  // Don't render if not open or if user already has a role
  if (!isOpen || (user?.primaryEmailAddress?.emailAddress && 
      JSON.parse(localStorage.getItem('email_role_map') || '{}')[user.primaryEmailAddress.emailAddress])) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
        <div className="space-y-4">
          <label className="block">
            <input
              type="radio"
              value="donor"
              checked={selectedRole === 'donor'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mr-2"
            />
            Donor
          </label>
          <label className="block">
            <input
              type="radio"
              value="institute"
              checked={selectedRole === 'institute'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mr-2"
            />
            Institute
          </label>
          <label className="block">
            <input
              type="radio"
              value="shopkeeper"
              checked={selectedRole === 'shopkeeper'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mr-2"
            />
            Shopkeeper
          </label>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleRoleSubmit}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
          >
            Confirm Role
          </button>
        </div>
      </div>
    </div>
  );
}; 