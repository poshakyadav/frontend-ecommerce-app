import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { FiArrowRight, FiLoader } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { getCart, updateItemQuantity, removeItemFromCart } from '../../services/cartService';
import type { CartDTO } from '../../services/types';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated && user?.id) {
      setLoading(true);
      getCart(user.id)
        .then((data) => setCart(data))
        .catch((err) => console.error('Failed to load cart:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, isAuthenticated, user?.id]);

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1 || updatingItemId || !cart || !user?.id) return;
    setUpdatingItemId(cartItemId);
    const originalCart = { ...cart };
    try {
      const updatedItems = cart.items.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.finalPrice * newQuantity,
            }
          : item
      );
      const newTotalFinalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      setCart({ ...cart, items: updatedItems, totalFinalPrice: newTotalFinalPrice });
      const updatedCart = await updateItemQuantity(cartItemId, newQuantity, user.id);
      setCart(updatedCart);
    } catch (error) {
      setCart(originalCart);
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (updatingItemId || !cart || !user?.id) return;
    setUpdatingItemId(cartItemId);
    const originalCart = { ...cart };
    const newItems = cart.items.filter((i) => i.id !== cartItemId);
    setCart({ ...cart, items: newItems });
    try {
      await removeItemFromCart(cartItemId, user.id);
    } catch (error) {
      setCart(originalCart);
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="absolute text-center -right-30 z-50 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-700">Please log in to view your cart.</p>
        <button
          onClick={() => {
            onClose();
            navigate('/login');
          }}
          className="mt-2 w-full bg-blue-700 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-800"
        >
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="absolute text-center -right-20 z-50 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-200 flex justify-center">
        <FiLoader className="animate-spin text-2xl text-indigo-600" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="absolute text-center -right-20 z-50 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <p className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-blue-600 dark:text-blue-500">Your cart is empty.</p>
        <Link
          to="/"
          onClick={onClose}
          className="mt-2 inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
        >
          Continue shopping
          <FiArrowRight />
        </Link>
        
      </div>
    );
  }

  return (
    <div className="absolute text-center -right-20 z-50 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      
      <h3 className="text-lg text-center font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">Your shopping cart</h3>

      {/* <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-200"></hr> */}
      
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 relative p-2">
            {updatingItemId === item.id && (
              <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
                <FiLoader className="animate-spin text-xl text-indigo-500" />
              </div>
            )}
            <img
              src={item.variant.imageUrls[0] || 'https://via.placeholder.com/50'}
              alt={item.variant.productName}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">{item.variant.productName}</p>
              <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
              <p className="text-sm font-semibold text-gray-900">₹{item.finalPrice.toFixed(2)}</p>
            </div>
            <div className="flex items-center border border-gray-200 rounded">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                disabled={item.quantity <= 1 || updatingItemId === item.id}
              >
                <FaMinus size={12} />
              </button>
              <span className="px-2 text-sm">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                disabled={updatingItemId === item.id}
              >
                <FaPlus size={12} />
              </button>
            </div>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50"
              disabled={updatingItemId === item.id}
            >
              <FaTrash size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-sm font-semibold text-gray-800">
          Total: ₹{cart.totalFinalPrice.toFixed(2)}
        </p>
        <Link
          to="/cart"
          onClick={onClose}
          className="block mt-2 w-full bg-indigo-600 text-white rounded-lg py-2 text-center text-sm font-medium hover:bg-indigo-700"
        >
          See Your Cart
        </Link>
      </div>
    </div>
  );
};

export default CartDropdown;