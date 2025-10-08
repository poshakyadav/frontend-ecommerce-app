import React from 'react';
import type { SizePriceDTO } from '../../services/types';

interface SizePriceFormProps {
  sizePrice: SizePriceDTO;
  variantIndex: number;
  sizePriceIndex: number;
  errors: { [key: string]: string };
  onSizePriceChange: (vIndex: number, spIndex: number, field: string, value: any) => void;
  onRemoveSizePrice: (vIndex: number, spIndex: number) => void;
}

const SizePriceForm: React.FC<SizePriceFormProps> = ({
  sizePrice,
  variantIndex,
  sizePriceIndex,
  errors,
  onSizePriceChange,
  onRemoveSizePrice,
}) => {
  return (
    <div className="border border-gray-200 p-4 mt-2 rounded-md bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Size</label>
          <input
            type="text"
            value={sizePrice.size || ''}
            onChange={(e) => onSizePriceChange(variantIndex, sizePriceIndex, 'size', e.target.value)}
            className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-size-${sizePriceIndex}`] ? 'border-red-500' : ''}`}
            placeholder="Enter size (e.g., M)"
            required
          />
          {errors[`variant-${variantIndex}-size-${sizePriceIndex}`] && (
            <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-size-${sizePriceIndex}`]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Base Price (₹)</label>
          <input
            type="number"
            value={sizePrice.basePrice === null ? '' : sizePrice.basePrice}
            onChange={(e) => onSizePriceChange(variantIndex, sizePriceIndex, 'basePrice', e.target.value)}
            className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-basePrice-${sizePriceIndex}`] ? 'border-red-500' : ''}`}
            placeholder="Enter base price (e.g., 1000)"
            required
            min="0"
            step="0.01"
          />
          {errors[`variant-${variantIndex}-basePrice-${sizePriceIndex}`] && (
            <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-basePrice-${sizePriceIndex}`]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            value={sizePrice.discount === null ? '' : sizePrice.discount * 100}
            onChange={(e) => onSizePriceChange(variantIndex, sizePriceIndex, 'discount', e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter discount (e.g., 40 for 40%)"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
          <input
            type="number"
            value={sizePrice.taxRate === null ? '' : sizePrice.taxRate * 100}
            onChange={(e) => onSizePriceChange(variantIndex, sizePriceIndex, 'taxRate', e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter tax rate (e.g., 18 for 18%)"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">In Stock</label>
          <input
            type="number"
            value={sizePrice.stock === null ? '' : sizePrice.stock}
            onChange={(e) => onSizePriceChange(variantIndex, sizePriceIndex, 'stock', e.target.value)}
            className={`mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[`variant-${variantIndex}-stock-${sizePriceIndex}`] ? 'border-red-500' : ''}`}
            placeholder="Enter stock (e.g., 50)"
            required
            min="0"
          />
          {errors[`variant-${variantIndex}-stock-${sizePriceIndex}`] && (
            <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-stock-${sizePriceIndex}`]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Default Size</label>
          <input
            type="checkbox"
            checked={sizePrice.isDefault}
            onChange={(e) => onSizePriceChange(variantIndex, sizePriceIndex, 'isDefault', e.target.checked)}
            className="mt-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Pricing Breakdown</label>
        <div className="bg-gray-100 p-4 rounded-md mt-2">
          <p>Discount Amount: ₹{sizePrice.discountAmount.toFixed(2)}</p>
          <p>Discounted Price: ₹{sizePrice.discountedPrice.toFixed(2)}</p>
          <p>Tax Amount: ₹{sizePrice.taxAmount.toFixed(2)}</p>
          <p className="font-bold">Final Price: ₹{sizePrice.finalPrice.toFixed(2)}</p>
        </div>
      </div>
      {sizePriceIndex > 0 && (
        <button
          type="button"
          onClick={() => onRemoveSizePrice(variantIndex, sizePriceIndex)}
          className="mt-2 text-red-500 hover:underline"
        >
          Remove Size
        </button>
      )}
    </div>
  );
};

export default SizePriceForm;