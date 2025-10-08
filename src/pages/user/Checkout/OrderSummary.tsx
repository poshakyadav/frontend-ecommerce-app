// OrderSummary.tsx (Updated full code)

import React, { useState } from 'react';
import type { OrderSummaryItem } from '../../../services/types';

interface OrderSummaryProps {
  items: OrderSummaryItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items }) => {
  console.log('Rendering OrderSummary with items:', items);

  if (!items || items.length === 0) {
    console.warn('No items provided to OrderSummary');
    return <p className="text-gray-500">No items to order</p>;
  }

  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);

  const toggleItemDetails = (itemId: number) => {
    console.log('Toggling details for item ID:', itemId);
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
  };

  const ItemDetails = ({ item }: { item: OrderSummaryItem }) => {
    const perUnitBasePrice = item.basePrice;
    const perUnitDiscount = item.discount ? perUnitBasePrice * item.discount : 0;
    const perUnitDiscountedPrice = perUnitBasePrice - perUnitDiscount;
    const perUnitTaxAmount = item.taxRate ? perUnitDiscountedPrice * item.taxRate : 0;
    const perUnitFinalPrice = perUnitDiscountedPrice + perUnitTaxAmount;

    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h4 className="text-md font-semibold text-gray-800 mb-2">Item Details</h4>
        <div className="space-y-1 text-sm text-gray-700">
          <p>Base Price (per unit): ₹{perUnitBasePrice.toFixed(2)}</p>
          {item.discount && (
            <p>Discount ({(item.discount * 100).toFixed(0)}%): -₹{perUnitDiscount.toFixed(2)}</p>
          )}
          <p>Discounted Price (per unit): ₹{perUnitDiscountedPrice.toFixed(2)}</p>
          {item.taxRate && (
            <p>Tax ({(item.taxRate * 100).toFixed(0)}%): ₹{perUnitTaxAmount.toFixed(2)}</p>
          )}
          <p>Final Price (per unit): ₹{perUnitFinalPrice.toFixed(2)}</p>
          <p>Quantity: {item.quantity}</p>
          <p className="font-bold">Total for this item: ₹{(perUnitFinalPrice * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    );
  };

  const totalBasePrice = items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
  const totalDiscountAmount = items.reduce((sum, item) => sum + item.discountAmount, 0);
  const totalTaxAmount = items.reduce((sum, item) => sum + item.taxAmount, 0);
  const totalFinalPrice = items.reduce((sum, item) => sum + item.finalPrice, 0);

  console.log('Calculated totals:', { totalBasePrice, totalDiscountAmount, totalTaxAmount, totalFinalPrice });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
      {items.map((item) => (
        <div key={item.id} className="py-4 border-b">
          <div className="flex items-center">
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="w-20 h-20 object-cover rounded-md"
              onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/80')}
            />
            <div className="ml-4 flex-grow">
              <h3 className="text-lg font-medium text-gray-800">{item.productName}</h3>
              <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
              <p className="text-gray-600">Qty: {item.quantity}</p>
              <p className="text-lg font-bold text-gray-900">₹{item.finalPrice.toFixed(2)}</p>
            </div>
            <button
              onClick={() => toggleItemDetails(item.id)}
              className="ml-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              {expandedItemId === item.id ? 'Hide Details' : 'View Details'}
            </button>
          </div>
          {expandedItemId === item.id && <ItemDetails item={item} />}
        </div>
      ))}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-gray-700">
          <p>Total Base Price:</p>
          <p>₹{totalBasePrice.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p>Total Discount Amount:</p>
          <p>-₹{totalDiscountAmount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-gray-700">
          <p>Total Tax Amount:</p>
          <p>₹{totalTaxAmount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-bold text-gray-900 mt-4">
          <p>Total Final Price:</p>
          <p>₹{totalFinalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;