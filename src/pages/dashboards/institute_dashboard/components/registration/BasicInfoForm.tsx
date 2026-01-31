import React, { useState } from 'react';
import { InstituteDetails } from '../../types/institute';
import { Building2, Mail, Globe, Calendar, Upload, X } from 'lucide-react';

interface BasicInfoFormProps {
  data: Partial<InstituteDetails>;
  onChange: (data: Partial<InstituteDetails>) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      basicInfo: {
        ...data.basicInfo,
        [name]: value
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size should be less than 5MB');
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUploadError(null);

      onChange({
        basicInfo: {
          ...data.basicInfo,
          institutePhoto: file
        }
      });
    }
  };

  const removePhoto = () => {
    setPreviewUrl(null);
    onChange({
      basicInfo: {
        ...data.basicInfo,
        institutePhoto: null
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institute Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="instituteName"
              value={data.basicInfo?.instituteName || ''}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#070530] focus:border-[#070530]"
              placeholder="Enter institute name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institute Type *
          </label>
          <select
            name="instituteType"
            value={data.basicInfo?.instituteType || ''}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#070530] focus:border-[#070530]"
          >
            <option value="">Select Type</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
            <option value="Semi-Government">Semi-Government</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institute Photo *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Institute preview" 
                  className="max-h-32 rounded-md"
                />
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="institute-photo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#070530] hover:text-[#0d0940] focus-within:outline-none"
                  >
                    <span>Upload a photo</span>
                    <input
                      id="institute-photo"
                      name="institute-photo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </div>
          {uploadError && (
            <p className="mt-1 text-sm text-red-500">{uploadError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year Established *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="yearEstablished"
              value={data.basicInfo?.yearEstablished || ''}
              onChange={handleChange}
              required
              min="1800"
              max={new Date().getFullYear()}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#070530] focus:border-[#070530]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              name="website"
              value={data.basicInfo?.website || ''}
              onChange={handleChange}
              placeholder="https://"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#070530] focus:border-[#070530]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={data.basicInfo?.email || ''}
              onChange={handleChange}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#070530] focus:border-[#070530]"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={data.basicInfo?.password || ''}
            onChange={handleChange}
            required
            minLength={8}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#070530] focus:border-[#070530]"
            placeholder="Minimum 8 characters"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm; 