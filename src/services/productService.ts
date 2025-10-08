// src/services/productService.ts

import api from './api';
import type { ProductDetailDTO, ProductCreateDTO, ProductReviewDTO, ReviewRequestDTO, AdminProductListDTO, ProductVariantSummaryDTO, SearchParams, PagedResponse, ProductBasicUpdateDTO, VariantUpdateDTO, VariantImageUpdateDTO, ProductUpdateDTO } from './types';

export const getProductDetails = async (productId: number, variantId?: number): Promise<ProductDetailDTO> => {
  const params = variantId ? { variantId } : {};
  const resp = await api.get<ApiResponse<ProductDetailDTO>>(`/products/${productId}`, { params });
  console.log('getProductDetails ### response:', JSON.stringify(resp, null, 2));
  return resp.data.data;
};

export const getProductByVariantId = async (variantId: number): Promise<ProductDetailDTO> => {
  const resp = await api.get<ApiResponse<ProductDetailDTO>>(`/admin/products/variant/${variantId}`);
  return resp.data.data;
};

export const searchProducts = async (params: SearchParams): Promise<PagedResponse<ProductVariantSummaryDTO>> => {
  console.log('Fetching search results with params:', params);
  try {
    // Convert params to a plain object and handle arrays manually
    const queryParams: any = { ...params };
    if (params.categories && params.categories.length > 0) {
      queryParams.categories = params.categories.join(',');
    }
    const resp = await api.get<ApiResponse<PagedResponse<ProductVariantSummaryDTO>>>('/products/search', { params: queryParams });
    return resp.data.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<AdminProductListDTO[]> => {
  try {
    const resp = await api.get<ApiResponse<AdminProductListDTO[]>>('/admin/products');
    console.log('getAllProducts raw response:', JSON.stringify(resp, null, 2));
    // return resp.data.data ?? [];
    const products = resp.data.data ?? resp.data ?? [];
    console.log('getAllProducts processed products:', products);
    if (!Array.isArray(products)) {
      console.error('getAllProducts: Expected an array, got:', products);
      return [];
    }
    return products;
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw error;
  }
};

export const toggleProductActive = async (productId: number, active: boolean): Promise<void> => {
  try {
    await api.put(`/admin/products/${productId}/toggle-active`, null, { params: { active } });
  } catch (error) {
    console.error('Error in toggleProductActive:', error);
    throw error;
  }
};

export const toggleVariantActive = async (variantId: number, active: boolean): Promise<void> => {
  try {
    await api.put(`/admin/products/variants/${variantId}/toggle-active`, null, { params: { active } });
  } catch (error) {
    console.error('Error in toggleVariantActive:', error);
    throw error;
  }
};



export const createProduct = async (data: ProductCreateDTO, variantImages: File[][]): Promise<ProductDetailDTO> => {
  const formData = new FormData();
  const productBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('product', productBlob);

  // Append images for each variant
  variantImages.forEach((images, variantIndex) => {
    images.forEach((image, imageIndex) => {
      formData.append('images', image, `variant_${variantIndex}_${imageIndex}_${image.name}`);
      console.log(`Appending image for variant ${variantIndex}: ${image.name}`);
    });
  });

  try {
    const resp = await api.post<ApiResponse<ProductDetailDTO>>('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('createProduct response:', JSON.stringify(resp.data, null, 2));
    return resp.data.data;
  } catch (error) {
    console.error('createProduct error:', error);
    throw error;
  }
};

export const updateProductBasic = async (productId: number, data: ProductBasicUpdateDTO): Promise<ProductDetailDTO> => {
  try {
    const resp = await api.put<ApiResponse<ProductDetailDTO>>(`/admin/products/${productId}/basic`, data);
    console.log('updateProductBasic response:', JSON.stringify(resp.data, null, 2));
    return resp.data.data;
  } catch (error) {
    console.error('updateProductBasic error:', error);
    throw error;
  }
};

export const updateProduct = async (productId: number, data: ProductUpdateDTO, variantImages: File[][]): Promise<ProductDetailDTO> => {
  const formData = new FormData();
  const productBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('product', productBlob);

  variantImages.forEach((images, variantIndex) => {
    images.forEach((image, imageIndex) => {
      formData.append('images', image, `new_variant_${variantIndex}_${imageIndex}_${image.name}`);
    });
  });

  try {
    const resp = await api.put<ApiResponse<ProductDetailDTO>>(`/admin/products/${productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return resp.data.data;
  } catch (error) {
    console.error('updateProduct error:', error);
    throw error;
  }
};

export const updateVariantDetails = async (variantId: number, data: VariantUpdateDTO): Promise<ProductDetailDTO> => {
  try {
    const resp = await api.put<ApiResponse<ProductDetailDTO>>(`/admin/products/variants/${variantId}/details`, data);
    console.log('updateVariantDetails response:', JSON.stringify(resp.data, null, 2));
    return resp.data.data;
  } catch (error) {
    console.error('updateVariantDetails error:', error);
    throw error;
  }
};

export const updateVariantImages = async (variantId: number, data: VariantImageUpdateDTO, images: File[]): Promise<ProductDetailDTO> => {
  const formData = new FormData();
  const dtoBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('dto', dtoBlob);
  images.forEach((image, index) => {
    formData.append('images', image, `variant_${index}_${image.name}`);
  });
  try {
    const resp = await api.put<ApiResponse<ProductDetailDTO>>(`/admin/products/variants/${variantId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('updateVariantImages response:', JSON.stringify(resp.data, null, 2));
    return resp.data.data;
  } catch (error) {
    console.error('updateVariantImages error:', error);
    throw error;
  }
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await api.delete(`/admin/products/${productId}`);
  console.log(`deleteProduct: Product ${productId} deleted`);
};

export const deleteVariant = async (variantId: number): Promise<void> => {
  await api.delete(`/admin/products/variants/${variantId}`);
  console.log(`deleteVariant: Variant ${variantId} deleted`);
};

export const submitReview = async (data: ReviewRequestDTO, userId: number, images: File[]): Promise<ProductReviewDTO> => {
  const formData = new FormData();
  const reviewBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('review', reviewBlob);
  images.forEach((image) => formData.append('images', image));
  const resp = await api.post<ApiResponse<ProductReviewDTO>>('/reviews', formData);
  console.log('submitReview response:', JSON.stringify(resp.data, null, 2));
  return resp.data.data;
};

export const updateReview = async (reviewId: number, data: ReviewRequestDTO, userId: number, images: File[]): Promise<ProductReviewDTO> => {
  const formData = new FormData();
  const reviewBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  formData.append('review', reviewBlob);
  images.forEach((image) => formData.append('images', image));
  const resp = await api.put<ApiResponse<ProductReviewDTO>>(`/reviews/${reviewId}`, formData);
  console.log('updateReview response:', JSON.stringify(resp.data, null, 2));
  return resp.data.data;
};

export const deleteReview = async (reviewId: number, userId: number): Promise<void> => {
  await api.delete(`/reviews/${reviewId}`);
  console.log(`deleteReview: Review ${reviewId} deleted`);
};

export const adminDeleteReview = async (reviewId: number): Promise<void> => {
  await api.delete(`/admin/reviews/${reviewId}`);
  console.log(`adminDeleteReview: Review ${reviewId} deleted`);
};

export const voteReviewHelpfulness = async (reviewId: number, userId: number, isHelpful: boolean): Promise<void> => {
  await api.post(`/reviews/${reviewId}/vote`, { isHelpful });
  console.log(`voteReviewHelpfulness: Voted ${isHelpful ? 'helpful' : 'unhelpful'} for review ${reviewId}`);
};

export const moderateReview = async (reviewId: number, status: string): Promise<ProductReviewDTO> => {
  const resp = await api.put<ApiResponse<ProductReviewDTO>>(`/admin/reviews/${reviewId}/moderate`, { status });
  console.log('moderateReview response:', JSON.stringify(resp.data, null, 2));
  return resp.data.data;
};

export const getReviewsByStatus = async (status: string, page: number, size: number): Promise<{ content: ProductReviewDTO[], totalPages: number }> => {
  const resp = await api.get<ApiResponse<{ content: ProductReviewDTO[], totalPages: number }>>(`/admin/reviews`, {
    params: { status, page, size },
  });
  console.log('getReviewsByStatus response:', JSON.stringify(resp.data, null, 2));
  return resp.data.data;
};

// --- NEWSLETTER SUBSCRIPTION (Conceptual) ---
export const subscribeToNewsletter = async (email: string): Promise<void> => {
  // In a real application, replace with your actual API endpoint for newsletter subscription
  // You might want a dedicated newsletter service file for this
  // const resp = await api.post('/newsletter/subscribe', { email });
  // return resp.data;
  console.log(`Subscribing ${email} to newsletter...`);
  return new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
};