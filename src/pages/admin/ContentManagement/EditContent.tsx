import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getContentByKey, updateContent, createContent, getAllContent } from '../../../services/contentService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Editor from '@monaco-editor/react';

interface Banner {
  imageUrl: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface FormValues {
  id?: number;
  contentKey: string;
  content: string;
  banners?: Banner[];
}

const contentKeys = ['home_banner', 'about_us', 'faq', 'terms_conditions'];
const richTextContentKeys = ['about_us', 'faq', 'terms_conditions'];

const EditContentPage: React.FC = () => {
  const { key: currentKeyParam } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormValues>({
    contentKey: currentKeyParam || '',
    content: '',
    banners: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [existingKeys, setExistingKeys] = useState<string[]>([]);

  useEffect(() => {
    fetchExistingContentKeys();
    if (currentKeyParam) {
      fetchContent(currentKeyParam);
    } else {
      setLoading(false);
    }
  }, [currentKeyParam]);

  const fetchExistingContentKeys = async () => {
    try {
      const allContent = await getAllContent();
      setExistingKeys(allContent.map(item => item.contentKey));
    } catch (err) {
      console.error("Error fetching existing content keys:", err);
    }
  };

  const fetchContent = async (key: string) => {
    try {
      setLoading(true);
      const data = await getContentByKey(key);
      setFormData({
        id: data.id,
        contentKey: data.contentKey,
        content: data.content || '',
        banners: data.banners ? JSON.parse(data.banners) : [],
      });
    } catch (err: any) {
      setError(err.message || 'Error fetching content');
      if (err.response?.status === 404) {
        toast.info(`Content for key "${key}" not found. You can create it now.`);
        setFormData({
          contentKey: key,
          content: '',
          banners: [],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: keyof FormValues, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKey = e.target.value;
    setFormData({
      contentKey: newKey,
      content: '',
      banners: [],
    });
    if (newKey) {
      navigate(`/admin/content/add?key=${newKey}`, { replace: true });
    }
  };

  const handleContentChange = (htmlContent: string) => {
    handleChange('content', htmlContent);
  };

  const handleBannerChange = (index: number, field: keyof Banner, value: string) => {
    const updatedBanners = [...(formData.banners || [])];
    updatedBanners[index] = { ...updatedBanners[index], [field]: value };
    handleChange('banners', updatedBanners);
  };

  const addBanner = () => {
    handleChange('banners', [...(formData.banners || []), { imageUrl: '', title: '', description: '', buttonText: '', buttonUrl: '' }]);
  };

  const removeBanner = (index: number) => {
    const updatedBanners = (formData.banners || []).filter((_, i) => i !== index);
    handleChange('banners', updatedBanners);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contentKey) {
      toast.error("Please select a Content Type.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        contentKey: formData.contentKey,
        content: formData.content,
        banners: formData.contentKey === 'home_banner' ? JSON.stringify(formData.banners) : undefined,
      };
      if (formData.id) {
        await updateContent(formData.id, payload);
        toast.success('Content updated successfully!');
      } else {
        if (existingKeys.includes(formData.contentKey) && !currentKeyParam) {
          toast.error(`Content with key "${formData.contentKey}" already exists. Please edit the existing one.`);
        } else {
          await createContent(payload);
          toast.success('Content created successfully!');
        }
      }
      navigate('/admin/content');
    } catch (err: any) {
      toast.error(err.message || `Failed to ${formData.id ? 'update' : 'create'} content`);
    } finally {
      setLoading(false);
    }
  };

  const getImageSizeRecommendation = () => 'Recommended size: 1920x1080 pixels or larger (16:9 aspect ratio)';

  const isRichText = formData.contentKey && richTextContentKeys.includes(formData.contentKey);

  if (loading && currentKeyParam) return <div>Loading content...</div>;
  if (error) return <div>Error: {error} <Link to="/admin/content/add" className="text-blue-500">Try adding new content</Link></div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">{formData.id ? `Edit: ${formData.contentKey}` : 'Add New Content'}</h1>
      <div className="max-w-full space-y-4">
        <div>
          <label htmlFor="contentKey" className="block text-gray-700 text-sm font-bold mb-2">Content Type:</label>
          <select
            id="contentKey"
            value={formData.contentKey}
            onChange={currentKeyParam ? (e) => handleChange('contentKey', e.target.value) : handleKeyChange}
            required
            disabled={!!formData.id}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled={!!formData.contentKey && !!formData.id}>Select Content Type</option>
            {contentKeys.map(key => (
              <option key={key} value={key} disabled={existingKeys.includes(key) && !formData.id && formData.contentKey !== key && !(currentKeyParam === key)}>
                {key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                {existingKeys.includes(key) && !formData.id && formData.contentKey !== key && !(currentKeyParam === key) ? ' (Exists)' : ''}
              </option>
            ))}
          </select>
        </div>

        {formData.contentKey && (
          <>
          {isRichText && (
            <div>
              <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content:</label>
                <Editor
                  height="400px"
                  defaultLanguage="html"
                  value={formData.content}
                  onChange={(value) => handleContentChange(value || '')}
                  options={{ minimap: { enabled: false }, wordWrap: 'on', fontSize: 14, scrollBeyondLastLine: false }}
                />
            </div>
              )}

            {formData.contentKey === 'home_banner' && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Banners</h3>
                {(formData.banners || []).map((banner, index) => (
                  <div key={index} className="border p-4 mb-4 rounded">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Image URL:</label>
                      <input
                        title='Write Image URL'
                        type="text"
                        value={banner.imageUrl}
                        onChange={(e) => handleBannerChange(index, 'imageUrl', e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <p className="text-sm text-gray-500 mt-1">{getImageSizeRecommendation()}</p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Banner Title:</label>
                      <input
                        type="text"
                        title='Write Banner Title'
                        value={banner.title || ''}
                        onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                      <textarea
                        title='Write Banner Description'
                        value={banner.description || ''}
                        onChange={(e) => handleBannerChange(index, 'description', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Button Text:</label>
                      <input
                        type="text"
                        title='Write Button Text'
                        value={banner.buttonText || ''}
                        onChange={(e) => handleBannerChange(index, 'buttonText', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Button URL:</label>
                      <input
                        type="text"
                        title='Write Button URL'
                        value={banner.buttonUrl || ''}
                        onChange={(e) => handleBannerChange(index, 'buttonUrl', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBanner(index)}
                      className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBanner}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Add Banner
                </button>
              </div>
            )}
          </>
        )}

        <div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !formData.contentKey}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading || !formData.contentKey ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {formData.id ? 'Save Changes' : 'Create Content'}
          </button>
          <Link to="/admin/content" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 ml-2">Cancel</Link>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default EditContentPage;