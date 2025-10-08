// OrderConfirmationPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../../../services/userOrderService';
import { FiCheckCircle } from 'react-icons/fi';
import type { OrderDTO } from '../../../services/types';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(Number(orderId));
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!order) return <div className="text-center py-16">Order not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <FiCheckCircle className="text-4xl text-green-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        </div>
        <p className="text-gray-600 text-center mb-6">Thank you for your order. Here are the details:</p>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Order Number:</span>
            <span>{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Payment Status:</span>
            <span>{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Fulfillment Status:</span>
            <span>{order.fulfillmentStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total:</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
          {order.shiprocketOrderId && (
            <div className="flex justify-between">
              <span className="font-semibold">Shipping ID:</span>
              <span>{order.shiprocketOrderId}</span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Items</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <span>{item.productName} (Size: {item.selectedSize}) x {item.quantity}</span>
              <span>₹{item.totalPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="mt-8 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;