// src/components/Home/FeaturedProducts.tsx

import React from 'react';
import type { ProductResponse } from '../../services/productService'; // Import from service

interface Props {
  products: ProductResponse[];
  onProductClick: (id: number) => void; // New prop for click handling
}

const FeaturedProducts: React.FC<Props> = ({ products, onProductClick }) => (
  <section className="hm-featured-section container mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
    <div className="hm-featured-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(p => (
        <div
          key={p.id}
          className="hm-product-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
          onClick={() => onProductClick(p.id)} // Handle product click
        >
          <img
            src={p.images[0]?.url || 'https://via.placeholder.com/300x300/F0F0F0/000000?text=No+Image'}
            alt={p.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="name text-lg font-semibold text-gray-800 truncate">{p.name}</h3>
            <div className="price text-xl font-bold text-indigo-600 mt-2">
                ₹{p.discount && p.discount > 0 ? (p.price * (1 - p.discount)).toFixed(2) : p.price.toFixed(2)}
                {p.discount && p.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through ml-2">₹{p.price.toFixed(2)}</span>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturedProducts;