import api from './api';
import './types';

export interface Banner {
  imageUrl: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface ContentResponse {
  id: number;
  contentKey: string;
  content: string;
  banners?: string; // JSON string of Banner[]
  createdAt: string;
  updatedAt: string;
}

export const getAllContent = async (): Promise<ContentResponse[]> => {
  const resp = await api.get<ApiResponse<ContentResponse[]>>('/content');
  return resp.data.data;
};

export const getContentById = async (id: number): Promise<ContentResponse> => {
  const resp = await api.get<ApiResponse<ContentResponse>>(`/content/${id}`);
  return resp.data.data;
};

export const getContentByKey = async (contentKey: string): Promise<ContentResponse> => {
  const resp = await api.get<ApiResponse<ContentResponse>>(`/content/key/${contentKey}`);
  return resp.data.data;
};

export const createContent = async (contentData: Omit<ContentResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentResponse> => {
  const resp = await api.post<ApiResponse<ContentResponse>>('/content', contentData);
  return resp.data.data;
};

export const updateContent = async (id: number, contentData: Omit<ContentResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentResponse> => {
  const resp = await api.put<ApiResponse<ContentResponse>>(`/content/${id}`, contentData);
  return resp.data.data;
};

export const deleteContent = async (id: number): Promise<void> => {
  await api.delete(`/content/${id}`);
};