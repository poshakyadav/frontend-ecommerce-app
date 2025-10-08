import React from 'react';
import Carousel from './Carousel';
import { type Banner } from '../../services/contentService';

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  return <Carousel banners={banners} />;
};

export default BannerCarousel;