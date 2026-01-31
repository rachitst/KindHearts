import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Phone, MapPin, FileText, User, Calendar, Globe } from 'lucide-react';
import { InstituteDetails } from '../types/institute';

const Profile = () => {
  const [instituteData, setInstituteData] = useState<InstituteDetails | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('institute_data');
    if (savedData) {
      setInstituteData(JSON.parse(savedData));
    }
  }, []);

  if (!instituteData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Institute Profile</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{instituteData.basicInfo?.instituteName}</h2>
          <p className="text-gray-600">{instituteData.basicInfo?.instituteType}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-[#070530]" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">Email:</span>
                  <span>{instituteData.basicInfo?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-600">Established:</span>
                  <span>{instituteData.basicInfo?.yearEstablished}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-gray-400" />
                  <span className="text-gray-600">Website:</span>
                  <a href={instituteData.basicInfo?.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    {instituteData.basicInfo?.website || 'Not provided'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Phone size={20} className="text-[#070530]" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600">Phone:</span>
                  <span>{instituteData.contactInfo?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-600">Address:</span>
                  <span>{instituteData.contactInfo?.address}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">City:</span>
                  <p className="mt-1">{instituteData.contactInfo?.city}</p>
                </div>
                <div>
                  <span className="text-gray-600">State:</span>
                  <p className="mt-1">{instituteData.contactInfo?.state}</p>
                </div>
                <div>
                  <span className="text-gray-600">Pincode:</span>
                  <p className="mt-1">{instituteData.contactInfo?.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#070530]" />
              Legal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Registration Number:</span>
                <p className="mt-1">{instituteData.legalInfo?.registrationNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Registration Date:</span>
                <p className="mt-1">{instituteData.legalInfo?.registrationDate}</p>
              </div>
              <div>
                <span className="text-gray-600">Registration Authority:</span>
                <p className="mt-1">{instituteData.legalInfo?.registrationAuthority}</p>
              </div>
              <div>
                <span className="text-gray-600">Tax ID:</span>
                <p className="mt-1">{instituteData.legalInfo?.taxIdentificationNumber}</p>
              </div>
            </div>
          </div>

          {/* Representative Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <User size={20} className="text-[#070530]" />
              Representative Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="mt-1 font-medium">{instituteData.representative?.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Designation:</span>
                  <p className="mt-1 font-medium">{instituteData.representative?.designation}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="mt-1 font-medium">{instituteData.representative?.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="mt-1 font-medium">{instituteData.representative?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 