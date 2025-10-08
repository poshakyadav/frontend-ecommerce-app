import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerCarousel from '../../../components/Home/BannerCarousel';
import CategorySection from '../../../components/Home/CategorySection';
import HeroSection from '../../../components/Home/HeroSection';
import NewsletterCTA from '../../../components/Home/NewsletterCTA';
import { getAllCategories } from '../../../services/categoryService';
import { getContentByKey, type ContentResponse } from '../../../services/contentService';
import { searchProducts } from '../../../services/productService';
import type { CategoryResponse, ProductVariantSummaryDTO } from '../../../services/types';
import './HomePage.css';
import ProductCarousel from '../../../components/Home/ProductCarousel';
import { FaChevronRight } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [trendyProducts, setTrendyProducts] = useState<ProductVariantSummaryDTO[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductVariantSummaryDTO[]>([]);
  const [homeBanner, setHomeBanner] = useState<ContentResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        const [categoriesData, trendyData, newArrivalsData, bannerData] = await Promise.all([
          getAllCategories(),
          searchProducts({ tab: 'trendy', page: 0, size: 8 }),
          searchProducts({ tab: 'new-arrivals', page: 0, size: 8 }),
          getContentByKey('home_banner').catch(() => null),
        ]);

        setCategories(categoriesData);
        setTrendyProducts(trendyData.content);
        setNewArrivals(newArrivalsData.content);
        setHomeBanner(bannerData);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      }
    };

    fetchHomePageData();
  }, []);

  const handleCategorySelect = (id: number) => {
    const selectedCategory = categories.find((cat) => cat.id === id);
    if (selectedCategory) {
      navigate(`/search?categories=${encodeURIComponent(selectedCategory.name)}`);
    }
  };

  const handleProductClick = (id: number) => navigate(`/product/${id}`);

  const handleViewAll = (tab: string) => {
    navigate(`/search?tab=${tab}`);
  };

  return (
    <div className="hm-page space-y-12 md:space-y-16 bg-gray-50 dark:bg-gray-900">
      {homeBanner && homeBanner.banners ? (
        <BannerCarousel banners={JSON.parse(homeBanner.banners)} />
      ) : (
        <HeroSection />
      )}
      <CategorySection categories={categories} onSelect={handleCategorySelect} />
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center leading-tight tracking-tight text-blue-600 dark:text-blue-500">
            New Arrivals
          </h2>
          <button
            onClick={() => handleViewAll('new-arrivals')}
            className="flex items-center text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-50 hover:text-indigo-700 transition-all duration-300"
          >
            VIEW ALL <FaChevronRight className="h-3 sm:h-4 pt-0.5 sm:pt-0" />
          </button>
        </div>
        <ProductCarousel products={newArrivals} onProductClick={handleProductClick} />
      </section>
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center leading-tight tracking-tight text-blue-600 dark:text-blue-500">
            Trendy Products
          </h2>
          <button
            onClick={() => handleViewAll('trendy')}
            className="flex items-center text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-50 hover:text-indigo-700 transition-all duration-300"
          >
            VIEW ALL <FaChevronRight className="h-3 sm:h-4 pt-0.5 sm:pt-0" />
          </button>
        </div>
        <ProductCarousel products={trendyProducts} onProductClick={handleProductClick} />
      </section>
      <NewsletterCTA />
    </div>
  );
};

export default HomePage;