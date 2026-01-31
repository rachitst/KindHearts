import React from 'react';
import { InstituteDetails } from '../../types/institute';

interface LegalInfoFormProps {
  data: Partial<InstituteDetails>;
  onChange: (data: Partial<InstituteDetails>) => void;
}

const LegalInfoForm: React.FC<LegalInfoFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      legalInfo: {
        ...data.legalInfo,
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
          documents: {
            ...data.documents,
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
            Registration Number *
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={data.legalInfo?.registrationNumber || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Date *
          </label>
          <input
            type="date"
            name="registrationDate"
            value={data.legalInfo?.registrationDate || ''}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Authority *
          </label>
          <input
            type="text"
            name="registrationAuthority"
            value={data.legalInfo?.registrationAuthority || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax Identification Number *
          </label>
          <input
            type="text"
            name="taxIdentificationNumber"
            value={data.legalInfo?.taxIdentificationNumber || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Certificate *
          </label>
          <input
            type="file"
            name="registrationCertificate"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0f0b52] focus:border-[#0f0b52]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax Certificate *
          </label>
          <input
            type="file"
            name="taxCertificate"
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

export default LegalInfoForm; 