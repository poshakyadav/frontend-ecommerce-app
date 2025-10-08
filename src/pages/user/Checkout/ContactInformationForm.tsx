import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

interface ContactInformationFormProps {
  contactPhone: string;
  setContactPhone: (phone: string) => void;
  alternativePhone: string;
  setAlternativePhone: (phone: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const ContactInformationForm: React.FC<ContactInformationFormProps> = ({
  contactPhone,
  setContactPhone,
  alternativePhone,
  setAlternativePhone,
  onSubmit,
  onBack,
}) => {
  const handleSubmit = () => {
    console.log('Contact info submitted:', { contactPhone, alternativePhone });
    onSubmit();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Contact Phone <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => {
              console.log('Contact phone updated:', e.target.value);
              setContactPhone(e.target.value);
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter 10-digit phone number"
            required
          />
          <p className="text-sm text-gray-500 mt-1">E.g., 9876543210 (starts with 6-9)</p>
        </div>
        <div>
          <label className="block text-gray-700">Alternative Phone (Optional)</label>
          <input
            type="tel"
            value={alternativePhone}
            onChange={(e) => {
              console.log('Alternative phone updated:', e.target.value);
              setAlternativePhone(e.target.value);
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter alternative phone number"
          />
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => {
            console.log('Going back to address step');
            onBack();
          }}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ContactInformationForm;