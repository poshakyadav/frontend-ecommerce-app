import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, toggleProductActive, deleteProduct, toggleVariantActive, deleteVariant } from '../../../services/productService';
import type { AdminProductListDTO } from '../../../services/types';
import { ToastContainer, toast } from 'react-toastify';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import ConfirmationPopup from '../../../components/PopUp/ConfirmationPopup';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<AdminProductListDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error: any) {
        setError('Failed to load products. Please try again later.');
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleExpand = (productId: number) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleToggleProductActive = async (productId: number, currentActive: boolean) => {
    setPopup({
      isOpen: true,
      title: currentActive ? 'Deactivate Product' : 'Activate Product',
      message: currentActive
        ? 'Are you sure you want to deactivate this product? It will no longer be visible to customers.'
        : 'Are you sure you want to activate this product? It will become visible to customers.',
      onConfirm: async () => {
        try {
          await toggleProductActive(productId, !currentActive);
          setProducts(products.map(p =>
            p.id === productId ? { ...p, active: !currentActive, variants: p.variants.map(v => ({ ...v, active: !currentActive })) } : p
          ));
          toast.success(`Product ${currentActive ? 'deactivated' : 'activated'} successfully`);
          setPopup({ ...popup, isOpen: false });
        } catch (error) {
          toast.error('Failed to toggle product status');
          setPopup({ ...popup, isOpen: false });
        }
      },
      confirmText: currentActive ? 'Deactivate' : 'Activate',
    });
  };

  const handleDeleteProduct = async (productId: number) => {
    setPopup({
      isOpen: true,
      title: 'Delete Product',
      message: 'Are you sure you want to permanently delete this product and all its variants? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteProduct(productId);
          setProducts(products.filter(p => p.id !== productId));
          toast.success('Product deleted successfully');
          setPopup({ ...popup, isOpen: false });
        } catch (error) {
          toast.error('Failed to delete product');
          setPopup({ ...popup, isOpen: false });
        }
      },
      confirmText: 'Delete',
      isDestructive: true,
    });
  };

  const handleToggleVariantActive = async (productId: number, variantId: number, currentActive: boolean) => {
    setPopup({
      isOpen: true,
      title: currentActive ? 'Deactivate Variant' : 'Activate Variant',
      message: currentActive
        ? 'Are you sure you want to deactivate this variant? It will no longer be available for purchase.'
        : 'Are you sure you want to activate this variant? It will become available for purchase.',
      onConfirm: async () => {
        try {
          await toggleVariantActive(variantId, !currentActive);
          setProducts(products.map(p =>
            p.id === productId
              ? {
                  ...p,
                  variants: p.variants.map(v =>
                    v.id === variantId ? { ...v, active: !currentActive } : v
                  ),
                }
              : p
          ));
          toast.success(`Variant ${currentActive ? 'deactivated' : 'activated'} successfully`);
          setPopup({ ...popup, isOpen: false });
        } catch (error) {
          toast.error('Failed to toggle variant status');
          setPopup({ ...popup, isOpen: false });
        }
      },
      confirmText: currentActive ? 'Deactivate' : 'Activate',
    });
  };

  const handleDeleteVariant = async (productId: number, variantId: number) => {
    setPopup({
      isOpen: true,
      title: 'Delete Variant',
      message: 'Are you sure you want to permanently delete this variant? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await deleteVariant(variantId);
          setProducts(products.map(p =>
            p.id === productId
              ? { ...p, variants: p.variants.filter(v => v.id !== variantId) }
              : p
          ));
          toast.success('Variant deleted successfully');
          setPopup({ ...popup, isOpen: false });
        } catch (error) {
          toast.error('Failed to delete variant');
          setPopup({ ...popup, isOpen: false });
        }
      },
      confirmText: 'Delete',
      isDestructive: true,
    });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Link
          to="/admin/products/add"
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Add Product
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="text-gray-600 text-center">No products found.</div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Delete
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => toggleExpand(product.id)}
                        className="flex items-center"
                      >
                        {expandedProducts.has(product.id) ? (
                          <FaChevronDown className="h-5 w-5 text-gray-600" />
                        ) : (
                          <FaChevronRight className="h-5 w-5 text-gray-600" />
                        )}
                        <span className="ml-2">{product.id}</span>
                      </button>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {product.variants[0]?.name || 'Unnamed Product'}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {product.brand || 'N/A'}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {product.category.name}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleToggleProductActive(product.id, product.active)}
                        className={`px-2 py-1 rounded text-white ${product.active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        {product.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="text-blue-500 hover:underline mr-4"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                  {expandedProducts.has(product.id) && (
                    <tr>
                      <td colSpan={7} className="bg-gray-100">
                        <div className="px-5 py-3">
                          <table className="min-w-full leading-normal">
                            <thead>
                              <tr>
                                <th className="px-5 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Variant ID
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  SKU
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Color
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Price (₹)
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Stock
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Delete
                                </th>
                                <th className="px-5 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.variants.map((variant) => (
                                <tr key={variant.id} className="hover:bg-gray-50">
                                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                    {variant.id}
                                  </td>
                                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                    {variant.sku}
                                  </td>
                                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                      <span
                                        className="w-4 h-4 rounded-full mr-2"
                                        style={{ backgroundColor: variant.color.hexCode }}
                                      ></span>
                                      {variant.color.name}
                                    </div>
                                  </td>
                                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                    ₹{variant.sizePrices[0]?.finalPrice.toFixed(2) || 'N/A'}
                                  </td>
                                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                    {variant.sizePrices.reduce((sum, sp) => sum + sp.stock, 0)}
                                  </td>
                                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                    <button
                                      onClick={() => handleToggleVariantActive(product.id, variant.id, variant.active)}
                                      className={`px-2 py-1 rounded text-white ${variant.active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                    >
                                      {variant.active ? 'Deactivate' : 'Activate'}
                                    </button>
                                  </td>
                                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                    <button
                                      onClick={() => handleDeleteVariant(product.id, variant.id)}
                                      className="text-red-500 hover:underline"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                  <td className="px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                    <Link
                                      to={`/admin/variants/edit/${variant.id}`}
                                      className="text-blue-500 hover:underline mr-4"
                                    >
                                      Edit Variant
                                    </Link>
                                    <Link
                                      to={`/admin/variants/edit-images/${variant.id}`}
                                      className="text-blue-500 hover:underline"
                                    >
                                      Edit Images
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmationPopup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        onConfirm={popup.onConfirm}
        title={popup.title}
        message={popup.message}
        confirmText={popup.confirmText}
        isDestructive={popup.isDestructive}
      />
      <ToastContainer position="top-right" />
    </div>
  );
};

export default ProductListPage;