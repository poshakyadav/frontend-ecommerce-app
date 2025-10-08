import type { Banner, ContentResponse } from "./contentService";

// Shared API response wrapper
declare global {
  interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
}

export interface ProductDetailDTO {
  id: number;
  brand: string;
  category: ProductCategoryDTO;
  defaultVariant: ProductVariantDTO;
  variants: ProductVariantDTO[];
  availableAttributes: { [key: string]: string[] };
  averageRating: number;
  totalRatings: number;
  ratingDistribution: { [key: number]: number };
  reviews: ProductReviewDTO[];
}

export interface ProductCategoryDTO {
  id: number;
  name: string;
}

export interface VariantColorDTO {
  id: number;
  name: string;
  hexCode: string;
}

export interface ProductVariantDTO {
  id: number;
  name: string;
  sku: string;
  description: string;
  imageUrls: string[];
  color: VariantColorDTO;
  sizePrices: SizePriceDTO[];
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface SizePriceDTO {
  id?: number;
  size: string;
  basePrice: number | null;
  discount: number | null;
  discountAmount: number;
  discountedPrice: number;
  taxRate: number | null;
  taxAmount: number;
  totalPrice: number;
  finalPrice: number;
  stock: number | null;
  isDefault: boolean;
}

export interface ProductReviewDTO {
  id: number;
  userId: number;
  username: string;
  rating: number;
  reviewText: string;
  imageUrls: string[];
  status: string;
  helpfulVotes: number;
  unhelpfulVotes: number;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface ProductCreateDTO {
  brand: string;
  categoryId: number;
  variants: VariantDTO[];
}

export interface VariantDTO {
  name: string;
  sku: string;
  description: string;
  color: VariantColorDTO;
  sizePrices: SizePriceDTO[];
  length: number;
  breadth: number;
  height: number;
  weight: number;
  imageKeys?: string[]; 
  isNewArrival: boolean;
  isTrendy: boolean;
  isRecommended: boolean;
}

export interface ProductBasicUpdateDTO {
  id: number;
  brand: string;
  categoryId: number;
}


export interface NewVariantDTO {
  name: string;
  sku: string;
  description: string;
  color: VariantColorDTO;
  sizePrices: SizePriceDTO[];
  length: number;
  breadth: number;
  height: number;
  weight: number;
  isNewArrival: boolean;
  isTrendy: boolean;
  isRecommended: boolean;
}

export interface ProductUpdateDTO {
  id: number;
  brand: string;
  categoryId: number;
  newVariants: NewVariantDTO[];
}

export interface VariantUpdateDTO {
  name: string;
  sku: string;
  description: string;
  color: VariantColorDTO;
  sizePrices: SizePriceDTO[];
  length: number;
  breadth: number;
  height: number;
  weight: number;
  isNewArrival: boolean;
  isTrendy: boolean;
  isRecommended: boolean;
}

export interface VariantImageUpdateDTO {
  imageUrlsToKeep: string[];
  imageOrder: string[];
}

export interface AdminProductListDTO {
  id: number;
  brand: string;
  active: boolean;
  category: {
    id: number;
    name: string;
  };
  variants: {
    id: number;
    name: string;
    sku: string;
    description: string;
    imageUrls: string[];
    color: VariantColorDTO;
    sizePrices: SizePriceDTO[];
    active: boolean;
    length: number;
    breadth: number;
    height: number;
    weight: number;
    newArrival: boolean;
    trendy: boolean;
    recommended: boolean;
  }[];
}

export interface ReviewRequestDTO {
  orderItemId: number;
  rating: number;
  reviewText: string;
}

export interface CartItemRequestDTO {
  variantId: number;
  quantity: number;
  selectedSize: string;
}

export interface CartDTO {
  id: number;
  items: CartItemDTO[];
  totalBasePrice: number;
  totalDiscountAmount: number;
  totalTaxAmount: number;
  totalPrice: number;
  totalFinalPrice: number;
}

export interface CartItemDTO {
  id: number;
  variant: {
    id: number;
    sku: string;
    productName: string;
    imageUrls: string[];
    category: ProductCategoryDTO;
    attributes: { [key: string]: string };
  };
  quantity: number;
  selectedSize: string;
  basePrice: number;
  discount: number | null;
  discountAmount: number;
  discountedPrice: number;
  taxRate: number | null;
  taxAmount: number;
  totalPrice: number;
  finalPrice: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  attributes: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}


// User Address
export interface UserAddress {
  id: number;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  type: 'HOME' | 'WORK';
  userId: number; // Changed from user: User | null to match backend DTO
  isServiceable: boolean;
  serviceabilityMessage: string;
  isPrimary: boolean;
}

export type AddressInput = Omit<UserAddress, 'id' | 'userId'>;

// Order related types
export interface CreateOrderRequest {
  userbillingAddressId: number;
  currency: string;
  deliveryInstructions: string;
  shippingMethod: string | null;
  paymentMode: 'COD' | 'PREPAID';
  contactPhone: string;
  alternativePhone: string;
}

export interface OrderDTO {
  id: number;
  orderNumber: string;
  paymentStatus: string; // Matches backend OrderPaymentStatus as string
  fulfillmentStatus: string; // Matches backend OrderFulfillmentStatus as string
  total: number; // BigDecimal mapped to number
  razorpayOrderId: string | null;
  shiprocketOrderId: string | null;
  shiprocketAwbNumber: string | null;
  items: OrderItemDTO[];
  paymentMode: 'COD' | 'PREPAID';
  tax: number;
  shippingCost: number;
  totalDiscount: number;
}

export interface OrderItemDTO {
  id: number;
  variantId: number;
  productName: string;
  quantity: number;
  basePrice: number;
  discountAmount: number;
  taxAmount: number;
  discountedPrice: number;
  selectedSize: string;
  color: string;
  totalPrice: number;
}

// Direct order request type matching backend CreateDirectOrderRequest
export interface CreateDirectOrderRequest {
  userbillingAddressId: number;
  currency: string;
  deliveryInstructions: string;
  shippingMethod: string | null;
  paymentMode: 'COD' | 'PREPAID';
  contactPhone: string;
  alternativePhone: string;
  variantId: number;
  selectedSize: string;
  quantity: number;
}

// Common interface for items in OrderSummary (cart or direct purchase)
export interface OrderSummaryItem {
  id: number;
  productName: string;
  imageUrl: string;
  selectedSize: string;
  quantity: number;
  basePrice: number;
  discount: number | null;
  discountAmount: number;
  discountedPrice: number;
  taxRate: number | null;
  taxAmount: number;
  totalPrice: number;
  finalPrice: number;
}

// Search product related
export interface ProductVariantSummaryDTO {
  variantId: number;
  productId: number;
  name: string;
  imageUrl: string | null;
  price: number;
  brand: string;
  categoryName: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface SearchParams {
  q?: string;
  categories: string[];
  // brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
  size?: number;
  tab?: string; // Added tab for filtering
}



export type { Banner, ContentResponse };