// MobileSearchBar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const MobileSearchBar: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/search');
  };

  return (
    <div className="md:hidden px-4 py-2 bg-white border-b border-gray-100">
      <div
        onClick={handleClick}
        className="w-full py-2.5 pl-10 pr-4 rounded-md border border-gray-200 text-gray-500 flex items-center cursor-pointer hover:bg-gray-200 transition-colors"
      >
        <FaSearch className="absolute left-6 text-gray-500" size={18} />
        <span className="flex-1">What are you looking for today?</span>
      </div>
    </div>
  );
};

export default MobileSearchBar;