import React from 'react';

interface ImageUploadProps {
  variantIndex: number;
  images: File[];
  onImagesChange: (vIndex: number, files: FileList | null) => void;
  onRemoveImage: (vIndex: number, imageIndex: number) => void;
  errors: { [key: string]: string };
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  variantIndex,
  images,
  onImagesChange,
  onRemoveImage,
  errors,
}) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Images (1–5)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => onImagesChange(variantIndex, e.target.files)}
        className="mt-1 w-full"
      />
      <div className="flex gap-2 mt-2 flex-wrap">
        {images.map((file, i) => (
          <div key={i} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`Variant ${variantIndex} Image ${i}`}
              className="w-20 h-20 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(variantIndex, i)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {errors[`variant-${variantIndex}-images`] && (
        <p className="text-red-500 text-sm mt-1">{errors[`variant-${variantIndex}-images`]}</p>
      )}
    </div>
  );
};

export default ImageUpload;