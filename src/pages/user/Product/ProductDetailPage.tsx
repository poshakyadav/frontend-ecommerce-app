import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductDetails, voteReviewHelpfulness } from '../../../services/productService';
import { addItemToCart, getCart } from '../../../services/cartService';
import type { ProductDetailDTO, CartDTO, OrderSummaryItem } from '../../../services/types';
import { useAuth } from '../../../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FiShoppingCart, FiMinus, FiPlus, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { CgSpinner } from 'react-icons/cg';

const ProductDetailPage: React.FC = () => {
    const { id, variantId } = useParams<{ id: string; variantId?: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductDetailDTO | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<ProductDetailDTO['defaultVariant'] | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [activeImage, setActiveImage] = useState<string>('');
    const [isZoomed, setIsZoomed] = useState(false);
    const [cart, setCart] = useState<CartDTO | null>(null);
    const [isInCart, setIsInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!id) {
    //             console.warn('No product ID provided');
    //             return;
    //           }
    //         setLoading(true);
    //         console.log('Fetching product details for ID:', id, 'Variant ID:', variantId);try {
    //             const productData = await getProductDetails(Number(id), variantId ? Number(variantId) : undefined);
    //             console.log('Product data fetched:', productData);
    //             setProduct(productData);
    //             const currentVariant = productData.defaultVariant;
    //             setSelectedVariant(currentVariant);
    //             setSelectedColor(currentVariant.color.hexCode);
                
    //             const availableSize = currentVariant.sizePrices.find(sp => sp.stock !== null && sp.stock > 0);
    //             const defaultSize = currentVariant.sizePrices.find(sp => sp.isDefault && sp.stock !== null && sp.stock > 0)?.size || availableSize?.size || '';
    //             setSelectedSize(defaultSize);
                
    //             setActiveImage(currentVariant.imageUrls[0] || 'https://via.placeholder.com/600?text=No+Image');

    //             if (isAuthenticated && user?.id) {
    //                 console.log('Fetching cart for user:', user.id);
    //                 const cartData = await getCart(user.id);
    //                 setCart(cartData);
    //                 console.log('Cart fetched:', cartData);
    //             }
    //         } catch (error) {
    //             console.error('Failed to fetch product data:', error);
    //             toast.error('Failed to load product data.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, [id, variantId, isAuthenticated, user?.id]);


    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
        if (!id) {
            console.warn('No product ID provided');
            return;
        }
        setLoading(true);
        console.log('Fetching product details for ID:', id, 'Variant ID:', variantId);
        try {
            const productData = await getProductDetails(Number(id), variantId ? Number(variantId) : undefined);
            console.log('Product data fetched:', productData);
            setProduct(productData);
            const currentVariant = productData.defaultVariant;
            setSelectedVariant(currentVariant);
            setSelectedColor(currentVariant.color.hexCode);
            const availableSize = currentVariant.sizePrices.find(sp => sp.stock !== null && sp.stock > 0);
            const defaultSize = currentVariant.sizePrices.find(sp => sp.isDefault && sp.stock !== null && sp.stock > 0)?.size || availableSize?.size || '';
            setSelectedSize(defaultSize);
            setActiveImage(currentVariant.imageUrls[0] || 'https://via.placeholder.com/600?text=No+Image');
        } catch (error) {
            console.error('Failed to fetch product data:', error);
            toast.error('Failed to load product data.');
        } finally {
            setLoading(false);
        }
        };
        fetchProduct();
    }, [id, variantId]);
    
    // Fetch cart data
    useEffect(() => {
        const fetchCart = async () => {
        if (isAuthenticated && user?.id) {
            console.log('Fetching cart for user:', user.id);
            try {
            const cartData = await getCart(user.id);
            setCart(cartData);
            console.log('Cart fetched:', cartData);
            } catch (error) {
            console.error('Failed to fetch cart:', error);
            }
        }
        };
        fetchCart();
    }, [isAuthenticated, user?.id]);

    useEffect(() => {
        if (cart && selectedVariant && selectedSize) {
            const inCart = cart.items.some(item => item.variant.id === selectedVariant.id && item.selectedSize === selectedSize);
            setIsInCart(inCart);
        } else {
            setIsInCart(false);
        }
    }, [cart, selectedVariant, selectedSize]);

    const handleColorChange = (hexCode: string, variantId: number) => {
        console.log('Changing color to:', hexCode, 'Variant ID:', variantId);
        setSelectedColor(hexCode);
        const variant = product?.variants.find(v => v.id === variantId);
        if (variant) {
            setSelectedVariant(variant);
            const availableSize = variant.sizePrices.find(sp => sp.stock !== null && sp.stock > 0);
            const newDefaultSize = variant.sizePrices.find(sp => sp.isDefault && sp.stock !== null && sp.stock > 0)?.size || availableSize?.size || '';
            setSelectedSize(newDefaultSize);
            setActiveImage(variant.imageUrls[0] || 'https://via.placeholder.com/600?text=No+Image');
            navigate(`/product/${id}/${variant.id}`, { replace: true });
            setQuantity(1); // Reset quantity on variant change
            console.log('Variant changed to:', variant.name, 'Size:', newDefaultSize);
        }
    };

    const handleSizeChange = (size: string) => {
        console.log('Changing size to:', size);
        setSelectedSize(size);
        setQuantity(1); // Reset quantity on size change
    };
    
    const handleQuantityChange = (amount: number) => {
        const newQuantity = quantity + amount;
        const stock = selectedVariant?.sizePrices.find(sp => sp.size === selectedSize)?.stock ?? 0;
        if (newQuantity >= 1 && newQuantity <= stock) {
            setQuantity(newQuantity);
            console.log('Quantity updated to:', newQuantity);
        } else {
            console.warn('Quantity change invalid. New quantity:', newQuantity, 'Stock:', stock);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated || !user?.id) {
            toast.info('Please login to add items to your cart.');
            navigate('/login');
            console.log('User not authenticated, redirecting to login');
            return;
        }
        if (!selectedVariant || !selectedSize) {
            toast.warn('Please select a color and size.');
            console.warn('Variant or size not selected');
            return;
        }
        const sizePrice = selectedVariant.sizePrices.find(sp => sp.size === selectedSize);
        if (!sizePrice || (sizePrice.stock ?? 0) < quantity) {
            toast.error('Not enough items in stock.');
            console.error('Insufficient stock for selected size:', selectedSize);
            return;
        }
        
        setIsAddingToCart(true);
        try {
            await addItemToCart({ variantId: selectedVariant.id, quantity, selectedSize }, user.id);
            toast.success('Item added to cart!');
            const updatedCart = await getCart(user.id);
            setCart(updatedCart);
            console.log('Cart updated:', updatedCart);
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            toast.error('Failed to add item to cart.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        if (!isAuthenticated || !user?.id) {
          toast.info('Please login to proceed with Buy Now.');
          navigate('/login');
          console.log('User not authenticated, redirecting to login');
          return;
        }
        if (!selectedVariant || !selectedSize) {
          toast.warn('Please select a color and size.');
          console.warn('Variant or size not selected for Buy Now');
          return;
        }
        const sizePrice = selectedVariant.sizePrices.find(sp => sp.size === selectedSize);
        if (!sizePrice || (sizePrice.stock ?? 0) < quantity) {
          toast.error('Not enough items in stock.');
          console.error('Insufficient stock for Buy Now:', selectedSize, 'Stock:', sizePrice?.stock);
          return;
        }
    
        console.log('Processing Buy Now for:', { variantId: selectedVariant.id, selectedSize, quantity });
        const basePrice = sizePrice.basePrice ?? 0;
        const discount = sizePrice.discount ?? 0;
        const taxRate = sizePrice.taxRate ?? 0;
    
        const discountAmount = basePrice * discount * quantity;
        const discountedPrice = (basePrice - (basePrice * discount)) * quantity;
        const taxAmount = discountedPrice * taxRate;
        const totalPrice = discountedPrice;
        const finalPrice = discountedPrice + taxAmount;
    
        const directItem: OrderSummaryItem = {
          id: selectedVariant.id,
          productName: selectedVariant.name,
          imageUrl: selectedVariant.imageUrls[0] || 'https://via.placeholder.com/80',
          selectedSize,
          quantity,
          basePrice,
          discount,
          discountAmount,
          discountedPrice,
          taxRate,
          taxAmount,
          totalPrice,
          finalPrice,
        };
    
        console.log('Navigating to checkout with direct item:', directItem);
        navigate('/checkout', { state: { isDirectPurchase: true, directItem } });
      };

    const handleVote = async (reviewId: number, isHelpful: boolean) => {
        if (!isAuthenticated || !user?.id) {
            toast.info('Please login to vote on reviews.');
            console.log('User not authenticated for voting');
            return;
        }
        console.log('Voting on review:', reviewId, 'Helpful:', isHelpful);
        try {
            await voteReviewHelpfulness(reviewId, user.id, isHelpful);
            toast.success('Thank you for your feedback!');
            if (id) {
              const updatedProduct = await getProductDetails(Number(id));
              setProduct(updatedProduct);
              console.log('Reviews updated after vote:', updatedProduct.reviews);
            }
        } catch (error) {
            console.error('Failed to vote on review:', error);
            toast.error('Failed to record your vote.');
        }
    };
    
    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <CgSpinner className="animate-spin text-indigo-600 h-12 w-12" />
        </div>
    );
    
    if (!product || !selectedVariant) return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">Product Not Found</h2>
            <p className="text-gray-500 mt-2">We couldn't find the product you're looking for.</p>
            <Link to="/" className="mt-4 inline-block bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700">
                Go to Homepage
            </Link>
        </div>
    );

    const selectedSizePrice = selectedVariant.sizePrices.find(sp => sp.size === selectedSize);
    const discountPercentage = selectedSizePrice?.discount ? (selectedSizePrice.discount * 100).toFixed(0) : 0;
    const stock = selectedSizePrice?.stock ?? 0;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <AiFillStar key={i} className={`h-5 w-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="text-sm mb-6">
                    <ol className="list-none p-0 inline-flex space-x-2 text-gray-500">
                        <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
                        <li><span>/</span></li>
                        <li><Link to={`/category/${product.category.name.toLowerCase()}`} className="hover:text-indigo-600">{product.category.name}</Link></li>
                        <li><span>/</span></li>
                        <li className="text-gray-700 font-medium">{selectedVariant.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Image gallery */}
                    <div className="lg:col-span-2 flex flex-col-reverse lg:flex-row gap-4">
                        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
                            {selectedVariant.imageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all duration-300 ${url === activeImage ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:opacity-80'}`}
                                    onClick={() => setActiveImage(url)}
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=N/A')}
                                />
                            ))}
                        </div>
                        <div className="relative flex-1">
                            <img
                                src={activeImage}
                                alt={selectedVariant.name}
                                className="w-full h-auto object-cover rounded-xl shadow-lg cursor-pointer transition-opacity duration-300"
                                onClick={() => setIsZoomed(true)}
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/600?text=Image+Not+Found')}
                            />
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="lg:col-span-3 space-y-6">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">{selectedVariant.name}</h1>
                            <div className="flex items-center space-x-2 mt-2">
                                <span className="text-gray-500">{product.brand}</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-500">{product.category.name}</span>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex items-center">
                                {renderStars(product.averageRating)}
                            </div>
                            <a href="#reviews" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">{product.totalRatings} reviews</a>
                        </div>
                        
                        <div>
                           <p className="text-gray-600 leading-relaxed">{selectedVariant.description}</p>
                        </div>

                        <div className="flex items-baseline space-x-3">
                            <span className="text-3xl font-bold text-gray-900">₹{selectedSizePrice?.totalPrice.toFixed(2) || 'N/A'}</span>
                            {selectedSizePrice?.discount && selectedSizePrice.discount > 0 && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">₹{(selectedSizePrice.basePrice ?? 0).toFixed(2)}</span>
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-md">
                                        {discountPercentage}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Colors */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Color: <span className="font-normal">{selectedVariant.color.name}</span></h3>
                            <div className="flex items-center space-x-3 mt-2">
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => handleColorChange(variant.color.hexCode, variant.id)}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 transform hover:scale-110 focus:outline-none ${selectedColor === variant.color.hexCode ? 'ring-2 ring-indigo-500 ring-offset-2 border-white' : 'border-gray-300'}`}
                                        style={{ backgroundColor: variant.color.hexCode }}
                                        title={variant.color.name}
                                        aria-label={`Select color ${variant.color.name}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Size</h3>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {selectedVariant.sizePrices.map((sp) => (
                                    <button
                                        key={sp.size}
                                        onClick={() => (sp.stock ?? 0) > 0 && handleSizeChange(sp.size)}
                                        disabled={(sp.stock ?? 0) === 0}
                                        className={`relative px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                            (sp.stock ?? 0) === 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : selectedSize === sp.size
                                                ? 'bg-indigo-600 border-transparent text-white shadow-md'
                                                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        {sp.size}
                                        {(sp.stock ?? 0) === 0 && <div className="absolute -top-1 -right-1.5 w-4 h-4 bg-gray-400 rounded-full border-2 border-white" title="Out of stock"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                             <div className="flex items-center border border-gray-300 rounded-md">
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1 || stock === 0} className="px-3 py-2 text-gray-600 rounded-l-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"><FiMinus /></button>
                                <span className="px-4 py-2 font-semibold text-gray-800">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= stock || stock === 0} className="px-3 py-2 text-gray-600 rounded-r-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"><FiPlus /></button>
                            </div>
                            <p className={`text-sm font-medium ${stock > 10 ? 'text-green-600' : stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {stock > 0 ? `${stock} left in stock` : 'Out of Stock'}
                            </p>
                        </div>

                        <div className="flex space-x-4">
                        <button
                            onClick={isInCart ? () => navigate('/cart') : handleAddToCart}
                            disabled={stock === 0 || !selectedSize || isAddingToCart}
                            className="flex-1 flex items-center justify-center bg-indigo-600 text-white text-sm sm:text-lg font-semibold py-3 sm:py-3 px-3 sm:px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {isAddingToCart ? <CgSpinner className="animate-spin h-6 w-6" /> : <FiShoppingCart className="mr-3 h-6 w-6" />}
                            {isInCart ? 'Go to Cart' : 'Add to Cart'}
                        </button>

                        <button
                            onClick={handleBuyNow}
                            disabled={stock === 0 || !selectedSize}
                            className="flex-1 flex items-center justify-center bg-green-600 text-white text-sm sm:text-lg font-semibold py-3 sm:py-3 px-3 sm:px-6 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Buy Now
                        </button>

                        </div>

                    </div>
                </div>

                {isZoomed && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setIsZoomed(false)}>
                        <img src={activeImage} alt={selectedVariant.name} className="max-w-full max-h-full object-contain rounded-lg" />
                    </div>
                )}
            </div>

            {/* Reviews Section */}
            <div id="reviews" className="bg-gray-50/75 py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-6">Customer Reviews</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="flex items-center mb-2">
                                <p className="text-xl font-bold text-gray-800 mr-2">{product.averageRating.toFixed(1)}</p>
                                <div className="flex items-center">{renderStars(product.averageRating)}</div>
                            </div>
                            <p className="text-sm text-gray-600">Based on {product.totalRatings} reviews</p>
                            
                            <div className="space-y-2 mt-6">
                                {Object.entries(product.ratingDistribution).sort((a,b) => Number(b[0]) - Number(a[0])).map(([rating, count]) => {
                                    const percentage = product.totalRatings > 0 ? (count / product.totalRatings) * 100 : 0;
                                    return (
                                        <div key={rating} className="flex items-center gap-2 text-sm">
                                            <span className="font-medium text-gray-700">{rating} star</span>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                            <span className="w-8 text-right text-gray-600">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-8">
                            {product.reviews.map((review) => (
                                <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                                {review.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{review.username}</p>
                                                {review.verifiedPurchase && <span className="text-xs font-medium text-green-700">Verified Purchase</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center">{renderStars(review.rating)}</div>
                                    </div>
                                    <p className="mt-4 text-gray-700 leading-relaxed">{review.reviewText}</p>
                                    
                                    {review.imageUrls.length > 0 && (
                                        <div className="flex gap-3 mt-4 overflow-x-auto">
                                            {review.imageUrls.map((url, index) => (
                                                <img key={index} src={url} alt={`Review ${index + 1}`} className="w-24 h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.open(url, '_blank')} />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        {isAuthenticated && (
                                            <div className="flex items-center space-x-4">
                                                <span className="text-gray-600">Helpful?</span>
                                                <button onClick={() => handleVote(review.id, true)} className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-md p-1">
                                                    <FiThumbsUp /> <span>({review.helpfulVotes})</span>
                                                </button>
                                                <button onClick={() => handleVote(review.id, false)} className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-md p-1">
                                                    <FiThumbsDown /> <span>({review.unhelpfulVotes})</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                             {product.reviews.length === 0 && <p className="text-center text-gray-500">No reviews yet. Be the first to write one!</p>}
                        </div>
                    </div>
                </div>
            </div>
            
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default ProductDetailPage;