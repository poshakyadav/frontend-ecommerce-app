import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateItemQuantity, removeItemFromCart, clearCart } from '../../../services/cartService';
import type { CartDTO, CartItemDTO } from '../../../services/types';
import { useAuth } from '../../../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiLoader, FiGift, FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components ---

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
        <p className="mt-4 text-lg text-gray-700">Loading Your Cart...</p>
    </div>
);

const EmptyCart: React.FC = () => {
    const navigate = useNavigate();
    return (
        <motion.div 
            className="text-center py-16 px-4 bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <FiShoppingCart className="mx-auto h-20 w-20 text-gray-300" />
            <h2 className="mt-6 text-2xl font-semibold text-gray-800">Your cart is feeling a little lonely!</h2>
            <p className="mt-2 text-gray-500">Why not add some amazing products? We've got plenty to choose from.</p>
            <button
                onClick={() => navigate('/')}
                className="mt-8 inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
            >
                <FiArrowLeft />
                Continue Shopping
            </button>
        </motion.div>
    );
};

const CartItemCard: React.FC<{
    item: CartItemDTO;
    onQuantityChange: (itemId: number, quantity: number) => void;
    onRemoveItem: (itemId: number) => void;
    isUpdating: boolean;
}> = ({ item, onQuantityChange, onRemoveItem, isUpdating }) => {
    const perUnitDiscountedPrice = item.discount ? item.basePrice * (1 - item.discount) : item.basePrice;

    return (
        <div className={`relative flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-sm transition-shadow hover:shadow-md`}>
            <AnimatePresence>
                {isUpdating && (
                    <motion.div 
                        className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <FiLoader className="animate-spin text-2xl text-indigo-500" />
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="flex items-center flex-grow w-full">
                <img
                    src={item.variant.imageUrls[0] || 'https://via.placeholder.com/100'}
                    alt={item.variant.productName}
                    className="w-24 h-24 object-cover rounded-md"
                />
                <div className="ml-4 flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{item.variant.productName}</h3>
                    <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                    {item.discount && (
                        <span className="text-xs font-semibold bg-green-100 text-green-800 py-1 px-2 rounded-full">
                            {(item.discount * 100).toFixed(0)}% OFF
                        </span>
                    )}
                    <div className="mt-2 text-lg font-bold text-gray-900">
                        ₹{perUnitDiscountedPrice.toFixed(2)}
                        {item.discount && (
                            <s className="ml-2 text-sm font-normal text-gray-400">₹{item.basePrice.toFixed(2)}</s>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end mt-4 sm:mt-0 w-full sm:w-auto sm:space-x-6">
                <div className="flex items-center border border-gray-200 rounded-lg">
                    {item.quantity > 1 ? (
                         <button
                            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                            disabled={isUpdating}
                        >
                            <FiMinus />
                        </button>
                    ) : (
                        <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-l-lg transition-colors disabled:opacity-50"
                            aria-label="Remove item"
                            disabled={isUpdating}
                        >
                            <FiTrash2 />
                        </button>
                    )}
                   
                    <span className="px-5 py-1 font-semibold text-gray-800 border-x">{item.quantity}</span>
                    <button
                        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50"
                        aria-label="Increase quantity"
                        disabled={isUpdating}
                    >
                        <FiPlus />
                    </button>
                </div>
            </div>
        </div>
    );
};

const OrderSummary: React.FC<{
    totalBasePrice: number;
    totalPrice: number;
    totalDiscountAmount: number;
    totalItems: number;
    onClearCart: () => void;
    onCheckout: () => void;
}> = ({ totalBasePrice, totalPrice, totalDiscountAmount, totalItems, onClearCart, onCheckout }) => {
    const [confirmingClear, setConfirmingClear] = useState(false);

    const handleClearClick = () => {
        if (confirmingClear) {
            onClearCart();
            setConfirmingClear(false);
        } else {
            setConfirmingClear(true);
            setTimeout(() => setConfirmingClear(false), 3000);
        }
    };
    
    return (
        <div className="p-6 bg-white rounded-lg shadow-md lg:sticky lg:top-28">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">Order Summary</h2>
            <div className="space-y-4 my-4">
                <div className="flex justify-between text-gray-600">
                    <p>Subtotal ({totalItems} items)</p>
                    <p className="font-semibold text-gray-800">₹{totalBasePrice.toFixed(2)}</p>
                </div>
                {totalDiscountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                        <div className="flex items-center gap-2">
                            <FiGift />
                            <p>You're Saving</p>
                        </div>
                        <p className="font-semibold">-₹{totalDiscountAmount.toFixed(2)}</p>
                    </div>
                )}
                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                    <p className="text-xl font-bold text-gray-900">Grand Total</p>
                    <p className="text-xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</p>
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Taxes and Shipping will be calculated at checkout.</p>
            <div className="mt-6 space-y-3">
                <button
                    onClick={onCheckout}
                    className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Proceed to Checkout
                </button>
                <button
                    onClick={handleClearClick}
                    className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 ${
                        confirmingClear 
                        ? 'bg-red-500 text-white' 
                        : 'text-gray-500 bg-transparent hover:bg-gray-100'
                    }`}
                >
                    {confirmingClear ? 'Confirm Clear?' : 'Clear Cart'}
                </button>
            </div>
        </div>
    );
};

// --- Main CartPage Component ---

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [cart, setCart] = useState<CartDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

    useEffect(() => {
        const fetchCart = async () => {
            if (!isAuthenticated || !user?.id) {
                setLoading(false);
                return;
            }
            try {
                const data = await getCart(user.id);
                setCart(data);
            } catch (error: any) {
                toast.error(`Failed to load cart: ${error.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [isAuthenticated, user?.id]);

    const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
        if (newQuantity < 1 || updatingItemId || !cart) return;
        setUpdatingItemId(cartItemId);

        // Store original cart for rollback in case of error
        const originalCart = { ...cart };

        try {
            // Optimistic update
            const updatedItems = cart.items.map(item => {
                if (item.id === cartItemId) {
                    const quantityDiff = newQuantity - item.quantity;
                    const newBasePrice = item.basePrice * newQuantity;
                    const newDiscountAmount = item.discount ? item.basePrice * item.discount * newQuantity : 0;
                    const newTotalPrice = newBasePrice - newDiscountAmount;

                    return {
                        ...item,
                        quantity: newQuantity,
                        totalPrice: newTotalPrice,
                        discountAmount: newDiscountAmount,
                        discountedPrice: newBasePrice - newDiscountAmount,
                    };
                }
                return item;
            });

            // Recalculate totals
            const newTotalBasePrice = updatedItems.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
            const newTotalDiscountAmount = updatedItems.reduce((sum, item) => sum + item.discountAmount, 0);
            const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

            // Update cart state optimistically
            setCart({
                ...cart,
                items: updatedItems,
                totalBasePrice: newTotalBasePrice,
                totalDiscountAmount: newTotalDiscountAmount,
                totalPrice: newTotalPrice,
            });

            // Send API request
            const updatedCart = await updateItemQuantity(cartItemId, newQuantity, user?.id);
            setCart(updatedCart); // Sync with server response
        } catch (error) {
            // Revert to original cart on error
            setCart(originalCart);
            toast.error('Failed to update quantity.');
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (cartItemId: number) => {
        if (updatingItemId || !cart) return;
        setUpdatingItemId(cartItemId);
        const originalCart = { ...cart };
        const newItems = cart.items.filter(i => i.id !== cartItemId);
        const newCart = { ...cart, items: newItems };
        setCart(newCart);
        try {
            await removeItemFromCart(cartItemId, user?.id);
            toast.success('Item removed.');
        } catch (error) {
            setCart(originalCart);
            toast.error('Failed to remove item.');
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleClearCart = async () => {
        if (!user?.id) {
            toast.error('User not authenticated.');
            return;
        }
        try {
            await clearCart(user.id);
            setCart({ id: 0, items: [], totalBasePrice: 0, totalDiscountAmount: 0, totalTaxAmount: 0, totalPrice: 0, totalFinalPrice: 0 });
            toast.success('Cart has been cleared.');
        } catch (error) {
            toast.error('Failed to clear cart.');
        }
    };

    const handleCheckout = () => {
        if (cart?.items.length) {
            navigate('/checkout');
        } else {
            toast.error('Your cart is empty.');
        }
    };

    if (loading) return <LoadingSpinner />;
    
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto text-center py-16 px-4">
                 <h2 className="text-2xl font-semibold text-gray-800">Please Log In</h2>
                 <p className="mt-2 text-gray-500">You need to be logged in to view your cart and continue shopping.</p>
                 <button onClick={() => navigate('/login')} className="mt-6 inline-block bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out">
                    Go to Login
                </button>
            </div>
        );
    }
    
    const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        {user?.firstName ? `Welcome back, ${user.firstName}!` : 'Your Shopping Cart'}
                    </h1>
                    <p className="text-gray-600 mb-8">You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart. Let's get this order placed!</p>

                    {cart && cart.items.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                            <div className="lg:col-span-2 space-y-4">
                                <AnimatePresence>
                                    {cart.items.map((item) => (
                                        <motion.div 
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        >
                                            <CartItemCard
                                                item={item}
                                                onQuantityChange={handleQuantityChange}
                                                onRemoveItem={handleRemoveItem}
                                                isUpdating={updatingItemId === item.id}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="lg:col-span-1 mt-8 lg:mt-0">
                                <OrderSummary
                                    totalItems={totalItems}
                                    totalBasePrice={cart.totalBasePrice}
                                    totalPrice={cart.totalPrice}
                                    totalDiscountAmount={cart.totalDiscountAmount}
                                    onClearCart={handleClearCart}
                                    onCheckout={handleCheckout}
                                />
                            </div>
                        </div>
                    ) : (
                        <EmptyCart />
                    )}
                </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
        </>
    );
};

export default CartPage;