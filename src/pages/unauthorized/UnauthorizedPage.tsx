// src/pages/UnauthorizedPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Unauthorized</h1>
          <p className="text-gray-700 text-base">
            You do not have permission to access this page.
          </p>
          {/* Optionally add a link back to the home page or a contact support link */}
          <Link to="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mt-4">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;