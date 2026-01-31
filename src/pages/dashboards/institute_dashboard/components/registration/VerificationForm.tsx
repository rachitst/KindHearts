import React from 'react';
import { CheckCircle } from 'lucide-react';
import { InstituteDetails } from '../../types/institute';

interface VerificationFormProps {
  data: Partial<InstituteDetails>;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Verification Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-lg font-medium text-green-800 mb-2">
          Registration Details Verified Successfully
        </h3>
        <p className="text-green-600">
          Once you complete the registration, you will have immediate access to our dashboard.
          You can start raising donation requests and managing your institute's requirements.
        </p>
      </div>

      {/* Summary of Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-[#070530] text-white">
          <h3 className="text-lg font-medium">Registration Summary</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Institute Name</p>
                <p className="font-medium">{data.basicInfo?.instituteName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{data.basicInfo?.instituteType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{data.basicInfo?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year Established</p>
                <p className="font-medium">{data.basicInfo?.yearEstablished}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{data.contactInfo?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">
                  {data.contactInfo?.address}, {data.contactInfo?.city}, {data.contactInfo?.state}
                </p>
              </div>
            </div>
          </div>

          {/* Representative Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Representative Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{data.representative?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium">{data.representative?.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{data.representative?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{data.representative?.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
        <ul className="list-disc list-inside text-blue-600 space-y-2">
          <li>Click on "Complete Registration" to finish the process</li>
          <li>You will be automatically redirected to the dashboard</li>
          <li>Start exploring the features and raising donation requests</li>
        </ul>
      </div>
    </div>
  );
};

export default VerificationForm; 