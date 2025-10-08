import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ContentResponse } from '../../../services/contentService';
import { getAllContent, deleteContent } from '../../../services/contentService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContentListPage: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await getAllContent();
      setContentItems(data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch content');
      setLoading(false);
    }
  };

  const handleDeleteContent = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this content item?')) {
      try {
        await deleteContent(id);
        toast.success('Content deleted successfully!');
        fetchContent(); // Refresh content list
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete content');
      }
    }
  };

  if (loading) {
    return <div>Loading content...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Content Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Key
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {contentItems.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {item.id}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {item.contentKey}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <Link to={`/admin/content/edit/${item.contentKey}`} className="text-blue-500 hover:underline mr-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDeleteContent(item.id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default ContentListPage;