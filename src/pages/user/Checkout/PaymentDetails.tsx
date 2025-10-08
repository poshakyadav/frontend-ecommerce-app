import React from 'react';

interface PaymentDetailsProps {
  paymentMode: 'COD' | 'PREPAID';
  setPaymentMode: (mode: 'COD' | 'PREPAID') => void;
  onPlaceOrder: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ paymentMode, setPaymentMode, onPlaceOrder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as 'COD' | 'PREPAID';
    console.log('Payment mode changed to:', mode);
    setPaymentMode(mode);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Details</h2>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Payment Method</label>
        <select
          value={paymentMode}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="PREPAID">Prepaid (Razorpay)</option>
        </select>
      </div>
      <button
        onClick={() => {
          console.log('Placing order with payment mode:', paymentMode);
          onPlaceOrder();
        }}
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default PaymentDetails;