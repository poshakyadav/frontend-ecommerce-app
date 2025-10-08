import React from 'react';
import type { UserAddress } from '../../../services/types';

interface DeliveryAddressDisplayProps {
  addresses: UserAddress[];
  selectedAddressId: number | null;
  onChangeAddress: () => void;
}

const DeliveryAddressDisplay: React.FC<DeliveryAddressDisplayProps> = ({
  addresses,
  selectedAddressId,
  onChangeAddress,
}) => {
  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

  console.log('Rendering ShippingAddressDisplay:', { selectedAddressId, selectedAddress });

  if (!selectedAddress) {
    console.warn('No selected address found');
    return <p className="text-red-500">No address selected</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-[1.01] duration-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Address</h2>
      <p>{selectedAddress.address1}, {selectedAddress.address2}</p>
      <p>{selectedAddress.city}, {selectedAddress.state}, {selectedAddress.pincode}</p>
      <p>{selectedAddress.country}</p>
      <button
        onClick={() => {
          console.log('Changing address');
          onChangeAddress();
        }}
        className="mt-4 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
      >
        Change Address
      </button>
    </div>
  );
};

export default DeliveryAddressDisplay;