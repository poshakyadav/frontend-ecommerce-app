import React, { useState } from 'react';
import type { UserAddress } from '../../../services/types';

interface EditAddressFormProps {
  address: UserAddress;
  onSave: (updatedAddress: UserAddress) => void;
  onCancel: () => void;
}

const EditAddressForm: React.FC<EditAddressFormProps> = ({ address, onSave, onCancel }) => {
  const [updatedAddress, setUpdatedAddress] = useState<UserAddress>({ ...address });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Editing ${name}: ${value}`);
    setUpdatedAddress({ ...updatedAddress, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting edited address:', updatedAddress);
    if (!updatedAddress.address1 || !updatedAddress.city || !updatedAddress.state || !updatedAddress.pincode) {
      console.warn('Validation failed: Missing required fields');
      alert('Please fill in all required fields');
      return;
    }
    if (!/^\d{6}$/.test(updatedAddress.pincode)) {
      console.warn('Invalid pincode:', updatedAddress.pincode);
      alert('Pincode must be a 6-digit number');
      return;
    }
    onSave(updatedAddress);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Address</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Address Line 1 <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="address1"
            value={updatedAddress.address1}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Address Line 2</label>
          <input
            type="text"
            name="address2"
            value={updatedAddress.address2}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">City <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="city"
            value={updatedAddress.city}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">State <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="state"
            value={updatedAddress.state}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Pincode <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="pincode"
            value={updatedAddress.pincode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            value={updatedAddress.country}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled
          />
        </div>
        <div>
          <label className="block text-gray-700">Address Type</label>
          <select
            name="type"
            value={updatedAddress.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
          </select>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isPrimary"
              checked={updatedAddress.isPrimary}
              onChange={(e) => setUpdatedAddress({ ...updatedAddress, isPrimary: e.target.checked })}
              className="mr-2"
            />
            Set as Primary Address
          </label>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditAddressForm;