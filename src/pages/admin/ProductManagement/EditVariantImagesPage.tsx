import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts, updateVariantImages } from '../../../services/productService';
import type { VariantImageUpdateDTO, ProductDetailDTO } from '../../../services/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ImageWithIndex {
  url: string;
  displayIndex: number; // 1-based index for display (1-5)
  isChecked: boolean; // Track checkbox state
}

const EditVariantImagesPage: React.FC = () => {
  const { variantId } = useParams<{ variantId: string }>();
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState<ImageWithIndex[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const products = await getAllProducts();
        const product = products.find(p => p.variants.some(v => v.id === Number(variantId)));
        if (product) {
          const variant = product.variants.find((v) => v.id === Number(variantId));
          if (variant) {
            setExistingImages(
              variant.imageUrls.map((url, index) => ({
                url,
                displayIndex: index + 1,
                isChecked: true,
              }))
            );
          } else {
            toast.error('Variant not found in product data');
          }
        } else {
          toast.error('Product containing variant not found');
        }
      } catch (error) {
        toast.error('Failed to load variant images');
      } finally {
        setLoading(false);
      }
    };
    fetchVariant();
  }, [variantId]);

  const handleIndexChange = (changedUrl: string, value: string) => {
    const newDisplayIndex = Number(value);

    if (isNaN(newDisplayIndex) || newDisplayIndex < 1 || newDisplayIndex > 5) {
      setInputErrors((prev) => ({
        ...prev,
        [changedUrl]: 'Write value between 1 to 5',
      }));
      return;
    }

    setInputErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[changedUrl];
      return newErrors;
    });

    setExistingImages((prev) => {
      const newImages = [...prev];
      const changedIdx = newImages.findIndex((img) => img.url === changedUrl);
      const oldDisplayIndex = newImages[changedIdx].displayIndex;
      newImages[changedIdx].displayIndex = newDisplayIndex;

      const conflictIdx = newImages.findIndex(
        (img) => img.url !== changedUrl && img.isChecked && img.displayIndex === newDisplayIndex
      );
      if (conflictIdx !== -1) {
        newImages[conflictIdx].displayIndex = oldDisplayIndex;
      }

      return newImages;
    });
  };

  const handleImageToggle = (url: string) => {
    setExistingImages((prev) => {
      const newImages = prev.map((img) =>
        img.url === url ? { ...img, isChecked: !img.isChecked } : img
      );

      // Reorder indices for checked images
      const checkedImages = newImages.filter((img) => img.isChecked);
      checkedImages.forEach((img, index) => {
        img.displayIndex = index + 1;
      });

      return newImages;
    });
  };

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const totalImages = existingImages.length + newImages.length + e.target.files.length;
      if (totalImages > 5) {
        toast.error('Maximum 5 images allowed');
        return;
      }
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const checkedIndices = existingImages
      .filter((img) => img.isChecked)
      .map((img) => img.displayIndex);
    const uniqueIndices = new Set(checkedIndices);
    if (uniqueIndices.size !== checkedIndices.length) {
      toast.error('Indices must be unique');
      return false;
    }
    if (checkedIndices.some((idx) => idx < 1 || idx > 5)) {
      toast.error('Indices must be between 1 and 5');
      return false;
    }
    const totalImages = existingImages.filter((img) => img.isChecked).length + newImages.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return false;
    }
    if (Object.values(inputErrors).some((error) => error)) {
      toast.error('Please fix all input errors');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const sortedImages = [...existingImages]
        .filter((img) => img.isChecked)
        .sort((a, b) => a.displayIndex - b.displayIndex);
      const data: VariantImageUpdateDTO = {
        imageUrlsToKeep: sortedImages.map((img) => img.url),
        imageOrder: sortedImages.map((img) => img.url),
      };
      await updateVariantImages(Number(variantId), data, newImages);
      toast.success('Variant images updated successfully');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating variant images:', error);
      toast.error('Failed to update variant images');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Variant Images</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="space-y-8">
          {/* Existing Images Section */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Existing Images
            </label>
            <div className="space-y-6">
              {existingImages.map((img, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${
                    !img.isChecked ? 'bg-gray-100 opacity-70' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={img.isChecked}
                      onChange={() => handleImageToggle(img.url)}
                      className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <img
                      src={img.url}
                      alt={`Existing Image ${i}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <input
                      type="text"
                      value={img.isChecked ? img.displayIndex : 'N/A'}
                      onChange={(e) => img.isChecked && handleIndexChange(img.url, e.target.value)}
                      className={`w-20 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center ${
                        inputErrors[img.url] ? 'border-red-500' : 'border-gray-300'
                      } ${!img.isChecked ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                      placeholder="1-5"
                      style={{ appearance: 'none', MozAppearance: 'textfield' }}
                      onKeyPress={(e) => !/[0-5]/.test(e.key) && e.preventDefault()}
                      disabled={!img.isChecked}
                    />
                    {inputErrors[img.url] && (
                      <p className="text-red-500 text-sm">{inputErrors[img.url]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Images Section */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Add New Images (Max 5 Total)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImagesChange}
              className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <div className="flex flex-wrap gap-4 mt-4">
              {newImages.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New Image ${i}`}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Update Images'}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditVariantImagesPage;