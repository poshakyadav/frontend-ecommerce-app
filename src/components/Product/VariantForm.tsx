import React from 'react';
import type { VariantDTO, SizePriceDTO, VariantColorDTO } from '../../services/types';
import SizePriceForm from './SizePriceForm';
import ImageUpload from './ImageUpload';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface VariantFormProps {
  variant: VariantDTO;
  variantIndex: number;
  errors: { [key: string]: string };
  onVariantChange: (vIndex: number, field: string, value: any) => void;
  onColorChange: (vIndex: number, field: keyof VariantColorDTO, value: string) => void;
  onSizePriceChange: (vIndex: number, spIndex: number, field: string, value: any) => void;
  onAddSizePrice: (vIndex: number) => void;
  onRemoveSizePrice: (vIndex: number, spIndex: number) => void;
  onImagesChange: (vIndex: number, files: FileList | null) => void;
  onRemoveImage: (vIndex: number, imageIndex: number) => void;
  images: File[];
  isExpanded: boolean;
  onToggleExpand: (vIndex: number) => void;
}

const VariantForm: React.FC<VariantFormProps> = ({
  variant,
  variantIndex,
  errors,
  onVariantChange,
  onColorChange,
  onSizePriceChange,
  onAddSizePrice,
  onRemoveSizePrice,
  onImagesChange,
  onRemoveImage,
  images,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <div className="border border-gray-200 p-6 mt-4 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold">Variant {variantIndex + 1}</h3>
        <button
          type="button"
          onClick={() => onToggleExpand(variantIndex)}
          className="text-indigo-600 hover:underline"
        >
          {isExpanded ? <FiChevronUp className="h-5 w-5 inline" /> : <FiChevronDown className="h-5 w-5 inline" />}
        </button>
      </div>
      {isExpanded && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Variant Name</label>
              <input
                type="text"
                value={variant.name}
                onChange={(e) => onVariantChange(variantIndex, 'name', e.target.value)}
                className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-name`] ? 'border-red-500' : ''}`}
                placeholder="Enter variant name (e.g., Men's Crimson T-Shirt)"
                required
              />
              {errors[`variant-${variantIndex}-name`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-name`]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                value={variant.sku}
                onChange={(e) => onVariantChange(variantIndex, 'sku', e.target.value)}
                className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-sku`] ? 'border-red-500' : ''}`}
                placeholder="Enter SKU (e.g., TSHIRT-RED-M)"
                required
              />
              {errors[`variant-${variantIndex}-sku`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-sku`]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color Name</label>
              <input
                type="text"
                value={variant.color.name}
                onChange={(e) => onColorChange(variantIndex, 'name', e.target.value)}
                className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-color-name`] ? 'border-red-500' : ''}`}
                placeholder="Enter color name (e.g., Crimson Red)"
                required
              />
              {errors[`variant-${variantIndex}-color-name`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-color-name`]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color Hex Code</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={variant.color.hexCode}
                  onChange={(e) => onColorChange(variantIndex, 'hexCode', e.target.value)}
                  className="mt-1 w-10 h-10 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={variant.color.hexCode}
                  onChange={(e) => onColorChange(variantIndex, 'hexCode', e.target.value)}
                  className={`mt-1 ml-2 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-color-hex`] ? 'border-red-500' : ''}`}
                  placeholder="Enter hex code (e.g., #DC143C)"
                  required
                />
              </div>
              {errors[`variant-${variantIndex}-color-hex`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-color-hex`]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
              <input
                type="number"
                value={variant.length || ''}
                onChange={(e) => onVariantChange(variantIndex, 'length', e.target.value ? Number(e.target.value) : 0)}
                className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-length`] ? 'border-red-500' : ''}`}
                placeholder="Enter length (e.g., 70)"
                required
                min="0"
              />
              {errors[`variant-${variantIndex}-length`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-length`]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Breadth (cm)</label>
              <input
                type="number"
                value={variant.breadth || ''}
                onChange={(e) => onVariantChange(variantIndex, 'breadth', e.target.value ? Number(e.target.value) : 0)}
                className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-breadth`] ? 'border-red-500' : ''}`}
                placeholder="Enter breadth (e.g., 50)"
                required
                min="0"
              />
              {errors[`variant-${variantIndex}-breadth`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-breadth`]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                value={variant.height || ''}
                onChange={(e) => onVariantChange(variantIndex, 'height', e.target.value ? Number(e.target.value) : 0)}
                className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-height`] ? 'border-red-500' : ''}`}
                placeholder="Enter height (e.g., 10)"
                required
                min="0"
              />
              {errors[`variant-${variantIndex}-height`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-height`]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                value={variant.weight || ''}
                onChange={(e) => onVariantChange(variantIndex, 'weight', e.target.value ? Number(e.target.value) : 0)}
                className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-weight`] ? 'border-red-500' : ''}`}
                placeholder="Enter weight (e.g., 0.5)"
                required
                min="0"
              />
              {errors[`variant-${variantIndex}-weight`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-weight`]}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Variant Description</label>
            <textarea
              value={variant.description}
              onChange={(e) => onVariantChange(variantIndex, 'description', e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              placeholder="Enter variant description"
            />
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Size Prices</h4>
            {variant.sizePrices.map((sp, spIndex) => (
              <SizePriceForm
                key={spIndex}
                sizePrice={sp}
                variantIndex={variantIndex}
                sizePriceIndex={spIndex}
                errors={errors}
                onSizePriceChange={onSizePriceChange}
                onRemoveSizePrice={onRemoveSizePrice}
              />
            ))}
            <button
              type="button"
              onClick={() => onAddSizePrice(variantIndex)}
              className="mt-2 text-indigo-600 hover:underline"
            >
              Add Size
            </button>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Variant Flags</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={variant.isNewArrival}
                  onChange={(e) => onVariantChange(variantIndex, 'isNewArrival', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">New Arrival</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={variant.isTrendy}
                  onChange={(e) => onVariantChange(variantIndex, 'isTrendy', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Trendy</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={variant.isRecommended}
                  onChange={(e) => onVariantChange(variantIndex, 'isRecommended', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Recommended</span>
              </label>
            </div>
          </div>

          <ImageUpload
            variantIndex={variantIndex}
            images={images}
            onImagesChange={onImagesChange}
            onRemoveImage={onRemoveImage}
            errors={errors}
          />
        </>
      )}
    </div>
  );
};

export default VariantForm;