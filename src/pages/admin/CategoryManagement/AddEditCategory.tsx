import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategory, createCategory, updateCategory } from '../../../services/categoryService';
import type { CategoryResponse } from '../../../services/types';
import { ToastContainer, toast } from 'react-toastify';

const AddEditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<CategoryResponse, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'>>({
    name: '',
    description: '',
    attributes: [],
    active: true,
  });
  const [newAttribute, setNewAttribute] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const data = await getCategory(Number(id));
          setFormData({
            name: data.name,
            description: data.description,
            attributes: data.attributes,
            active: data.active,
          });
          setCurrentImageUrl(data.imageUrl || null);
        } catch (error) {
          toast.error('Failed to load category');
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAttribute = () => {
    if (newAttribute && !formData.attributes.includes(newAttribute)) {
      setFormData({ ...formData, attributes: [...formData.attributes, newAttribute] });
      setNewAttribute('');
    }
  };

  const handleRemoveAttribute = (attr: string) => {
    setFormData({ ...formData, attributes: formData.attributes.filter(a => a !== attr) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      const categoryBlob = new Blob([JSON.stringify(formData)], { type: 'application/json' });
      formDataToSend.append('category', categoryBlob);
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (id) {
        await updateCategory(Number(id), formDataToSend);
        toast.success('Category updated successfully');
      } else {
        await createCategory(formDataToSend);
        toast.success('Category created successfully');
      }
      navigate('/admin/categories');
    } catch (error) {
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit Category' : 'Add Category'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            rows={4}
          />
        </div>
        <div>
          <label className="block">Attributes</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAttribute}
              onChange={(e) => setNewAttribute(e.target.value)}
              className="w-full border rounded px-4 py-2"
              placeholder="e.g., Color"
            />
            <button
              type="button"
              onClick={handleAddAttribute}
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <ul className="mt-2">
            {formData.attributes.map((attr, index) => (
              <li key={index} className="flex justify-between items-center">
                {attr}
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(attr)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block">Category Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            className="w-full border rounded px-4 py-2"
          />
          {currentImageUrl && (
            <div className="mt-2">
              <img src={currentImageUrl} alt="Category" className="w-32 h-32 object-cover" />
            </div>
          )}
        </div>
        <button type="submit" className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700">
          {id ? 'Update Category' : 'Create Category'}
        </button>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default AddEditCategoryPage;