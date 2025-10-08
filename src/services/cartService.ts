import api from './api';
import type { CartItemRequestDTO, CartDTO, CartItemDTO } from './types';

export const addItemToCart = async (
  request: CartItemRequestDTO,
  userId?: number,
  sessionId?: string
): Promise<CartDTO> => {
  try {
    const params = sessionId ? { sessionId } : {};
    const headers = userId ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};
    const resp = await api.post<ApiResponse<CartDTO>>('/cart/items', request, { params, headers });
    if (!resp.data.success) {
      throw new Error(`Failed to add item to cart: ${resp.data.message}`);
    }
    return resp.data.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const updateItemQuantity = async (
  cartItemId: number,
  quantity: number,
  userId?: number
): Promise<CartDTO> => {
  try {
    const headers = userId ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};
    const params = { quantity: quantity.toString() }; // Send quantity as query param
    const resp = await api.put<ApiResponse<CartDTO>>(`/cart/items/${cartItemId}`, null, { headers, params });
    if (!resp.data.success) {
      throw new Error(`Failed to update quantity: ${resp.data.message}`);
    }
    console.log('Updated Cart Item Quantity : ' , resp.data.data);
    return resp.data.data;
  } catch (error) {
    console.error('Error updating item quantity:', error);
    throw error;
  }
};

export const removeItemFromCart = async (
  cartItemId: number,
  userId?: number
): Promise<CartDTO> => {
  try {
    const headers = userId ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};
    const resp = await api.delete<ApiResponse<CartDTO>>(`/cart/items/${cartItemId}`, { headers });
    if (!resp.data.success) {
      throw new Error(`Failed to remove item: ${resp.data.message}`);
    }
    return resp.data.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

export const getCart = async (userId?: number, sessionId?: string): Promise<CartDTO> => {
  try {
    const params = sessionId ? { sessionId } : {};
    const headers = userId ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {};
    const resp = await api.get<ApiResponse<CartDTO>>('/cart', { params, headers });
    console.log('Cart response:', resp.data);
    if (!resp.data.success) {
      throw new Error(`Failed to fetch cart: ${resp.data.message}`);
    }
    return resp.data.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const mergeGuestCart = async (userId: number, sessionId: string): Promise<CartDTO> => {
  try {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}`, 'X-Session-ID': sessionId };
    const resp = await api.post<ApiResponse<CartDTO>>('/cart/merge', null, { headers });
    if (!resp.data.success) {
      throw new Error(`Failed to merge cart: ${resp.data.message}`);
    }
    return resp.data.data;
  } catch (error) {
    console.error('Error merging guest cart:', error);
    throw error;
  }
};

export const clearCart = async (userId?: number): Promise<void> => {
  try {
    if (!userId) {
      throw new Error('User ID is required to clear the cart');
    }
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    await api.post<void>('/cart/clear', null, { headers });
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};