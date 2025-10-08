import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { ProductVariantSummaryDTO } from '../../services/types';

interface ProductCarouselProps {
  products: ProductVariantSummaryDTO[];
  onProductClick: (id: number) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Dynamically set visible items based on screen size
  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(1); // Mobile screens
      } else if (width < 768) {
        setVisibleItems(2); // Small screens
      } else if (width < 1024) {
        setVisibleItems(3); // Medium screens
      } else {
        setVisibleItems(4); // Large screens
      }
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  // Handle transition end for infinite loop
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (currentIndex >= products.length) {
        setIsTransitioning(false);
        setCurrentIndex(0);
      } else if (currentIndex < 0) {
        setIsTransitioning(false);
        setCurrentIndex(products.length - 1);
      } else {
        setIsTransitioning(false);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('transitionend', handleTransitionEnd);
      return () => carousel.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, [currentIndex, products.length]);

  // Update carousel position
  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = 100 / visibleItems;
      const translateX = -(currentIndex * itemWidth);
      carouselRef.current.style.transition = isTransitioning ? 'transform 0.5s ease-in-out' : 'none';
      carouselRef.current.style.transform = `translateX(${translateX}%)`;
    }
  }, [currentIndex, visibleItems, isTransitioning]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => prev - 1);
    setIsTransitioning(true);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true);
  };

  if (!products.length) return null;

  return (
    <div className="relative">
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        <FaChevronLeft className="h-6 w-6 text-gray-600" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        <FaChevronRight className="h-6 w-6 text-gray-600" />
      </button>
      <div className="overflow-hidden">
        <div ref={carouselRef} className="flex">
          {/* Duplicate products for infinite loop */}
          {[...products, ...products].map((product, index) => (
            <div
              key={`${product.variantId}-${index}`}
              className="flex-shrink-0"
              style={{ width: `${100 / visibleItems}%` }}
              onClick={() => onProductClick(product.productId)}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-500">{product.brand}</p>
                  <p className="text-indigo-600 font-bold">₹{product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;