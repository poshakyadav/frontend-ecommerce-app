import React, { useState } from 'react';
import { FiEdit, FiPlus } from 'react-icons/fi';
import type { UserAddress } from '../../../services/types';
import EditAddressForm from './EditAddressForm';

interface SelectAddressFormProps {
  addresses: UserAddress[];
  selectedAddressId: number | null;
  onSelectAddress: (addressId: number) => void;
  onAddNewAddress: () => void;
  onEditAddress: (updatedAddress: UserAddress) => void;
  isChangingAddress?: boolean;
}

const SelectAddressForm: React.FC<SelectAddressFormProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
  onEditAddress,
  isChangingAddress = false,
}) => {
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [localSelectedAddressId, setLocalSelectedAddressId] = useState<number | null>(selectedAddressId);

  if (editingAddress) {
    return (
      <EditAddressForm
        address={editingAddress}
        onSave={(updated) => {
          console.log('Saving edited address:', updated);
          onEditAddress(updated);
          setEditingAddress(null);
        }}
        onCancel={() => {
          console.log('Cancel editing address');
          setEditingAddress(null);
        }}
      />
    );
  }

  const handleSelect = (id: number) => {
    console.log('Locally selecting address ID:', id);
    setLocalSelectedAddressId(id);
  };

  const handleDeliverHere = () => {
    if (localSelectedAddressId === null) {
      console.warn('No address selected to deliver');
      alert('Please select an address before proceeding');
      return;
    }
    console.log('Delivering to address ID:', localSelectedAddressId);
    onSelectAddress(localSelectedAddressId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Delivery Address</h2>
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses available. Please add a new address.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="flex items-center p-4 border rounded-lg">
              <input
                type="radio"
                name="address"
                checked={localSelectedAddressId === address.id}
                onChange={() => handleSelect(address.id)}
                className="mr-4"
              />
              <div className="flex-grow">
                <p className="font-medium">{address.address1}, {address.address2}</p>
                <p className="text-gray-600">{address.city}, {address.state}, {address.pincode}</p>
                <p className="text-gray-600">{address.country}</p>
              </div>
              <button
                onClick={() => {
                  console.log('Editing address:', address.id);
                  setEditingAddress(address);
                }}
                className="ml-4 text-indigo-600 hover:text-indigo-800"
              >
                <FiEdit />
              </button>
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => {
          console.log('Adding new address from select form');
          onAddNewAddress();
        }}
        className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center"
      >
        <FiPlus className="mr-2" /> Add New Address
      </button>
      <button
        onClick={handleDeliverHere}
        className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        disabled={localSelectedAddressId === null}
      >
        {isChangingAddress ? 'Deliver Here' : 'Continue'}
      </button>
    </div>
  );
};

export default SelectAddressForm;