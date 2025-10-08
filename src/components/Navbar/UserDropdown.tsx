import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaBox, FaMapMarkerAlt, FaCog, FaQuestionCircle } from 'react-icons/fa';

interface UserDropdownProps {
  username: string;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ username, onLogout }) => {
  return (
    <div className="absolute right-0 z-50 mt-2 w-64 bg-white rounded-lg shadow-lg dark:bg-gray-700 border border-gray-200">

      <div className="text-center px-4 py-3 border-b border-gray-200 dark:border-gray-600">
        <p className="text-sm font-medium text-gray-900 dark:text-white">Hello, {username}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{username}@example.com</p>

        <div className='mt-3 mb-1 flex justify-center'>
          <Link to="/profile" className="py-2 px-4 me-2 w-full text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">View Profile</Link>
        </div>
        
      </div>

      <div className="py-2">
        {/* <Link
          to="/profile"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white flex items-center"
        >
          <FaUserCircle className="mr-2" /> View Profile
        </Link> */}
        <Link
          to="/orders"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white flex items-center"
        >
          <FaBox className="mr-2" /> My Orders
        </Link>
        <Link
          to="/addresses"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white flex items-center"
        >
          <FaMapMarkerAlt className="mr-2" /> Delivery Addresses
        </Link>
        <Link
          to="/settings"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white flex items-center"
        >
          <FaCog className="mr-2" /> Settings
        </Link>
        <Link
          to="/help"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white flex items-center"
        >
          <FaQuestionCircle className="mr-2" /> Helpdesk
        </Link>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-600 py-2">
        <button
          onClick={onLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600 dark:hover:text-white flex items-center"
        >
          <FaSignOutAlt className="mr-2" /> Log out
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;