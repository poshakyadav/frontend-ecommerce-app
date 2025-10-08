import React from 'react';
import { Link } from 'react-router-dom';
import { IoStorefront } from 'react-icons/io5';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', to: '/shop' },
        { label: 'New Arrivals', to: '/shop?sort=newest' },
        { label: 'Best Sellers', to: '/shop?sort=bestsellers' },
        { label: 'Deals', to: '/deals' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { label: 'Contact Us', to: '/contact' },
        { label: 'FAQs', to: '/faq' },
        { label: 'Shipping Information', to: '/shipping-info' },
        { label: 'Returns & Exchanges', to: '/returns' },
        { label: 'Track Your Order', to: '/track-order' },
      ],
    },
    {
      title: 'Our Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Careers', to: '/careers' },
        { label: 'Press', to: '/press' },
        { label: 'Affiliate Program', to: '/affiliates' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms & Conditions', to: '/terms-conditions' },
        { label: 'Cookie Policy', to: '/cookie-policy' },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaFacebookF, to: 'https://facebook.com', label: 'Facebook' },
    { icon: FaTwitter, to: 'https://twitter.com', label: 'Twitter' },
    { icon: FaInstagram, to: 'https://instagram.com', label: 'Instagram' },
    { icon: FaLinkedinIn, to: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaYoutube, to: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section with logo and newsletter/contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 items-start">
          <div className="md:col-span-1 flex flex-col items-start">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <IoStorefront size={34} className="text-blue-700 dark:text-blue-500" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                MyStore
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your one-stop shop for quality products.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <MdLocationOn className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                123 Commerce St, Web City, IN
              </p>
              <a href="tel:+1234567890" className="flex items-center hover:text-blue-600 dark:hover:text-blue-400">
                <MdPhone className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                +1 234 567 890
              </a>
              <a href="mailto:support@mystore.com" className="flex items-center hover:text-blue-600 dark:hover:text-blue-400">
                <MdEmail className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                support@mystore.com
              </a>
            </div>
          </div>

          {/* Newsletter/CTA - can be more elaborate */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates, products, and offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:border-blue-400"
              />
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Links section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-md font-semibold text-gray-800 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section: Social media and copyright */}
        <div className="pt-8 border-t border-gray-300 dark:border-gray-600 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            &copy; {currentYear} MyStore. All rights reserved.
          </p>
          <div className="flex space-x-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.to}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;