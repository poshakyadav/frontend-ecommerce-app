// userAddressService.ts

import api from './api';
import type { UserAddress, AddressInput } from './types';

// Define an input type excluding id and userId since userId is set by backend
// export type AddressInput = Omit<UserAddress, 'id' | 'userId'>;

export const getUserAddresses = async (): Promise<UserAddress[]> => {
  const resp = await api.get('/user/addresses');
  console.log('getUserAddresses response:', resp.data);
  return resp.data.data;
};

export const addAddress = async (address: AddressInput): Promise<UserAddress> => {
  const resp = await api.post('/user/addresses', address);
  return resp.data.data;
};

export const updateAddress = async (id: number, address: AddressInput): Promise<UserAddress> => {
  const resp = await api.put(`/user/addresses/${id}`, address);
  return resp.data.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await api.delete(`/user/addresses/${id}`);
};