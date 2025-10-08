import React from 'react';
import Carousel from './Carousel';
import { type Banner } from '../../services/contentService';

const fallbackBanners: Banner[] = [
  {
    imageUrl: 'https://via.placeholder.com/1920x1080/1a1a1a/FFFFFF?text=Welcome+to+MyStore',
    title: 'Welcome to MyStore',
    description: 'Discover premium products designed for modern living.',
    buttonText: 'Shop Now',
    buttonUrl: '/products',
  },
  {
    imageUrl: 'https://via.placeholder.com/1920x1080/2b2b2b/FFFFFF?text=New+Arrivals',
    title: 'New Arrivals',
    description: 'Explore the latest additions to our collection.',
    buttonText: 'Explore Now',
    buttonUrl: '/new-arrivals',
  },
  {
    imageUrl: 'https://via.placeholder.com/1920x1080/3c3c3c/FFFFFF?text=Exclusive+Deals',
    title: 'Exclusive Deals',
    description: 'Save big on your favorite items today.',
    buttonText: 'View Deals',
    buttonUrl: '/deals',
  },
  {
    imageUrl: 'https://via.placeholder.com/1920x1080/4d4d4d/FFFFFF?text=Top+Categories',
    title: 'Top Categories',
    description: 'Find everything you need in one place.',
    buttonText: 'Browse Categories',
    buttonUrl: '/categories',
  },
];

const HeroSection: React.FC = () => {
  return <Carousel banners={fallbackBanners} />;
};

export default HeroSection;