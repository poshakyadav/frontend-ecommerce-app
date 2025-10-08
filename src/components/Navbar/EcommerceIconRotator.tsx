// EcommerceIconRotator.tsx
import React, { useState, useEffect } from 'react';
import { 
  FaTshirt, FaHatCowboy, FaSocks, FaShoePrints, FaGlasses, 
  FaHeadphones, FaRing, FaUmbrella, FaWallet, 
  FaCamera, FaLaptop, FaMobileAlt, FaBicycle, FaDumbbell 
} from 'react-icons/fa';
import { MdWatch } from 'react-icons/md';

const icons = [
  <FaTshirt key="tshirt" size={18} className="text-gray-500" />,
  <FaHatCowboy key="hat" size={18} className="text-gray-500" />,
  <FaSocks key="socks" size={18} className="text-gray-500" />,
  <FaShoePrints key="shoes" size={18} className="text-gray-500" />,
  <FaGlasses key="glasses" size={18} className="text-gray-500" />,
  <FaHeadphones key="headphones" size={18} className="text-gray-500" />,
  <MdWatch key="watch" size={18} className="text-gray-500" />,
  <FaRing key="ring" size={18} className="text-gray-500" />,
  <FaUmbrella key="umbrella" size={18} className="text-gray-500" />,
  <FaWallet key="wallet" size={18} className="text-gray-500" />,
  <FaCamera key="camera" size={18} className="text-gray-500" />,
  <FaLaptop key="laptop" size={18} className="text-gray-500" />,
  <FaMobileAlt key="mobile" size={18} className="text-gray-500" />,
  <FaBicycle key="bicycle" size={18} className="text-gray-500" />,
  <FaDumbbell key="dumbbell" size={18} className="text-gray-500" />,
];

const EcommerceIconRotator: React.FC = () => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 2000); // Change icon every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-500 ease-in-out">
      {icons[currentIconIndex]}
    </div>
  );
};

export default EcommerceIconRotator;