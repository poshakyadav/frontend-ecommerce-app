import api from './api';
import {  type CategoryResponse } from './types';

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
  const resp = await api.get<ApiResponse<CategoryResponse[]>>('/admin/categories');
  return resp.data.data;
};

export const getAllActiveCategoriesPublic = async (): Promise<CategoryResponse[]> => {
  const resp = await api.get<ApiResponse<CategoryResponse[]>>('admin/categories/active');
  return resp.data.data;
};

export const getCategory = async (id: number): Promise<CategoryResponse> => {
  const resp = await api.get<ApiResponse<CategoryResponse>>(`/admin/categories/${id}`);
  return resp.data.data;
};

export const createCategory = async (formData: FormData): Promise<CategoryResponse> => {
  const resp = await api.post<ApiResponse<CategoryResponse>>('/admin/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data.data;
};

export const updateCategory = async (id: number, formData: FormData): Promise<CategoryResponse> => {
  const resp = await api.put<ApiResponse<CategoryResponse>>(`/admin/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/admin/categories/${id}`);
};