import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const MiniNavbar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'all';

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'new-arrivals', label: 'New Arrivals' },
    { key: 'top-deals', label: 'Top Deals' },
    { key: 'trendy', label: 'Trendy' },
    { key: 'popular', label: 'Popular' },
    { key: 'recommended', label: 'Recommended' },
  ];

  const handleTabClick = (tab: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  return (
    <div className="bg-transparent sticky top-[78px] lg:top-[73px] z-40">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-center-safe space-x-4 overflow-x-auto scrollbar-hide p-1">
          {tabs.map((tab) => (
            <div className='bg-white rounded-md shadow-sm' key={tab.key}>
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentTab === tab.key
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                } whitespace-nowrap`}
              >
                {tab.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniNavbar;