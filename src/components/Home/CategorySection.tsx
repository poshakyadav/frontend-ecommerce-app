import React, { useEffect, useRef, useState } from 'react';
import type { CategoryResponse } from '../../services/types';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

interface Props {
  categories: CategoryResponse[];
  onSelect: (id: number) => void;
}

const CategorySection: React.FC<Props> = ({ categories, onSelect }) => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleItems, setVisibleItems] = useState(4);

  // Dynamically set visible items based on screen size
  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(2); // Small screens (phones)
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

  // Animation interval
  useEffect(() => {
    if (!carouselRef.current || categories.length <= visibleItems) return;

    const interval = setInterval(() => {
      if (!isPaused && !isTransitioning) {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(true);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [categories.length, isPaused, isTransitioning, visibleItems]);

  // Handle transition end for infinite loop
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (currentIndex >= categories.length) {
        setCurrentIndex(0);
        setIsTransitioning(false);
      } else {
        setIsTransitioning(false);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('transitionend', handleTransitionEnd);
      return () => carousel.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, [currentIndex, categories.length]);

  // Update carousel position
  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = 100 / visibleItems; // Width of one card in percentage
      const translateX = -(currentIndex * itemWidth); // Move by one card width

      carouselRef.current.style.transition = isTransitioning ? 'transform 0.5s ease-in-out' : 'none';
      carouselRef.current.style.transform = `translateX(${translateX}%)`;
    }
  }, [currentIndex, isTransitioning, visibleItems]);

  const handleCategoryClick = (id: number, name: string) => {
    onSelect(id);
    navigate(`/search?categories=${encodeURIComponent(name)}`);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
      <div className="flex justify-between items-center mb-8">
        <h2 
        className="text-2xl md:text-4xl font-extrabold text-center leading-tight tracking-tight text-blue-600 dark:text-blue-500"
        >
          Shop by Category
        </h2>
        <button
          onClick={() => navigate('/view-all-categories')}
          className="flex items-center text-blue-600 font-semibold px-4 py-2 text-sm sm:text-lg  rounded-md hover:bg-blue-50 hover:text-indigo-700 transition-all duration-300"
        >
          VIEW ALL <FaChevronRight className="h-3 sm:h-4 pt-0.5 sm:pt-0" />
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex items-center justify-start gap-0 w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {[...categories, ...categories].map((cat, index) => (
            <Link
              to={`/search?categories=${encodeURIComponent(cat.name)}`}
              key={`${cat.id}-${index}`}
              className="block flex-shrink-0 px-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
              style={{ width: `${100 / visibleItems}%` }}
              onClick={(e) => {
                e.preventDefault();
                handleCategoryClick(cat.id, cat.name);
              }}
            >
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={cat.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={cat.name}
                  className="w-full h-40 object-cover rounded-lg bg-blue-50-50"
                />
                <div className="p-4 px-0 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 bg-blue-100 rounded-md">{cat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;