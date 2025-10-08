import React, { useState } from 'react';
import type { ProductDetailDTO } from '../../services/types';

interface ProductPreviewProps {
  previewProduct: ProductDetailDTO;
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ previewProduct }) => {
  const [selectedVariant, setSelectedVariant] = useState(previewProduct.defaultVariant);
  const [selectedSize, setSelectedSize] = useState<string>(
    previewProduct.defaultVariant.sizePrices.find(sp => sp.isDefault)?.size || previewProduct.defaultVariant.sizePrices[0]?.size || ''
  );

  const handleColorChange = (hexCode: string) => {
    const variant = previewProduct.variants.find(v => v.color.hexCode === hexCode);
    if (variant) {
      setSelectedVariant(variant);
      setSelectedSize(variant.sizePrices.find(sp => sp.isDefault)?.size || variant.sizePrices[0]?.size || '');
    }
  };

  const selectedSizePrice = selectedVariant.sizePrices.find(sp => sp.size === selectedSize);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={selectedVariant.imageUrls[0] || 'https://via.placeholder.com/500?text=No+Image'}
            alt={selectedVariant.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {selectedVariant.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index}`}
                className="w-20 h-20 object-cover rounded cursor-pointer"
              />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{selectedVariant.name}</h1>
          <p className="text-gray-600 mt-2">{previewProduct.brand} | {previewProduct.category.name}</p>
          <div className="mt-4">
            <span className="text-2xl font-bold text-indigo-600">
              ₹{selectedSizePrice?.finalPrice.toFixed(2) || 'N/A'}
            </span>
            {selectedSizePrice?.discount != null && selectedSizePrice.discount > 0 && (
              <span className="text-lg text-gray-500 line-through ml-2">
                ₹{(selectedSizePrice.basePrice ?? 0).toFixed(2)}
              </span>
            )}
          </div>
          <p className="mt-4">{selectedVariant.description}</p>
          <div className="mt-4">
            <div className="mb-4">
              <label className="block font-semibold">Color</label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {previewProduct.variants.map((variant) => (
                  <button
                    key={variant.color.hexCode}
                    onClick={() => handleColorChange(variant.color.hexCode)}
                    className={`w-10 h-10 rounded-full border ${selectedVariant.color.hexCode === variant.color.hexCode ? 'border-indigo-600 border-2' : 'border-gray-300'}`}
                    style={{ backgroundColor: variant.color.hexCode }}
                    title={variant.color.name}
                    aria-label={`Select color ${variant.color.name}`}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="mt-2 w-full border rounded px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                aria-label="Select size"
              >
                {selectedVariant.sizePrices.map((sp) => (
                  <option key={sp.size} value={sp.size}>{sp.size}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-4">Stock: {selectedSizePrice?.stock ?? 0} available</p>
          <button className="mt-6 bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700" disabled>
            Add to Cart (Preview)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;