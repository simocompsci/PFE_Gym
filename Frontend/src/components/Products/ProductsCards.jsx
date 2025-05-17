import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, Trash2, Eye, X, AlertCircle, Check, Edit
} from 'lucide-react';
import { productService } from '../../lib/api';

const ProductsCards = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' | 'edit' | 'view'
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        cost: 0,
        stock_quantity: 0,
        category: '',
        image_url: '',
        is_active: true,
        gym_id: 1 // Default gym ID
    });

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    // Delete confirmation state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Notification state
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Fetch products on component mount
    useEffect(() => {
        fetchProductsData();
    }, []);

    const fetchProductsData = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll();
            const productsData = response.data.data;
            setProducts(productsData);
            setFilteredProducts(productsData);
            console.log('Products data loaded successfully:', productsData);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to load products data';
            setError(errorMessage);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();

        if (term) {
            const filtered = products.filter(
                (product) =>
                    product.name.toLowerCase().includes(term) ||
                    product.description?.toLowerCase().includes(term) ||
                    product.category?.toLowerCase().includes(term)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    };

    // CRUD logic
    const handleAdd = () => {
    console.log('Add button clicked');
    // Reset form error if any
    setFormError(null);

    setFormData({
        name: '',
        description: '',
        price: 0,
        cost: 0,
        stock_quantity: 0,
        category: '',
        image_url: '',
        is_active: true,
        gym_id: 1
    });
    setModalType('add');
    setShowModal(true);
    console.log('Modal state after click:', showModal); // Add this for debugging
};

    const handleEdit = async (product) => {
        try {
            // Get detailed product information
            const response = await productService.getById(product.id);
            const productData = response.data.data;

            setFormData({
                id: productData.id,
                name: productData.name,
                description: productData.description || '',
                price: productData.price,
                cost: productData.cost || 0,
                stock_quantity: productData.stock_quantity || 0,
                category: productData.category || '',
                image_url: productData.image_url || '',
                is_active: productData.is_active,
                gym_id: productData.gym_id
            });

            setModalType('edit');
            setShowModal(true);
        } catch (error) {
            console.error('Error preparing product for edit:', error);
            setNotification({
                show: true,
                message: 'Failed to load product details',
                type: 'error'
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
        }
    };

    const handleView = async (product) => {
        try {
            // Get detailed product information
            const response = await productService.getById(product.id);
            const productData = response.data.data;

            setFormData({
                id: productData.id,
                name: productData.name,
                description: productData.description || '',
                price: productData.price,
                cost: productData.cost || 0,
                stock_quantity: productData.stock_quantity || 0,
                category: productData.category || '',
                image_url: productData.image_url || '',
                is_active: productData.is_active,
                gym_id: productData.gym_id
            });

            setModalType('view');
            setShowModal(true);
        } catch (error) {
            console.error('Error preparing product for view:', error);
            setNotification({
                show: true,
                message: 'Failed to load product details',
                type: 'error'
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
        }
    };

    // Show delete confirmation dialog
    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setShowDeleteConfirm(true);
    };

    // Handle actual deletion
    const handleDelete = async () => {
        if (!productToDelete) return;

        setIsDeleting(true);
        try {
            await productService.delete(productToDelete.id);
            setProducts(products.filter(p => p.id !== productToDelete.id));
            setFilteredProducts(filteredProducts.filter(p => p.id !== productToDelete.id));

            // Show success notification
            setNotification({
                show: true,
                message: 'Product deleted successfully',
                type: 'success'
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);

            // Close confirmation dialog
            setShowDeleteConfirm(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Error deleting product:', error);

            // Show error notification
            setNotification({
                show: true,
                message: error.response?.data?.message || 'Failed to delete product',
                type: 'error'
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
        } finally {
            setIsDeleting(false);
        }
    };

    // Cancel delete operation
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setProductToDelete(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Reset form error
        setFormError(null);
        setIsSubmitting(true);

        // Clean up form data
        const cleanedFormData = { ...formData };

        // Check if image URL is from Brave search and remove it if it is
        if (cleanedFormData.image_url && cleanedFormData.image_url.includes('imgs.search.brave.com')) {
            cleanedFormData.image_url = ''; // Clear the problematic URL
        }

        // Validate required fields
        const requiredFields = ['name', 'price', 'gym_id'];
        const missingFields = requiredFields.filter(field => !cleanedFormData[field]);

        if (missingFields.length > 0) {
            setFormError(`Please fill in all required fields: ${missingFields.join(', ')}`);
            setIsSubmitting(false);
            return;
        }

        // Ensure numeric fields are properly formatted
        cleanedFormData.price = parseFloat(cleanedFormData.price);
        cleanedFormData.cost = parseFloat(cleanedFormData.cost) || 0;
        cleanedFormData.stock_quantity = parseInt(cleanedFormData.stock_quantity) || 0;

        try {
            if (modalType === 'add') {
                console.log('Sending product data to backend:', cleanedFormData);
                const response = await productService.create(cleanedFormData);
                const newProduct = response.data.data;

                console.log('Product created successfully:', newProduct);

                // Update the products list with the new product
                setProducts(prevProducts => [...prevProducts, newProduct]);
                setFilteredProducts(prevFiltered => [...prevFiltered, newProduct]);

                // Show success notification
                setNotification({
                    show: true,
                    message: 'Product added successfully',
                    type: 'success'
                });
            } else if (modalType === 'edit') {
                console.log('Updating product data:', cleanedFormData);
                const response = await productService.update(cleanedFormData.id, cleanedFormData);
                const updatedProduct = response.data.data;

                console.log('Product updated successfully:', updatedProduct);

                setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                setFilteredProducts(filteredProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));

                // Show success notification
                setNotification({
                    show: true,
                    message: 'Product updated successfully',
                    type: 'success'
                });
            }

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);

            // Close modal
            setShowModal(false);
        } catch (error) {
            console.error('Error submitting form:', error);

            // Extract validation errors if available
            let errorMessage = 'An error occurred while saving the product';

            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat();
                errorMessage = errorMessages.join(', ');
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            // Set form error
            setFormError(errorMessage);

            // Show error notification
            setNotification({
                show: true,
                message: errorMessage,
                type: 'error'
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    return (
        <div className="w-full">
            {/* Header with search, categories, and add button */}
            <div className="my-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Products..."
                            className="bg-gray-200 bg-opacity-15 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500" onChange={handleSearch}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>

                <button
                    className="bg-black hover:bg-gray-900 text-white rounded-lg px-5 py-2 font-semibold flex items-center gap-2 shadow transition"
                    onClick={handleAdd}
            
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <Plus size={18} />
                            <span>Add Product</span>
                        </>
                    )}
                </button>
            </div>

            {/* Loading and Error States */}
            {loading ? (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products data...</p>
                </div>
            ) : error ? (
                <div className="text-center py-10">
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
                        <p className="font-semibold">Error loading products</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                    <button
                        onClick={fetchProductsData}
                        className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center py-4">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No products found matching your search.
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full max-w-[280px] bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 relative hover:border-gray-300"
                                >
                                    {/* Product Image Container */}
                                    <div className="relative w-full pt-4 px-4">
                                        <div className="relative h-36 overflow-hidden flex items-center justify-center">
                                            <img
                                                src={product.image_url && !product.image_url.includes('imgs.search.brave.com')
                                                    ? product.image_url
                                                    : '/placeholder-image.svg'}
                                                alt={product.name}
                                                className="h-auto transition-transform duration-500 hover:scale-105"
                                                style={{ width: '140px', height: '140px', objectFit: 'contain' }}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.svg';
                                                }}
                                            />
                                        </div>

                                        {/* Status badge */}
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Content */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        {/* Category Tag */}
                                        {product.category && (
                                            <div className="mb-2">
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    {product.category}
                                                </span>
                                            </div>
                                        )}

                                        {/* Product Name */}
                                        <h3 className="font-bold text-sm text-gray-800 mb-1 leading-tight line-clamp-2 h-10">
                                            {product.name}
                                        </h3>

                                        {/* Product Description */}
                                        <p className="text-gray-500 text-xs mb-2 line-clamp-2 flex-grow">
                                            {product.description || 'No description available.'}
                                        </p>

                                        {/* Stock */}
                                        <div className="text-xs text-gray-500 mb-3">
                                            Stock: {product.stock_quantity || 0} units
                                        </div>

                                        {/* Price and Actions */}
                                        <div className="mt-auto flex justify-between items-center">
                                            {/* Price */}
                                            <div className="font-bold text-lg text-gray-800 tracking-tight">
                                                ${Number(product.price).toFixed(2)}
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex space-x-1 bg-gray-50 rounded-lg p-1">
                                                <button
                                                    className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    onClick={() => handleView(product)}
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className="p-1.5 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                                                    onClick={() => handleEdit(product)}
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    onClick={() => handleDeleteClick(product)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && productToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
                        <h3 className="text-lg font-bold mb-4 flex items-center text-red-600">
                            <AlertCircle className="mr-2" size={24} />
                            Confirm Deletion
                        </h3>
                        <p className="mb-6">
                            Are you sure you want to delete <span className="font-semibold">{productToDelete.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleCancelDelete}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex justify-center items-center"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center z-50 ${notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {notification.type === 'success' ? (
                        <Check className="mr-2" size={20} />
                    ) : (
                        <AlertCircle className="mr-2" size={20} />
                    )}
                    <span>{notification.message}</span>
                    <button
                        onClick={() => setNotification({ show: false, message: '', type: '' })}
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Modal for Add/Edit/View */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto">
                        <h3 className="text-lg font-bold mb-4">
                            {modalType === 'add' && 'Add Product'}
                            {modalType === 'edit' && 'Edit Product'}
                            {modalType === 'view' && 'Product Details'}
                        </h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    required
                                    maxLength={100}
                                    disabled={modalType === 'view'}
                                    placeholder="Enter product name"
                                />
                                <p className="text-xs text-gray-500 mt-1">Maximum 100 characters</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    rows="3"
                                    disabled={modalType === 'view'}
                                    placeholder="Enter product description"
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Price ($) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        min="0"
                                        step="0.01"
                                        required
                                        disabled={modalType === 'view'}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Cost ($)</label>
                                    <input
                                        type="number"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        min="0"
                                        step="0.01"
                                        disabled={modalType === 'view'}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Stock Quantity</label>
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        value={formData.stock_quantity}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        min="0"
                                        disabled={modalType === 'view'}
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        disabled={modalType === 'view'}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Supplements">Supplements</option>
                                        <option value="Apparel">Apparel</option>
                                        <option value="Equipment">Equipment</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Nutrition">Nutrition</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                                <input
                                    type="text"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    disabled={modalType === 'view'}
                                    placeholder="https://example.com/image.jpg"
                                    maxLength={255}
                                />
                                {formData.image_url && formData.image_url.includes('imgs.search.brave.com') && (
                                    <p className="text-red-500 text-xs mt-1">
                                        Warning: Brave search image URLs are not supported. Please use a direct image URL.
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Maximum 255 characters</p>

                                {/* Image Preview */}
                                {formData.image_url && !formData.image_url.includes('imgs.search.brave.com') && (
                                    <div className="mt-2 border rounded-lg p-2 flex justify-center">
                                        <img
                                            src={formData.image_url}
                                            alt="Product preview"
                                            className="h-24 object-contain"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.svg';
                                                e.target.nextSibling =
                                                    <p className="text-red-500 text-xs">Image URL is invalid or inaccessible</p>;
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <input type="hidden" name="gym_id" value={formData.gym_id} />
                            </div>
                            <div className="mb-6 flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                    disabled={modalType === 'view'}
                                />
                                <label className="text-gray-700 font-semibold">Active</label>
                            </div>

                            {/* Form error message */}
                            {formError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                    <div className="flex items-center">
                                        <AlertCircle size={18} className="mr-2" />
                                        <span className="text-sm">{formError}</span>
                                    </div>
                                </div>
                            )}

                            {modalType !== 'view' && (
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex justify-center items-center"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {modalType === 'add' ? 'Adding...' : 'Saving...'}
                                        </>
                                    ) : (
                                        modalType === 'add' ? 'Add Product' : 'Save Changes'
                                    )}
                                </button>
                            )}

                            {modalType === 'view' && (
                                <button
                                    type="button"
                                    className="w-full bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold mt-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsCards;
