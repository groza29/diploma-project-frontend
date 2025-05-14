import React from 'react';
import { Delete, Star, StarBorder } from '@mui/icons-material';

interface ImageGalleryProps {
  imagesUrls: string[];
  onDeleteImage: (index: number) => void;
  onMoveToFirst: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  imagesUrls,
  onDeleteImage,
  onMoveToFirst,
}) => {
  if (!imagesUrls || imagesUrls.length === 0) {
    return <div className="w-full p-4 text-center text-gray-500">No images available</div>;
  }

  return (
    <div className="w-full">
      <h3 className="block text-m font-thin text-text mb-2">Uploaded Images</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {imagesUrls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative group rounded-lg overflow-hidden shadow-md border border-gray-200"
          >
            <img src={url} className="w-full h-48 object-cover" />

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button
                  onClick={() => onMoveToFirst(index)}
                  className="p-2 bg-primary rounded-full hover:bg-opacity-80 transition"
                  title={
                    index === 0 ? 'This is already the first image' : 'Make this the main image'
                  }
                  disabled={index === 0}
                >
                  {index === 0 ? (
                    <Star className="text-white" fontSize="small" />
                  ) : (
                    <StarBorder className="text-white" fontSize="small" />
                  )}
                </button>
                <button
                  onClick={() => onDeleteImage(index)}
                  className="p-2 bg-red rounded-full hover:bg-opacity-80 transition"
                  title="Delete this image"
                >
                  <Delete className="text-white" fontSize="small" />
                </button>
              </div>
            </div>

            {index === 0 && (
              <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs rounded-md">
                Main Image
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
