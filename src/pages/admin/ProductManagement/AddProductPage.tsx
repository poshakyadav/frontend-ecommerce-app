import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../../services/categoryService';
import { createProduct } from '../../../services/productService';
import type { ProductCreateDTO, CategoryResponse, ProductDetailDTO, SizePriceDTO, VariantColorDTO } from '../../../services/types';
import { ToastContainer, toast } from 'react-toastify';
import ProductPreview from '../../../components/Product/ProductPreview';
import VariantForm from '../../../components/Product/VariantForm';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductCreateDTO>({
    brand: '',
    categoryId: 0,
    variants: [{
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
      imageKeys: [],
      isNewArrival: false,
      isTrendy: false,
      isRecommended: false,
    }],
  });
  const [variantImages, setVariantImages] = useState<File[][]>([[]]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [expandedVariants, setExpandedVariants] = useState<Set<number>>(new Set([0]));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      variantImages.flat().forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
    };
  }, [variantImages]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    formData.variants.forEach((variant, vIndex) => {
      if (!variant.name) newErrors[`variant-${vIndex}-name`] = 'Variant name is required';
      if (!variant.sku) newErrors[`variant-${vIndex}-sku`] = 'SKU is required';
      if (!variant.color.name) newErrors[`variant-${vIndex}-color-name`] = 'Color name is required';
      if (!/^#[0-9A-Fa-f]{6}$/.test(variant.color.hexCode)) newErrors[`variant-${vIndex}-color-hex`] = 'Valid hex code required (e.g., #FF0000)';
      if (variant.sizePrices.length === 0) newErrors[`variant-${vIndex}-sizePrices`] = 'At least one size is required';
      variant.sizePrices.forEach((sp, spIndex) => {
        if (!sp.size) newErrors[`variant-${vIndex}-size-${spIndex}`] = 'Size is required';
        if (sp.basePrice === null || sp.basePrice <= 0) newErrors[`variant-${vIndex}-basePrice-${spIndex}`] = 'Base price must be positive';
        if (sp.stock === null || sp.stock < 0) newErrors[`variant-${vIndex}-stock-${spIndex}`] = 'Stock cannot be negative';
      });
      if (variant.length <= 0) newErrors[`variant-${vIndex}-length`] = 'Length must be positive';
      if (variant.breadth <= 0) newErrors[`variant-${vIndex}-breadth`] = 'Breadth must be positive';
      if (variant.height <= 0) newErrors[`variant-${vIndex}-height`] = 'Height must be positive';
      if (variant.weight <= 0) newErrors[`variant-${vIndex}-weight`] = 'Weight must be positive';
      if (!variantImages[vIndex] || variantImages[vIndex].length === 0) {
        newErrors[`variant-${vIndex}-images`] = 'At least one image is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleVariantChange = (vIndex: number, field: string, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[vIndex] = { ...updatedVariants[vIndex], [field]: value };
    setFormData({ ...formData, variants: updatedVariants });
    setErrors({ ...errors, [`variant-${vIndex}-${field}`]: '' });
  };

  const handleColorChange = (vIndex: number, field: keyof VariantColorDTO, value: string) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[vIndex].color = { ...updatedVariants[vIndex].color, [field]: value };
    setFormData({ ...formData, variants: updatedVariants });
    setErrors({ ...errors, [`variant-${vIndex}-color-${field}`]: '' });
  };

  const handleSizePriceChange = (vIndex: number, spIndex: number, field: string, value: any) => {
    const updatedVariants = [...formData.variants];
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
    setFormData({ ...formData, variants: updatedVariants });
    setErrors({ ...errors, [`variant-${vIndex}-${field}-${spIndex}`]: '' });
  };

  const addSizePrice = (vIndex: number) => {
    const updatedVariants = [...formData.variants];
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
    setFormData({ ...formData, variants: updatedVariants });
  };

  const removeSizePrice = (vIndex: number, spIndex: number) => {
    const updatedVariants = [...formData.variants];
    if (updatedVariants[vIndex].sizePrices.length === 1) {
      toast.error('At least one size is required');
      return;
    }
    updatedVariants[vIndex].sizePrices = updatedVariants[vIndex].sizePrices.filter((_, i) => i !== spIndex);
    if (!updatedVariants[vIndex].sizePrices.some(sp => sp.isDefault)) {
      updatedVariants[vIndex].sizePrices[0].isDefault = true;
    }
    setFormData({ ...formData, variants: updatedVariants });
    setErrors({ ...errors, [`variant-${vIndex}-size-${spIndex}`]: '' });
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
      const newImageKeys = newImages.map((file, index) => `image_${vIndex}_${updatedImages[vIndex].length - newImages.length + index}_${file.name}`);
      const updatedVariants = [...formData.variants];
      updatedVariants[vIndex].imageKeys = [...(updatedVariants[vIndex].imageKeys || []), ...newImageKeys];
      setFormData({ ...formData, variants: updatedVariants });
      setErrors({ ...errors, [`variant-${vIndex}-images`]: '' });
    }
  };

  const removeImage = (vIndex: number, imageIndex: number) => {
    const updatedImages = [...variantImages];
    updatedImages[vIndex] = updatedImages[vIndex].filter((_, i) => i !== imageIndex);
    setVariantImages(updatedImages);
    const updatedVariants = [...formData.variants];
    updatedVariants[vIndex].imageKeys = (updatedVariants[vIndex].imageKeys || []).filter((_, i) => i !== imageIndex);
    setFormData({ ...formData, variants: updatedVariants });
  };

  const addVariant = () => {
    const newVariantIndex = formData.variants.length;
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
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
          imageKeys: [],
          isNewArrival: false,
          isTrendy: false,
          isRecommended: false,
        },
      ],
    });
    setVariantImages([...variantImages, []]);
    setExpandedVariants(new Set([...expandedVariants, newVariantIndex]));
  };

  const removeVariant = (vIndex: number) => {
    if (formData.variants.length === 1) {
      toast.error('At least one variant is required');
      return;
    }
    setFormData({ ...formData, variants: formData.variants.filter((_, i) => i !== vIndex) });
    setVariantImages(variantImages.filter((_, i) => i !== vIndex));
    setExpandedVariants(new Set([...expandedVariants].filter(id => id !== vIndex)));
  };

  const toggleVariant = (vIndex: number) => {
    setExpandedVariants(prev => {
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
      await createProduct(formData, variantImages);
      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const previewProduct: ProductDetailDTO = {
    id: 0,
    brand: formData.brand,
    category: categories.find(c => c.id === formData.categoryId) || { id: 0, name: 'Unknown' },
    defaultVariant: {
      id: 0,
      name: formData.variants[0]?.name || '',
      sku: formData.variants[0]?.sku || '',
      description: formData.variants[0]?.description || '',
      imageUrls: variantImages[0]?.map(file => URL.createObjectURL(file)) || [],
      color: formData.variants[0]?.color || { id: 0, name: '', hexCode: '#000000' },
      sizePrices: formData.variants[0]?.sizePrices || [],
      length: formData.variants[0]?.length || 0,
      breadth: formData.variants[0]?.breadth || 0,
      height: formData.variants[0]?.height || 0,
      weight: formData.variants[0]?.weight || 0,
    },
    variants: formData.variants.map((v, i) => ({
      id: i,
      name: v.name,
      sku: v.sku,
      description: v.description,
      imageUrls: variantImages[i]?.map(file => URL.createObjectURL(file)) || [],
      color: v.color,
      sizePrices: v.sizePrices,
      length: v.length || 0,
      breadth: v.breadth || 0,
      height: v.height || 0,
      weight: v.weight || 0,
    })),
    availableAttributes: { Color: formData.variants.map(v => v.color.name).filter(name => name) },
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    reviews: [],
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Product</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded ${activeTab === 'edit' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded ${activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Preview
          </button>
        </div>
      </div>
      {activeTab === 'preview' ? (
        <ProductPreview previewProduct={previewProduct} />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.brand ? 'border-red-500' : ''}`}
                placeholder="Enter brand name (e.g., Nike)"
                required
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
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>
            <div>
              <h2 className="text-lg font-semibold">Variants</h2>
              {formData.variants.map((variant, vIndex) => (
                <VariantForm
                  key={vIndex}
                  variant={variant}
                  variantIndex={vIndex}
                  errors={errors}
                  onVariantChange={handleVariantChange}
                  onColorChange={handleColorChange}
                  onSizePriceChange={handleSizePriceChange}
                  onAddSizePrice={addSizePrice}
                  onRemoveSizePrice={removeSizePrice}
                  onImagesChange={handleImagesChange}
                  onRemoveImage={removeImage}
                  images={variantImages[vIndex]}
                  isExpanded={expandedVariants.has(vIndex)}
                  onToggleExpand={toggleVariant}
                />
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="mt-4 text-indigo-600 hover:underline"
              >
                Add Variant
              </button>
              {formData.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(formData.variants.length - 1)}
                  className="mt-4 ml-4 text-red-500 hover:underline"
                >
                  Remove Last Variant
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Create Product'}
            </button>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
};

export default AddProductPage;