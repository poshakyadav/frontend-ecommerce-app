import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { type Banner } from '../../services/contentService';

interface CarouselProps {
  banners: Banner[];
}

const Carousel: React.FC<CarouselProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const currentBanner = banners[currentIndex];

  // Button Click Handlers
  const goToPrevious = () => {
    console.log(`Navigating to previous banner, current index: ${currentIndex}`);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length); // Circular navigation
  };

  const goToNext = () => {
    console.log(`Navigating to next banner, current index: ${currentIndex}`);
    setCurrentIndex((prev) => (prev + 1) % banners.length); // Circular navigation
  };

  if (!banners.length) return null;

  return (
    <section className="relative w-full h-[calc(100vh-64px)]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: `url("${currentBanner.imageUrl}")` }}
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        {currentBanner.title && (
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-down text-center">
            {currentBanner.title}
          </h1>
        )}
        {currentBanner.description && (
          <p className="text-lg sm:text-xl mb-8 animate-fade-in-up text-center max-w-3xl">
            {currentBanner.description}
          </p>
        )}
        {currentBanner.buttonText && currentBanner.buttonUrl && (
          <Link
            to={currentBanner.buttonUrl}
            className="inline-block bg-white text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105 animate-bounce-in"
          >
            {currentBanner.buttonText}
          </Link>
        )}
      </div>

      {/* Previous and Next buttons */}
      {banners.length > 1 && (
        <>
          <button
            title="Previous Button"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10 transition-colors hover:text-gray-200"
          >
            <FaChevronLeft className="h-8 w-8" />
          </button>

          <button
            title="Next Button"
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 transition-colors hover:text-gray-200"
          >
            <FaChevronRight className="h-8 w-8" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-gray-400 hover:bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
                title="Slide indicator"
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Carousel;
