import api from './api';
import type { OrderDTO, CreateOrderRequest, CreateDirectOrderRequest } from './types';

export const createOrder = async (request: CreateOrderRequest): Promise<OrderDTO> => {
  const resp = await api.post('/user/orders', request);
  return resp.data.data;
};

export const getUserOrders = async (): Promise<OrderDTO[]> => {
  const resp = await api.get('/user/orders');
  return resp.data.data;
};

export const getOrder = async (orderId: number): Promise<OrderDTO> => {
  const resp = await api.get(`/user/orders/${orderId}`);
  return resp.data.data;
};

export const cancelOrder = async (orderId: number): Promise<void> => {
  await api.delete(`/user/orders/${orderId}`);
};

export const createDirectOrder = async (request: CreateDirectOrderRequest): Promise<OrderDTO> => {
  console.log('Creating direct order with request:', request);
  try {
    const resp = await api.post<ApiResponse<OrderDTO>>('/user/orders/buy-now', request);
    if (!resp.data.success) {
      throw new Error(`Failed to create direct order: ${resp.data.message}`);
    }
    console.log('Direct order created successfully:', resp.data.data);
    return resp.data.data;
  } catch (error) {
    console.error('Error creating direct order:', error);
    throw error;
  }
};