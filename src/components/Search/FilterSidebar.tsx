import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import { getAllActiveCategoriesPublic } from '../../services/categoryService';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { categories: string[]; minPrice: number | undefined; maxPrice: number | undefined }) => void;
  sortBy: string | undefined;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  sortBy,
  onSortChange,
  onClearFilters,
}) => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const catData = await getAllActiveCategoriesPublic();
        setCategories(catData.map((cat) => cat.name));
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    setSelectedCategories(searchParams.getAll('categories').map(decodeURIComponent));
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  const handleApply = () => {
    onApplyFilters({
      categories: selectedCategories,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-white p-6 overflow-y-auto transition-transform duration-300 lg:static lg:block lg:p-0 lg:px-2 lg:py-2 lg:border-r-1 lg:border-gray-300 lg:bg-transparent ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <FiX size={24} />
        </button>
      </div>

      {/* Sort By Section */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Sort By</h4>
        <select
          value={sortBy}
          onChange={onSortChange}
          className="w-full border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Categories</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={(e) =>
                  setSelectedCategories(
                    e.target.checked
                      ? [...selectedCategories, cat]
                      : selectedCategories.filter((c) => c !== cat)
                  )
                }
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-gray-600">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Clear Filters and Apply Filters */}
      <div className="flex space-x-4">
        <button
          onClick={() => {
            onClearFilters();
            onClose();
          }}
          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Clear Filters
        </button>
        <button
          onClick={handleApply}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;