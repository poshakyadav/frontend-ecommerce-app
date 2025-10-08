// CheckoutPage.tsx (Updated full code)

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCart } from '../../../services/cartService';
import { getUserAddresses, addAddress, updateAddress } from '../../../services/userAddressService';
import { createOrder, createDirectOrder } from '../../../services/userOrderService';
import { useAuth } from '../../../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiLoader } from 'react-icons/fi';
import type { CartDTO, CreateOrderRequest, AddressInput, UserAddress, OrderSummaryItem, CreateDirectOrderRequest } from '../../../services/types';
import AddAddressForm from './AddAddressForm';
import SelectAddressForm from './SelectAddressForm';
import ContactInformationForm from './ContactInformationForm';
import OrderSummary from './OrderSummary';
import PaymentDetails from './PaymentDetails';
import DeliveryAddressDisplay from './DeliveryAddressDisplay';
import ContactInformationDisplay from './ContactInformationDisplay';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const { isDirectPurchase, directItem } = location.state || { isDirectPurchase: false, directItem: null };
  console.log('CheckoutPage initialized with state:', { isDirectPurchase, directItem });

  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [contactPhone, setContactPhone] = useState<string>('');
  const [alternativePhone, setAlternativePhone] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'COD' | 'PREPAID'>('COD');
  const [cart, setCart] = useState<CartDTO | null>(null);
  const [items, setItems] = useState<OrderSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [isContactInfoEntered, setIsContactInfoEntered] = useState(false);
  const [isChangingAddress, setIsChangingAddress] = useState(false);

  useEffect(() => {
    if (authLoading) {
      console.log('Auth loading, waiting...');
      return;
    }

    if (!isAuthenticated || !user?.id) {
      console.warn('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      console.log('Fetching checkout data for user:', user.id);
      try {
        if (isDirectPurchase && directItem) {
          console.log('Direct purchase mode, using directItem:', directItem);
          setItems([directItem]);
          const addressesData = await getUserAddresses();
          console.log('Addresses fetched for direct purchase:', addressesData);
          setAddresses(addressesData);
          if (addressesData.length > 0) {
            setSelectedAddressId(addressesData[0].id);
            setShowAddAddressForm(false);
          } else {
            setShowAddAddressForm(true);
          }
          setContactPhone(user.phone || '');
        } else {
          console.log('Cart-based checkout mode');
          const [cartData, addressesData] = await Promise.all([
            getCart(user.id),
            getUserAddresses(),
          ]);
          console.log('Cart fetched:', cartData);
          console.log('Addresses fetched:', addressesData);
          setCart(cartData);
          const cartItems: OrderSummaryItem[] = cartData.items.map(item => ({
            id: item.id,
            productName: item.variant.productName,
            imageUrl: item.variant.imageUrls[0] || 'https://via.placeholder.com/80',
            selectedSize: item.selectedSize,
            quantity: item.quantity,
            basePrice: item.basePrice,
            discount: item.discount,
            discountAmount: item.discountAmount,
            discountedPrice: item.discountedPrice,
            taxRate: item.taxRate,
            taxAmount: item.taxAmount,
            totalPrice: item.totalPrice,
            finalPrice: item.finalPrice,
          }));
          setItems(cartItems);
          setAddresses(addressesData);
          if (addressesData.length > 0) {
            setSelectedAddressId(addressesData[0].id);
            setShowAddAddressForm(false);
          } else {
            setShowAddAddressForm(true);
          }
          setContactPhone(user.phone || '');
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load checkout data');
        toast.error(err.message || 'Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, isAuthenticated, user?.id, navigate, isDirectPurchase, directItem]);

  const handleAddAddress = async (newAddress: AddressInput) => {
    console.log('Adding address:', newAddress);
    try {
      const addedAddress = await addAddress(newAddress);
      console.log('Address added:', addedAddress);
      setAddresses([...addresses, addedAddress]);
      setSelectedAddressId(addedAddress.id);
      setShowAddAddressForm(false);
      setCurrentStep(isContactInfoEntered ? 3 : 2);
      toast.success('Address added successfully');
    } catch (err: any) {
      console.error('Add address error:', err);
      toast.error('Failed to add address');
    }
  };

  const handleSelectAddress = (addressId: number) => {
    console.log('Address selected:', addressId);
    setSelectedAddressId(addressId);
    setIsChangingAddress(false);
    setCurrentStep(isContactInfoEntered ? 3 : 2);
  };

  const handleUpdateAddress = async (updatedAddress: UserAddress) => {
    console.log('Updating address:', updatedAddress);
    try {
      const updated = await updateAddress(updatedAddress.id, updatedAddress);
      console.log('Address updated:', updated);
      setAddresses(addresses.map(addr => (addr.id === updated.id ? updated : addr)));
      if (selectedAddressId === updated.id) setSelectedAddressId(updated.id);
      toast.success('Address updated successfully');
    } catch (err: any) {
      console.error('Update address error:', err);
      toast.error('Failed to update address');
    }
  };

  const handleContactInfoSubmit = () => {
    console.log('Submitting contact info:', { contactPhone, alternativePhone });
    if (!contactPhone.trim()) {
      toast.error('Contact phone number is required');
      console.warn('Contact phone is empty');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(contactPhone)) {
      toast.error('Enter a valid 10-digit phone number starting with 6-9');
      console.warn('Invalid contact phone format:', contactPhone);
      return;
    }
    setIsContactInfoEntered(true);
    setCurrentStep(3);
    console.log('Contact info validated, proceeding to step 3');
  };

  const handlePlaceOrder = async () => {
    console.log('Placing order:', { isDirectPurchase, selectedAddressId, paymentMode, contactPhone });
    if (!items || items.length === 0) {
      toast.error('No items to order');
      console.warn('Items array is empty');
      return;
    }
    if (!selectedAddressId) {
      toast.error('Please select an address');
      console.warn('No address selected');
      return;
    }
    if (!contactPhone.trim()) {
      toast.error('Contact phone number is required');
      console.warn('Contact phone is empty');
      return;
    }

    try {
      if (isDirectPurchase) {
        if (!directItem) {
          throw new Error('Direct item data missing');
        }
        const orderRequest: CreateDirectOrderRequest = {
          userbillingAddressId: selectedAddressId,
          currency: 'INR',
          deliveryInstructions: '',
          shippingMethod: null,
          paymentMode,
          contactPhone,
          alternativePhone,
          variantId: directItem.id,
          selectedSize: directItem.selectedSize,
          quantity: directItem.quantity,
        };
        console.log('Direct purchase order request:', orderRequest);
        const order = await createDirectOrder(orderRequest);
        console.log('Direct order created:', order);
        handlePayment(order);
      } else {
        if (!cart || !cart.items.length) {
          throw new Error('Cart is empty or not loaded');
        }
        const orderRequest: CreateOrderRequest = {
          userbillingAddressId: selectedAddressId,
          currency: 'INR',
          deliveryInstructions: '',
          shippingMethod: null,
          paymentMode,
          contactPhone,
          alternativePhone,
        };
        console.log('Cart-based order request:', orderRequest);
        const order = await createOrder(orderRequest);
        console.log('Cart-based order created:', order);
        handlePayment(order);
      }
    } catch (err: any) {
      console.error('Place order error:', err);
      toast.error(err.message || 'Failed to place order');
    }
  };

  const handlePayment = (order: any) => {
    if (paymentMode === 'PREPAID') {
      if (!order.razorpayOrderId) {
        console.error('Missing Razorpay order ID:', order);
        toast.error('Payment initialization failed');
        return;
      }
      const options = {
        key: 'YOUR_RAZORPAY_KEY',
        amount: order.total * 100,
        currency: 'INR',
        name: 'Your Store Name',
        description: 'Order Payment',
        order_id: order.razorpayOrderId,
        handler: () => {
          console.log('Payment successful, navigating to confirmation:', order.id);
          navigate(`/order-confirmation/${order.id}`);
        },
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          email: user?.email || '',
          contact: contactPhone,
        },
        theme: { color: '#4F46E5' },
      };
      console.log('Initiating Razorpay payment with options:', options);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      console.log('COD order placed, navigating to confirmation:', order.id);
      navigate(`/order-confirmation/${order.id}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in">Checkout {isDirectPurchase ? '(Buy Now)' : ''}</h1>
      {currentStep === 1 && (
        <div className="animate-slide-up">
          {showAddAddressForm || addresses.length === 0 ? (
            <AddAddressForm onAddressAdded={handleAddAddress} />
          ) : (
            <SelectAddressForm
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={handleSelectAddress}
              onAddNewAddress={() => setShowAddAddressForm(true)}
              onEditAddress={handleUpdateAddress}
              isChangingAddress={isChangingAddress}
            />
          )}
        </div>
      )}
      {currentStep === 2 && (
        <div className="animate-slide-up">
          <ContactInformationForm
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            alternativePhone={alternativePhone}
            setAlternativePhone={setAlternativePhone}
            onSubmit={handleContactInfoSubmit}
            onBack={() => setCurrentStep(1)}
          />
        </div>
      )}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          <div className="lg:col-span-2 space-y-6">
            <OrderSummary items={items} />
            <DeliveryAddressDisplay
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onChangeAddress={() => {
                console.log('Changing address from step 3');
                setIsChangingAddress(true);
                setCurrentStep(1);
              }}
            />
            <ContactInformationDisplay
              contactPhone={contactPhone}
              alternativePhone={alternativePhone}
              onEdit={() => setCurrentStep(2)}
            />
          </div>
          <div className="lg:col-span-1">
            <PaymentDetails
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CheckoutPage;