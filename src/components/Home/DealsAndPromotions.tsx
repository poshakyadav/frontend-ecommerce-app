// src/components/Home/DealsAndPromotions.tsx

import React from 'react';
import type { ProductResponse } from '../../services/productService';
import { Link } from 'react-router-dom';

interface Props {
  products: ProductResponse[];
  onProductClick: (id: number) => void;
}

const DealsAndPromotions: React.FC<Props> = ({ products, onProductClick }) => (
  <section className="hm-deals-promotions bg-blue-50 py-12 px-4">
    <h2 className="text-3xl font-bold text-center mb-8 text-blue-800">Limited-Time Deals!</h2>
    {products.length === 0 ? (
      <p className="text-center text-gray-600">No deals available right now. Check back soon!</p>
    ) : (
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div
            key={p.id}
            className="hm-product-card bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 relative"
            onClick={() => onProductClick(p.id)}
          >
            {p.discount && p.discount > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {`-${(p.discount * 100).toFixed(0)}%`}
              </span>
            )}
            <img
              src={p.images[0]?.url || 'https://via.placeholder.com/300x300/F0F0F0/000000?text=No+Image'}
              alt={p.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="name text-lg font-semibold text-gray-800 truncate">{p.name}</h3>
              <div className="price flex items-baseline mt-2">
                <span className="text-xl font-bold text-red-600">₹{p.discountedPrice?.toFixed(2) || p.price.toFixed(2)}</span>
                {p.discount && p.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through ml-2">₹{p.price.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    {products.length > 0 && (
      <div className="text-center mt-8">
        <Link
          to="/deals" // Create a route for all deals later
          className="inline-block bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-800 transition duration-300"
        >
          View All Deals
        </Link>
      </div>
    )}
  </section>
);

export default DealsAndPromotions;