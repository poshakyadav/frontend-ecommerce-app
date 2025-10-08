import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts, getProductDetails, updateVariantDetails } from '../../../services/productService';
import type { VariantUpdateDTO, SizePriceDTO, VariantColorDTO } from '../../../services/types';
import { ToastContainer, toast } from 'react-toastify';
import SizePriceForm from '../../../components/Product/SizePriceForm';

const EditVariantPage: React.FC = () => {
  const { variantId } = useParams<{ variantId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VariantUpdateDTO>({
    name: '',
    sku: '',
    description: '',
    color: { id: 0, name: '', hexCode: '#000000' },
    sizePrices: [],
    length: 0,
    breadth: 0,
    height: 0,
    weight: 0,
    isNewArrival: false,
    isTrendy: false,
    isRecommended: false,
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchVariant = async () => {
      if (!variantId) {
        toast.error('Variant ID is missing');
        setLoading(false);
        return;
      }
      try {
        // Fetch all products to find the one containing the variant
        const products = await getAllProducts(); // Assuming getAllProducts is available
        const product = products.find(p => p.variants.some(v => v.id === Number(variantId)));
        if (product) {
          const variant = product.variants.find(v => v.id === Number(variantId));
          if (variant) {
            setFormData({
              name: variant.name || '',
              sku: variant.sku || '',
              description: variant.description || '',
              color: {
                id: variant.color.id || 0,
                name: variant.color.name || '',
                hexCode: variant.color.hexCode || '#000000',
              },
              sizePrices: variant.sizePrices.map(sp => ({
                id: sp.id,
                size: sp.size || '',
                basePrice: sp.basePrice ?? null,
                discount: sp.discount ?? null,
                taxRate: sp.taxRate ?? null,
                stock: sp.stock ?? null,
                isDefault: sp.isDefault || false,
                discountAmount: sp.discountAmount || 0,
                discountedPrice: sp.discountedPrice || 0,
                taxAmount: sp.taxAmount || 0,
                totalPrice: sp.totalPrice || 0,
                finalPrice: sp.finalPrice || 0,
              })),
              length: variant.length || 0,
              breadth: variant.breadth || 0,
              height: variant.height || 0,
              weight: variant.weight || 0,
              isNewArrival: variant.newArrival || false,
              isTrendy: variant.trendy || false,
              isRecommended: variant.recommended || false,
            });
          } else {
            toast.error('Variant not found in product data');
          }
        } else {
          toast.error('Product containing variant not found');
        }
      } catch (error) {
        console.error('Error fetching variant:', error);
        toast.error('Failed to load variant');
      } finally {
        setLoading(false);
      }
    };
    fetchVariant();
  }, [variantId]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Variant name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.color.name.trim()) newErrors['color-name'] = 'Color name is required';
    if (!/^#[0-9A-Fa-f]{6}$/.test(formData.color.hexCode)) newErrors['color-hex'] = 'Valid hex code required (e.g., #FF0000)';
    if (formData.sizePrices.length === 0) newErrors.sizePrices = 'At least one size is required';
    formData.sizePrices.forEach((sp, spIndex) => {
      if (!sp.size.trim()) newErrors[`size-${spIndex}`] = 'Size is required';
      if (sp.basePrice === null || sp.basePrice <= 0) newErrors[`basePrice-${spIndex}`] = 'Base price must be positive';
      if (sp.stock === null || sp.stock < 0) newErrors[`stock-${spIndex}`] = 'Stock cannot be negative';
    });
    if (formData.length <= 0) newErrors.length = 'Length must be positive';
    if (formData.breadth <= 0) newErrors.breadth = 'Breadth must be positive';
    if (formData.height <= 0) newErrors.height = 'Height must be positive';
    if (formData.weight <= 0) newErrors.weight = 'Weight must be positive';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePricing = (sizePrice: SizePriceDTO): Partial<SizePriceDTO> => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? (value === '' ? 0 : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleColorChange = (field: keyof VariantColorDTO, value: string) => {
    setFormData(prev => ({
      ...prev,
      color: { ...prev.color, [field]: value },
    }));
    setErrors(prev => ({ ...prev, [`color-${field}`]: '' }));
  };

  const handleSizePriceChange = (vIndex: number, spIndex: number, field: string, value: any) => {
    const updatedSizePrices = [...formData.sizePrices];
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
    setFormData(prev => ({ ...prev, sizePrices: updatedSizePrices }));
    setErrors(prev => ({ ...prev, [`${field}-${spIndex}`]: '' }));
  };

  const addSizePrice = () => {
    setFormData(prev => ({
      ...prev,
      sizePrices: [
        ...prev.sizePrices,
        {
          size: '',
          basePrice: null,
          discount: null,
          taxRate: null,
          stock: null,
          isDefault: prev.sizePrices.length === 0,
          discountAmount: 0,
          discountedPrice: 0,
          taxAmount: 0,
          totalPrice: 0,
          finalPrice: 0,
        },
      ],
    }));
  };

  const removeSizePrice = (spIndex: number) => {
    if (formData.sizePrices.length <= 1) {
      toast.error('At least one size is required');
      return;
    }
    const updatedSizePrices = formData.sizePrices.filter((_, i) => i !== spIndex);
    if (!updatedSizePrices.some(sp => sp.isDefault) && updatedSizePrices.length > 0) {
      updatedSizePrices[0].isDefault = true;
    }
    setFormData(prev => ({ ...prev, sizePrices: updatedSizePrices }));
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(prev).forEach(key => {
        if (key.includes(`-${spIndex}`)) delete newErrors[key];
      });
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }
    if (!variantId) {
      toast.error('Variant ID is missing');
      return;
    }
    setLoading(true);
    try {
      await updateVariantDetails(Number(variantId), formData);
      toast.success('Variant updated successfully');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating variant:', error);
      toast.error('Failed to update variant');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Variant</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Variant Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter variant name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.sku ? 'border-red-500' : ''}`}
              placeholder="Enter SKU"
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color Name</label>
            <input
              type="text"
              value={formData.color.name}
              onChange={(e) => handleColorChange('name', e.target.value)}
              className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors['color-name'] ? 'border-red-500' : ''}`}
              placeholder="Enter color name"
            />
            {errors['color-name'] && <p className="text-red-500 text-sm mt-1">{errors['color-name']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color Hex Code</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formData.color.hexCode}
                onChange={(e) => handleColorChange('hexCode', e.target.value)}
                className="mt-1 w-10 h-10 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={formData.color.hexCode}
                onChange={(e) => handleColorChange('hexCode', e.target.value)}
                className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors['color-hex'] ? 'border-red-500' : ''}`}
                placeholder="#000000"
              />
            </div>
            {errors['color-hex'] && <p className="text-red-500 text-sm mt-1">{errors['color-hex']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.length ? 'border-red-500' : ''}`}
              min="0"
              step="0.01"
            />
            {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Breadth (cm)</label>
            <input
              type="number"
              name="breadth"
              value={formData.breadth}
              onChange={handleChange}
              className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.breadth ? 'border-red-500' : ''}`}
              min="0"
              step="0.01"
            />
            {errors.breadth && <p className="text-red-500 text-sm mt-1">{errors.breadth}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.height ? 'border-red-500' : ''}`}
              min="0"
              step="0.01"
            />
            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.weight ? 'border-red-500' : ''}`}
              min="0"
              step="0.01"
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Size Prices</h2>
            {formData.sizePrices.map((sizePrice, spIndex) => (
              <SizePriceForm
                key={spIndex}
                sizePrice={sizePrice}
                variantIndex={0}
                sizePriceIndex={spIndex}
                errors={errors}
                onSizePriceChange={handleSizePriceChange}
                onRemoveSizePrice={removeSizePrice}
              />
            ))}
            <button
              type="button"
              onClick={addSizePrice}
              className="mt-2 text-indigo-600 hover:underline"
            >
              Add Size
            </button>
            {errors.sizePrices && <p className="text-red-500 text-sm mt-1">{errors.sizePrices}</p>}
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Variant Flags</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isNewArrival}
                  onChange={(e) => setFormData(prev => ({ ...prev, isNewArrival: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">New Arrival</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isTrendy}
                  onChange={(e) => setFormData(prev => ({ ...prev, isTrendy: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Trendy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isRecommended}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecommended: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Recommended</span>
              </label>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Update Variant'}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditVariantPage;