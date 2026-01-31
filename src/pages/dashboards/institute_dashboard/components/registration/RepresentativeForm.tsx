import React from 'react';
import { InstituteDetails } from '../../types/institute';

interface RepresentativeFormProps {
  data: Partial<InstituteDetails>;
  onChange: (data: Partial<InstituteDetails>) => void;
}

const RepresentativeForm: React.FC<RepresentativeFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      representative: {
        ...data.representative,
        [name]: value
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          representative: {
            ...data.representative,
            [name]: reader.result as string
          }
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Representative Name *
          </label>
          <input
            type="text"
            name="name"
            value={data.representative?.name || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation *
          </label>
          <input
            type="text"
            name="designation"
            value={data.representative?.designation || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={data.representative?.email || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={data.representative?.phone || ''}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Proof *
          </label>
          <input
            type="file"
            name="idProof"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>
      </div>
    </div>
  );
};

export default RepresentativeForm; 