import React, { useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import type { AddressInput } from '../../../services/types';

interface AddAddressFormProps {
  onAddressAdded: (newAddress: AddressInput) => void;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({ onAddressAdded }) => {
  const [newAddress, setNewAddress] = useState<AddressInput>({
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    type: 'HOME',
    isServiceable: true,
    serviceabilityMessage: '',
    isPrimary: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Updating ${name}: ${value}`);
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting new address:', newAddress);
    if (!newAddress.address1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      console.warn('Validation failed: Missing required fields');
      alert('Please fill in all required fields');
      return;
    }
    if (!/^\d{6}$/.test(newAddress.pincode)) {
      console.warn('Invalid pincode:', newAddress.pincode);
      alert('Pincode must be a 6-digit number');
      return;
    }
    onAddressAdded(newAddress);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiMapPin className="mr-2" /> Add New Address
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Address Line 1 <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="address1"
            value={newAddress.address1}
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
            value={newAddress.address2}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">City <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="city"
            value={newAddress.city}
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
            value={newAddress.state}
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
            value={newAddress.pincode}
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
            value={newAddress.country}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            disabled
          />
        </div>
        <div>
          <label className="block text-gray-700">Address Type</label>
          <select
            name="type"
            value={newAddress.type}
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
              checked={newAddress.isPrimary}
              onChange={(e) => setNewAddress({ ...newAddress, isPrimary: e.target.checked })}
              className="mr-2"
            />
            Set as Primary Address
          </label>
        </div>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
      >
        Save and Continue
      </button>
    </div>
  );
};

export default AddAddressForm;