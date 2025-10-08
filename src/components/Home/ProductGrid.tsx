// ProductGrid.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductVariantSummaryDTO } from '../../services/types';

interface Props {
  products: ProductVariantSummaryDTO[];
  onProductClick: (id: number) => void;
}

const ProductGrid: React.FC<Props> = ({ products, onProductClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          to={`/product/${product.productId}/${product.variantId}`}
          key={product.variantId}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
          onClick={() => onProductClick(product.productId)}
        >
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="w-full h-48 object-cover"
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image')}
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.categoryName}</p>
            <div className="mt-2">
              <span className="text-xl font-bold text-indigo-600">₹{product.price.toFixed(2)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;