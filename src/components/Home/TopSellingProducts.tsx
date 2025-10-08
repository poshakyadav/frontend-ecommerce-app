// src/components/Home/TopSellingProducts.tsx

import React from 'react';
import type { ProductResponse } from '../../services/productService';
import { Link } from 'react-router-dom';

interface Props {
  products: ProductResponse[];
  onProductClick: (id: number) => void;
}

const TopSellingProducts: React.FC<Props> = ({ products, onProductClick }) => (
  <section className="hm-top-selling container mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold text-center mb-8">Top Selling Products</h2>
    {products.length === 0 ? (
      <p className="text-center text-gray-600">No top selling products to display at the moment.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div
            key={p.id}
            className="hm-product-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
            onClick={() => onProductClick(p.id)}
          >
            <img
              src={p.images[0]?.url || 'https://via.placeholder.com/300x300/F0F0F0/000000?text=No+Image'}
              alt={p.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="name text-lg font-semibold text-gray-800 truncate">{p.name}</h3>
              <div className="price text-xl font-bold text-indigo-600 mt-2">₹{p.price.toFixed(2)}</div>
              {/* Add a placeholder for sales count/rating if available from backend */}
              <p className="text-sm text-gray-500 mt-1">Rating: {p.rating?.toFixed(1) || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    )}
    {/* Optional: View All Top Selling button */}
    {products.length > 0 && (
      <div className="text-center mt-8">
        <Link
          to="/top-selling" // Create a route for all top selling products later
          className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          View All Top Sellers
        </Link>
      </div>
    )}
  </section>
);

export default TopSellingProducts;