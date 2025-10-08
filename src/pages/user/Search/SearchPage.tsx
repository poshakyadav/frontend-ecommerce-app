import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { searchProducts } from '../../../services/productService';
import type { ProductVariantSummaryDTO, PagedResponse, SearchParams } from '../../../services/types';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { ToastContainer, toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import ProductCard from '../../../components/Search/ProductCard';
import FilterSidebar from '../../../components/Search/FilterSidebar';
import 'react-toastify/dist/ReactToastify.css';
import MiniNavbar from '../../../components/Search/MiniNavbar';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<PagedResponse<ProductVariantSummaryDTO> | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const location = useLocation(); 

  // Mock data (replace with actual backend calls or local storage)
  const recentSearches = ['t-shirt', 'saree'];
  const popularSearches = [
    'saree', 'kurti', 't-shirt', 'jeans', 'watch', 'shoes', 'bag', 'top',
    'dress', 'jacket', 'earrings', 'blouse', 'palazzo', 'cotton saree',
  ];

  const currentParams = useMemo((): SearchParams => ({
    q: searchParams.get('q') || '',
    // categories: searchParams.getAll('categories'),
    categories: searchParams.getAll('categories').map(decodeURIComponent),
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    sortBy: searchParams.get('sortBy') || 'relevance',
    page: Number(searchParams.get('page') || '0'),
    size: Number(searchParams.get('size') || '20'),
    tab: searchParams.get('tab') || 'all',
  }), [searchParams]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(currentParams);
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        toast.error('Failed to load search results.');
      } finally {
        setLoading(false);
      }
    };

    // Trigger fetch if there are any filters or categories from URL
    const hasFilters = currentParams.q || currentParams.categories.length > 0 || currentParams.minPrice || currentParams.maxPrice || currentParams.tab !== 'all';
    if (hasFilters) fetchResults();
    else setResults(null);
  }, [currentParams]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', e.target.value);
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', selectedItem.selected.toString());
    setSearchParams(newParams);
  };

  const handleApplyFilters = (filters: { categories: string[]; minPrice: number | undefined; maxPrice: number | undefined }) => {
    if (filters.categories.some((cat) => !cat.trim())) {
      toast.error('Invalid category filter.');
      return;
    }
    if (filters.minPrice !== undefined && (isNaN(filters.minPrice) || filters.minPrice < 0)) {
      toast.error('Invalid minimum price.');
      return;
    }
    if (filters.maxPrice !== undefined && (isNaN(filters.maxPrice) || filters.maxPrice < 0)) {
      toast.error('Invalid maximum price.');
      return;
    }
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
      toast.error('Minimum price cannot exceed maximum price.');
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('categories');
    newParams.delete('minPrice');
    newParams.delete('maxPrice');
    filters.categories.forEach((cat) => newParams.append('categories', encodeURIComponent(cat.trim())));
    if (filters.minPrice) newParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) newParams.set('maxPrice', filters.maxPrice.toString());
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({ q: currentParams.q || '', sortBy: 'relevance', page: '0', tab: 'all' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('q', searchTerm.trim());
      newParams.set('page', '0');
      setSearchParams(newParams);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Bar - Hidden on large screens */}
      <div className="sticky top-0 z-50 bg-white p-4 border-b border-gray-100 lg:hidden">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="What are you looking for today?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2.5 pl-10 pr-12 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('q');
                setSearchParams(newParams);
              }}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
            >
              <FaTimes size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
          >
            <FaFilter size={18} />
          </button>
        </form>
      </div>

        <MiniNavbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              isOpen={true}
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={handleApplyFilters}
              sortBy={currentParams.sortBy}
              onSortChange={handleSortChange}
              onClearFilters={clearFilters}
            />
          </aside>
          <main className="lg:col-span-3">
            {results && results.content.length > 0 ? (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {loading ? 'Searching...' : `${results.totalElements} Results`}
                      {currentParams.q && ` for "${currentParams.q}"`}
                    </h2>
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className="lg:hidden flex items-center space-x-2 text-gray-600 border px-3 py-1.5 rounded-md hover:bg-gray-100"
                    >
                      <FaFilter />
                      <span>Filters</span>
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <CgSpinner className="animate-spin text-indigo-600 h-12 w-12" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                      {results.content.map((item) => (
                        <ProductCard key={item.variantId} product={item} />
                      ))}
                    </div>
                    <div className="mt-8 flex justify-center">
                      <ReactPaginate
                        previousLabel="Previous"
                        nextLabel="Next"
                        breakLabel="..."
                        pageCount={results.totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        forcePage={currentParams.page}
                        containerClassName="flex space-x-2"
                        pageClassName="px-3 py-1 border rounded-md hover:bg-indigo-100"
                        activeClassName="bg-indigo-600 text-white"
                        previousClassName="px-3 py-1 border rounded-md hover:bg-indigo-100"
                        nextClassName="px-3 py-1 border rounded-md hover:bg-indigo-100"
                        disabledClassName="opacity-50 cursor-not-allowed"
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="py-8">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set('q', search);
                          setSearchParams(newParams);
                        }}
                        className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set('q', search);
                          setSearchParams(newParams);
                        }}
                        className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Filter Sidebar for Small Screens */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        sortBy={currentParams.sortBy}
        onSortChange={handleSortChange}
        onClearFilters={clearFilters}
      />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default SearchPage;