// CategoryList.tsx

// src/pages/admin/CategoryManagement/CategoryList.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories, deleteCategory } from '../../../services/categoryService';
import type { CategoryResponse } from '../../../services/types';
import { ToastContainer, toast } from 'react-toastify';

const CategoryListPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Category Management</h1>
        <Link to="/admin/categories/add" className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
          Add Category
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{category.id}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{category.name}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <Link to={`/admin/categories/edit/${category.id}`} className="text-blue-500 hover:underline mr-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default CategoryListPage;