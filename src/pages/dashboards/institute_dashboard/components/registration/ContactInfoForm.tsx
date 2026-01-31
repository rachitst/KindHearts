import React from 'react';
import { InstituteDetails } from '../../types/institute';

interface ContactInfoFormProps {
  data: Partial<InstituteDetails>;
  onChange: (data: Partial<InstituteDetails>) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      contactInfo: {
        ...data.contactInfo,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={data.contactInfo?.phone || ''}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alternate Phone
          </label>
          <input
            type="tel"
            name="alternatePhone"
            value={data.contactInfo?.alternatePhone || ''}
            onChange={handleChange}
            pattern="[0-9]{10}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <textarea
            name="address"
            value={data.contactInfo?.address || ''}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={data.contactInfo?.city || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={data.contactInfo?.state || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pincode *
          </label>
          <input
            type="text"
            name="pincode"
            value={data.contactInfo?.pincode || ''}
            onChange={handleChange}
            required
            pattern="[0-9]{6}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoForm; 