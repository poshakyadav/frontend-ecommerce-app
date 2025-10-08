import React from 'react';
import { FiEdit } from 'react-icons/fi';

interface ContactInformationDisplayProps {
  contactPhone: string;
  alternativePhone: string;
  onEdit: () => void;
}

const ContactInformationDisplay: React.FC<ContactInformationDisplayProps> = ({
  contactPhone,
  alternativePhone,
  onEdit,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-[1.01] duration-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
      <p className="text-gray-700">Contact Phone: <span className="font-medium">{contactPhone}</span></p>
      {alternativePhone && (
        <p className="text-gray-700">Alternative Phone: <span className="font-medium">{alternativePhone}</span></p>
      )}
      <button
        onClick={onEdit}
        className="mt-4 text-indigo-600 hover:text-indigo-800 flex items-center transition-colors duration-200"
      >
        <FiEdit className="mr-2" /> Edit Contact Information
      </button>
    </div>
  );
};

export default ContactInformationDisplay;