import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../../services/categoryService';
import type { CategoryResponse } from '../../../services/types';

const ViewAllCategory: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (id: number, name: string) => {
    navigate(`/search?categories=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-blue-600">All Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCategoryClick(cat.id, cat.name)}
            >
              <img
                src={cat.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={cat.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAllCategory;