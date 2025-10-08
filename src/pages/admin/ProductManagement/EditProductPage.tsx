import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetails, updateProduct } from '../../../services/productService';
import { getAllCategories } from '../../../services/categoryService';
import type { ProductUpdateDTO, CategoryResponse, ProductDetailDTO, SizePriceDTO, VariantColorDTO, NewVariantDTO } from '../../../services/types';
import { ToastContainer, toast } from 'react-toastify';
import VariantForm from '../../../components/Product/VariantForm';

const EditProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductUpdateDTO>({
    id: Number(productId),
    brand: '',
    categoryId: 0,
    newVariants: [],
  });
  const [variantImages, setVariantImages] = useState<File[][]>([]);
  const [existingProduct, setExistingProduct] = useState<ProductDetailDTO | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [expandedNewVariants, setExpandedNewVariants] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [product, categoriesData] = await Promise.all([
          getProductDetails(Number(productId)),
          getAllCategories(),
        ]);
        setFormData({
          id: product.id,
          brand: product.brand,
          categoryId: product.category.id,
          newVariants: [],
        });
        setExistingProduct(product);
        setCategories(categoriesData);
      } catch (error) {
        toast.error('Failed to load product or categories');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  useEffect(() => {
    return () => {
      variantImages.flat().forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
    };
  }, [variantImages]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    formData.newVariants.forEach((variant, vIndex) => {
      if (!variant.name) newErrors[`new-variant-${vIndex}-name`] = 'Variant name is required';
      if (!variant.sku) newErrors[`new-variant-${vIndex}-sku`] = 'SKU is required';
      if (!variant.color.name) newErrors[`new-variant-${vIndex}-color-name`] = 'Color name is required';
      if (!/^#[0-9A-Fa-f]{6}$/.test(variant.color.hexCode)) newErrors[`new-variant-${vIndex}-color-hex`] = 'Valid hex code required (e.g., #FF0000)';
      if (variant.sizePrices.length === 0) newErrors[`new-variant-${vIndex}-sizePrices`] = 'At least one size is required';
      variant.sizePrices.forEach((sp, spIndex) => {
        if (!sp.size) newErrors[`new-variant-${vIndex}-size-${spIndex}`] = 'Size is required';
        if (sp.basePrice === null || sp.basePrice <= 0) newErrors[`new-variant-${vIndex}-basePrice-${spIndex}`] = 'Base price must be positive';
        if (sp.stock === null || sp.stock < 0) newErrors[`new-variant-${vIndex}-stock-${spIndex}`] = 'Stock cannot be negative';
      });
      if (variant.length <= 0) newErrors[`new-variant-${vIndex}-length`] = 'Length must be positive';
      if (variant.breadth <= 0) newErrors[`new-variant-${vIndex}-breadth`] = 'Breadth must be positive';
      if (variant.height <= 0) newErrors[`new-variant-${vIndex}-height`] = 'Height must be positive';
      if (variant.weight <= 0) newErrors[`new-variant-${vIndex}-weight`] = 'Weight must be positive';
      if (!variantImages[vIndex] || variantImages[vIndex].length === 0) {
        newErrors[`new-variant-${vIndex}-images`] = 'At least one image is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const addNewVariant = () => {
    const newVariantIndex = formData.newVariants.length;
    setFormData(prev => ({
      ...prev,
      newVariants: [
        ...prev.newVariants,
        {
          name: '',
          sku: '',
          description: '',
          color: { id: 0, name: '', hexCode: '#000000' },
          sizePrices: [{
            size: '',
            basePrice: null,
            discount: null,
            taxRate: null,
            stock: null,
            isDefault: true,
            discountAmount: 0,
            discountedPrice: 0,
            taxAmount: 0,
            totalPrice: 0,
            finalPrice: 0,
          }],
          length: 0,
          breadth: 0,
          height: 0,
          weight: 0,
          isNewArrival: false,
          isTrendy: false,
          isRecommended: false,
        },
      ],
    }));
    setVariantImages(prev => [...prev, []]);
    setExpandedNewVariants(prev => new Set([...prev, newVariantIndex]));
  };

  const removeNewVariant = (vIndex: number) => {
    setFormData(prev => ({
      ...prev,
      newVariants: prev.newVariants.filter((_, i) => i !== vIndex),
    }));
    setVariantImages(prev => prev.filter((_, i) => i !== vIndex));
    setExpandedNewVariants(prev => {
      const newSet = new Set(prev);
      newSet.delete(vIndex);
      return newSet;
    });
  };

  const handleNewVariantChange = (vIndex: number, field: string, value: any) => {
    const updatedVariants = [...formData.newVariants];
    updatedVariants[vIndex] = { ...updatedVariants[vIndex], [field]: value };
    setFormData({ ...formData, newVariants: updatedVariants });
    setErrors({ ...errors, [`new-variant-${vIndex}-${field}`]: '' });
  };

  const handleColorChange = (vIndex: number, field: keyof VariantColorDTO, value: string) => {
    const updatedVariants = [...formData.newVariants];
    updatedVariants[vIndex].color = { ...updatedVariants[vIndex].color, [field]: value };
    setFormData({ ...formData, newVariants: updatedVariants });
    setErrors({ ...errors, [`new-variant-${vIndex}-color-${field}`]: '' });
  };

  const calculatePricing = (sizePrice: SizePriceDTO) => {
    const basePrice = sizePrice.basePrice || 0;
    const discount = sizePrice.discount !== null ? sizePrice.discount : 0;
    const taxRate = sizePrice.taxRate !== null ? sizePrice.taxRate : 0;
    const discountAmount = basePrice * discount;
    const discountedPrice = basePrice - discountAmount;
    const taxAmount = discountedPrice * taxRate;
    const totalPrice = discountedPrice;
    const finalPrice = totalPrice + taxAmount;
    return { discountAmount, discountedPrice, taxAmount, totalPrice, finalPrice };
  };

  const handleSizePriceChange = (vIndex: number, spIndex: number, field: string, value: any) => {
    const updatedVariants = [...formData.newVariants];
    const updatedSizePrices = [...updatedVariants[vIndex].sizePrices];
    let parsedValue: any;
    if (field === 'size') {
      parsedValue = value;
    } else if (field === 'isDefault') {
      parsedValue = value;
    } else if (field === 'discount' || field === 'taxRate') {
      parsedValue = value === '' ? null : Number(value) / 100;
    } else {
      parsedValue = value === '' ? null : Number(value);
    }
    updatedSizePrices[spIndex] = { ...updatedSizePrices[spIndex], [field]: parsedValue };
    if (field === 'isDefault' && value) {
      updatedSizePrices.forEach((sp, i) => sp.isDefault = i === spIndex);
    }
    if (['basePrice', 'discount', 'taxRate'].includes(field)) {
      const pricing = calculatePricing(updatedSizePrices[spIndex]);
      updatedSizePrices[spIndex] = { ...updatedSizePrices[spIndex], ...pricing };
    }
    updatedVariants[vIndex].sizePrices = updatedSizePrices;
    setFormData({ ...formData, newVariants: updatedVariants });
    setErrors({ ...errors, [`new-variant-${vIndex}-${field}-${spIndex}`]: '' });
  };

  const addSizePrice = (vIndex: number) => {
    const updatedVariants = [...formData.newVariants];
    updatedVariants[vIndex].sizePrices.push({
      size: '',
      basePrice: null,
      discount: null,
      taxRate: null,
      stock: null,
      isDefault: updatedVariants[vIndex].sizePrices.length === 0,
      discountAmount: 0,
      discountedPrice: 0,
      taxAmount: 0,
      totalPrice: 0,
      finalPrice: 0,
    });
    setFormData({ ...formData, newVariants: updatedVariants });
  };

  const removeSizePrice = (vIndex: number, spIndex: number) => {
    const updatedVariants = [...formData.newVariants];
    if (updatedVariants[vIndex].sizePrices.length === 1) {
      toast.error('At least one size is required');
      return;
    }
    updatedVariants[vIndex].sizePrices = updatedVariants[vIndex].sizePrices.filter((_, i) => i !== spIndex);
    if (!updatedVariants[vIndex].sizePrices.some(sp => sp.isDefault)) {
      updatedVariants[vIndex].sizePrices[0].isDefault = true;
    }
    setFormData({ ...formData, newVariants: updatedVariants });
    setErrors({ ...errors, [`new-variant-${vIndex}-size-${spIndex}`]: '' });
  };

  const handleImagesChange = (vIndex: number, files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - variantImages[vIndex].length);
      if (newImages.length + variantImages[vIndex].length > 5) {
        toast.error('Maximum 5 images allowed per variant');
        return;
      }
      const updatedImages = [...variantImages];
      updatedImages[vIndex] = [...updatedImages[vIndex], ...newImages];
      setVariantImages(updatedImages);
      setErrors({ ...errors, [`new-variant-${vIndex}-images`]: '' });
    }
  };

  const removeImage = (vIndex: number, imageIndex: number) => {
    const updatedImages = [...variantImages];
    updatedImages[vIndex] = updatedImages[vIndex].filter((_, i) => i !== imageIndex);
    setVariantImages(updatedImages);
  };

  const toggleNewVariant = (vIndex: number) => {
    setExpandedNewVariants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vIndex)) newSet.delete(vIndex);
      else newSet.add(vIndex);
      return newSet;
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }
    setLoading(true);
    try {
      await updateProduct(Number(productId), formData, variantImages);
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product ID</label>
            <input
              type="text"
              value={formData.id}
              readOnly
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.brand ? 'border-red-500' : ''}`}
              placeholder="Enter brand name (e.g., Nike)"
            />
            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.categoryId ? 'border-red-500' : ''}`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Existing Variants</h2>
            {existingProduct?.variants.length === 0 ? (
              <p className="text-gray-600">No existing variants.</p>
            ) : (
              existingProduct?.variants.map((variant) => (
                <div key={variant.id} className="p-4 border-b">
                  <p><strong>Name:</strong> {variant.name}</p>
                  <p><strong>SKU:</strong> {variant.sku}</p>
                  <p><strong>Color:</strong> {variant.color.name} ({variant.color.hexCode})</p>
                  <p><strong>Sizes:</strong> {variant.sizePrices.map(sp => `${sp.size} (₹${sp.finalPrice})`).join(', ')}</p>
                </div>
              ))
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">Add New Variants</h2>
            {formData.newVariants.length === 0 ? (
              <p className="text-gray-600">No new variants added yet.</p>
            ) : (
              formData.newVariants.map((variant, vIndex) => (
                <div key={vIndex} className="relative">
                  <VariantForm
                    variant={variant}
                    variantIndex={vIndex}
                    errors={errors}
                    onVariantChange={handleNewVariantChange}
                    onColorChange={handleColorChange}
                    onSizePriceChange={handleSizePriceChange}
                    onAddSizePrice={addSizePrice}
                    onRemoveSizePrice={removeSizePrice}
                    onImagesChange={handleImagesChange}
                    onRemoveImage={removeImage}
                    images={variantImages[vIndex]}
                    isExpanded={expandedNewVariants.has(vIndex)}
                    onToggleExpand={toggleNewVariant}
                  />
                  <button
                    type="button"
                    onClick={() => removeNewVariant(vIndex)}
                    className="absolute top-2 right-2 text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
            <button
              type="button"
              onClick={addNewVariant}
              className="mt-4 text-indigo-600 hover:underline"
            >
              Add New Variant
            </button>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default EditProductPage;