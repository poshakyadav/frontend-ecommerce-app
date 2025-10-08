import React, { useState, useEffect, useRef } from 'react';
import {NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaSearch, FaHeart, FaInfoCircle, FaEnvelope, FaTags, FaAngleDown } from 'react-icons/fa';
import { IoStorefront } from 'react-icons/io5';
import UserDropdown from '../Navbar/UserDropdown';
import CartDropdown from '../Navbar/CartDropdown';
import { useAuth } from '../../hooks/useAuth';
import EcommerceIconRotator from '../Navbar/EcommerceIconRotator';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (cartMenuRef.current && !cartMenuRef.current.contains(event.target as Node)) {
        setCartDropdownOpen(false);
      }
      if (
        isMobileMenuOpen &&
        mobileMenuToggleRef.current &&
        !mobileMenuToggleRef.current.contains(event.target as Node) &&
        mobileMenuContainerRef.current &&
        !mobileMenuContainerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleMobileLinkClick = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 sticky top-0 z-50 shadow-sm ${className}`}
    >
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Left Section: Logo, Name, and Search Bar */}
        <div className="flex items-center space-x-4">
          <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          {({ isActive }) => (
              <>
                <IoStorefront size={30} className="text-blue-700 dark:text-blue-500" />
                <span className={`self-center text-2xl font-semibold whitespace-nowrap ${isActive ? 'text-blue-700 dark:text-blue-500' : 'dark:text-white'}`}>
                  MyStore
                </span>
              </>
            )}
          </NavLink>

          {/* Search Bar - Visible only on md screens and above */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-0  ">
            <div className="relative">
              <EcommerceIconRotator />
              <input
                type="search"
                placeholder="What are you looking for today?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-4 w-104 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                // When invalid, replace the default bubble
                onInvalid={e => {
                  const target = e.currentTarget as HTMLInputElement;
                  // if empty, we show this:
                  if (!target.value) {
                    target.setCustomValidity('Please enter a search term.');
                  }
                }}
                // Clear the message as soon as the user types again
                onInput={e => {
                  (e.currentTarget as HTMLInputElement).setCustomValidity('');
                }}
              />
            </div>
            <button
              type="submit"
              className="relative right-12 h-10 bg-blue-700 text-white px-4 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-blue-800"
              aria-label="Search"
            >
              <FaSearch size={18} />
            </button>
          </form>
        </div>

        {/* Right Section: Favorites, Cart, Account, and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Favorites Link */}
          <NavLink
            to="/favorites"
            className={({ isActive }) => 
              `flex items-center space-x-1 text-gray-700 font-medium dark:text-gray-300 ${isActive || (window.location.pathname === '/favorites' && 'text-blue-700 dark:text-blue-500')} hover:text-blue-700 dark:hover:text-blue-500`
            }
          >
             <FaHeart size={18} className='mr-1'/>
             <span className='hidden lg:inline'>Favorites</span>
            {/* {({ isActive }) => (
              <>
                <FaHeart size={18} className={`text-gray-700 ${isActive || (window.location.pathname === '/favorites') ? 'text-blue-700 dark:text-blue-500' : ''} hover:text-blue-700 dark:hover:text-blue-500`} />
                <span className={`hidden lg:inline text-sm font-medium ${isActive || (window.location.pathname === '/favorites') ? 'text-blue-700 dark:text-blue-500' : ''} hover:text-blue-700 dark:hover:text-blue-500`}>Favorites</span>
              </>
            )} */}
          </NavLink>

          {/* Cart Dropdown */}
          <div ref={cartMenuRef} className="relative">
            <button
              onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-500"
            >
              <FaShoppingCart size={18} />
              <span className="hidden lg:inline text-sm font-medium">My Cart</span>
              <FaAngleDown size={14} className={`ml-0 hidden lg:inline ${cartDropdownOpen ? 'text-blue-700 dark:text-blue-500' : ''}`} />
            </button>
            {cartDropdownOpen && (
              <CartDropdown
                isOpen={cartDropdownOpen}
                onClose={() => setCartDropdownOpen(false)}
              />
            )}
          </div>

          {/* User Section */}
          {isAuthenticated ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-500"
              >
                <FaUserCircle size={18} />
                <span className="hidden lg:inline text-sm font-medium">My Account</span>
                <FaAngleDown size={14} className={`ml-0 hidden lg:inline ${userDropdownOpen ? 'text-blue-700 dark:text-blue-500' : ''}`} />
              </button>
              {userDropdownOpen && (
                <UserDropdown
                  username={user?.username || ''}
                  onLogout={logout}
                />
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => 
                `text-sm font-medium text-white bg-blue-700 rounded-lg py-2 px-4 hover:bg-blue-800 ${isActive ? 'bg-blue-800' : ''}`
              }
            >
              Login
            </NavLink>
          )}

          {/* Mobile Menu Toggle */}
          <button
            ref={mobileMenuToggleRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? 'M1 1l15 12M1 13L16 1' : 'M1 1h15M1 7h15M1 13h15'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Only visible on small screens */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuContainerRef}
          className="md:hidden w-full bg-white dark:bg-gray-900 shadow-lg rounded-b-md"
        >
          <ul className="flex flex-col font-medium p-4 space-y-2">
            <li>
            <NavLink
                to="/about"
                onClick={handleMobileLinkClick}
                className={({ isActive }) => 
                  `flex items-center space-x-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${isActive ? 'text-blue-700 dark:text-blue-500' : 'dark:hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <FaInfoCircle size={18} className={isActive ? 'text-blue-700 dark:text-blue-500' : ''} />
                    <span className={isActive ? 'text-blue-700 dark:text-blue-500' : ''}>About Us</span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
            <NavLink
                to="/contact"
                onClick={handleMobileLinkClick}
                className={({ isActive }) => 
                  `flex items-center space-x-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${isActive ? 'text-blue-700 dark:text-blue-500' : 'dark:hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <FaEnvelope size={18} className={isActive ? 'text-blue-700 dark:text-blue-500' : ''} />
                    <span className={isActive ? 'text-blue-700 dark:text-blue-500' : ''}>Contact Us</span>
                  </>
                )}
              </NavLink>
            </li>
            <li>
            <NavLink
                to="/deals"
                onClick={handleMobileLinkClick}
                className={({ isActive }) => 
                  `flex items-center space-x-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${isActive ? 'text-blue-700 dark:text-blue-500' : 'dark:hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <FaTags size={18} className={isActive ? 'text-blue-700 dark:text-blue-500' : ''} />
                    <span className={isActive ? 'text-blue-700 dark:text-blue-500' : ''}>Deals</span>
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;