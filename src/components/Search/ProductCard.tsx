// src/components/Search/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { type ProductVariantSummaryDTO } from '../../services/types';
import { FaRegHeart } from 'react-icons/fa';

interface ProductCardProps {
  product: ProductVariantSummaryDTO;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
      <Link to={`/product/${product.productId}/${product.variantId}`} className="block">
        <div className="relative">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-48 object-cover"
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300')}
          />
          <button className="absolute top-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <FaRegHeart className="text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500">{product.brand}</p>
          <h3 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>
            {product.name}
          </h3>
          <p className="text-xl font-bold text-indigo-600 mt-2">₹{product.price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;