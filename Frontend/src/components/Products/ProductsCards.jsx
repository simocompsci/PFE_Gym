import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Trash2, Eye, X, AlertCircle, Check, Edit,
  Package, DollarSign, BarChart3, Tag, Layers, Loader2
} from 'lucide-react';
import { productService } from '../../lib/api';
import './ProductsCards.css'; // Import custom scrollbar styles

// Default form data for new products
const DEFAULT_FORM_DATA = Object.freeze({
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

// Product categories with icons and colors
const CATEGORIES = {
  'Supplements': { icon: Package, color: 'bg-purple-100 text-purple-800' },
  'Apparel': { icon: Tag, color: 'bg-blue-100 text-blue-800' },
  'Equipment': { icon: Layers, color: 'bg-orange-100 text-orange-800' },
  'Accessories': { icon: BarChart3, color: 'bg-green-100 text-green-800' },
  'Nutrition': { icon: DollarSign, color: 'bg-red-100 text-red-800' }
};

const ProductsCards = () => {
  // Products state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ''
  });

  // Fetch products data
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getAll();
      const productsData = response.data.data;

      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load products';
      setError(errorMessage);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debug modal state changes
  useEffect(() => {
    console.log('Modal state changed:', { showModal, modalType });
  }, [showModal, modalType]);

  // Show notification helper
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  }, []);

  // Modal handlers
  const closeModal = useCallback(() => {
    console.log('closeModal called');
    setShowModal(false);
    setFormError(null);
  }, []);

  // Product CRUD operations
  async function handleView(product) {
    console.log('handleView called with product:', product);
    try {
      // First check if we already have the product data
      if (product) {
        // Prepare the product data for the modal
        const viewData = {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          cost: product.cost || 0,
          stock_quantity: product.stock_quantity || 0,
          category: product.category || '',
          image_url: product.image_url || '',
          is_active: product.is_active,
          gym_id: product.gym_id
        };

        console.log('Opening view modal with data:', viewData);

        // First set the form data
        setFormData(viewData);

        // Then set the modal type
        setModalType('view');

        // Finally show the modal
        setShowModal(true);

        // Optionally fetch fresh data in the background
        try {
          const response = await productService.getById(product.id);
          const freshData = response.data.data;

          // Update the form data with fresh data if needed
          setFormData(prev => ({
            ...prev,
            ...freshData
          }));
        } catch (error) {
          // Silently handle the error
          console.log('Background refresh failed, using cached data', error.message);
        }
      }
    } catch (err) {
      console.error('Error handling product view:', err);
      showNotification('Failed to load product details', 'error');
    }
  }

  async function handleEdit(product) {
    console.log('handleEdit called with product:', product);
    try {
      // First use the data we already have
      if (product) {
        const initialData = {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price,
          cost: product.cost || 0,
          stock_quantity: product.stock_quantity || 0,
          category: product.category || '',
          image_url: product.image_url || '',
          is_active: product.is_active,
          gym_id: product.gym_id
        };

        console.log('Opening edit modal with data:', initialData);

        // First set the form data
        setFormData(initialData);

        // Then set the modal type
        setModalType('edit');

        // Finally show the modal
        setShowModal(true);

        // Try to get the latest data from the server
        try {
          const response = await productService.getById(product.id);
          const freshData = response.data.data;

          // Update the form with the latest data
          setFormData(freshData);
        } catch (error) {
          // If we can't get the latest data, just use what we have
          console.warn('Could not fetch latest product data, using cached data', error.message);
        }
      } else {
        showNotification('Product information is missing', 'error');
      }
    } catch (err) {
      console.error('Error preparing product edit:', err);
      showNotification('Failed to prepare product for editing', 'error');
    }
  }

  const handleDeleteClick = useCallback((product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await productService.delete(productToDelete.id);

      // Update products list
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setFilteredProducts(prev => prev.filter(p => p.id !== productToDelete.id));

      showNotification('Product deleted successfully');
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Failed to delete product',
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  }, [productToDelete, showNotification]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  }, []);

  // Form handlers
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSearch = useCallback((e) => {
    const term = e.target.value.toLowerCase();

    if (!term.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term)
    );

    setFilteredProducts(filtered);
  }, [products]);

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Clean up form data
    const cleanedFormData = { ...formData };

    // Remove problematic image URLs
    if (cleanedFormData.image_url?.includes('imgs.search.brave.com')) {
      cleanedFormData.image_url = '';
    }

    // Validate required fields
    const requiredFields = ['name', 'price', 'gym_id'];
    const missingFields = requiredFields.filter(field => !cleanedFormData[field]);

    if (missingFields.length > 0) {
      setFormError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Format numeric fields
    cleanedFormData.price = parseFloat(cleanedFormData.price);
    cleanedFormData.cost = parseFloat(cleanedFormData.cost) || 0;
    cleanedFormData.stock_quantity = parseInt(cleanedFormData.stock_quantity) || 0;

    try {
      if (modalType === 'add') {
        const response = await productService.create(cleanedFormData);
        const newProduct = response.data.data;

        setProducts(prev => [...prev, newProduct]);
        setFilteredProducts(prev => [...prev, newProduct]);
        showNotification('Product added successfully');
      } else if (modalType === 'edit') {
        const response = await productService.update(cleanedFormData.id, cleanedFormData);
        const updatedProduct = response.data.data;

        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setFilteredProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        showNotification('Product updated successfully');
      }

      closeModal();
    } catch (error) {
      // Extract validation errors if available
      let errorMessage = 'An error occurred while saving the product';

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat();
        errorMessage = errorMessages.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setFormError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, modalType, closeModal, showNotification]);

  // For debugging
  console.log('Rendering ProductsCards with state:', { showModal, modalType, formData });

  return (
    <div className="w-full">
      {/* Hidden debug element */}
      <div className="hidden">
        <span id="debug-show-modal">{showModal.toString()}</span>
        <span id="debug-modal-type">{modalType}</span>
      </div>

      {/* Header with search and add button */}
      <div className="my-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Products..."
              className="bg-gray-200 bg-opacity-15 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        <button
          className="bg-black hover:bg-gray-800 text-white rounded-lg px-5 py-2 font-semibold flex items-center gap-2 shadow transition-colors"
          onClick={() => {
            console.log('Add Product button clicked');

            // Set form data to default values
            const defaultData = { ...DEFAULT_FORM_DATA };
            console.log('Setting form data to default:', defaultData);
            setFormData(defaultData);

            // Set modal type to 'add'
            console.log('Setting modalType to "add"');
            setModalType('add');

            // Show the modal
            console.log('Setting showModal to true');
            setShowModal(true);

            // Debug check
            setTimeout(() => {
              console.log('After button click, showModal should be true. Current state:', {
                showModal: document.getElementById('debug-show-modal').textContent,
                modalType: document.getElementById('debug-modal-type').textContent
              });
            }, 100);
          }}
          type="button"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-10">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
            <p className="font-semibold">Error loading products</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center py-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              No products found matching your search.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))
          )}
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-2 sm:p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto relative my-4 sm:my-8 flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex-shrink-0 rounded-t-xl">
              <h2 className="text-xl font-bold">
                {modalType === 'add' && 'Add Product'}
                {modalType === 'edit' && 'Edit Product'}
                {modalType === 'view' && 'Product Details'}
              </h2>
              <button
                className="absolute top-4 right-4 text-white hover:text-blue-200 focus:outline-none transition-colors"
                onClick={closeModal}
              >
                <X size={24} />
              </button>
            </div>

            {modalType === 'view' ? (
              // View mode - Display product details in a clean format
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="mb-3"><span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-900">{formData.name}</span></div>
                <div className="mb-3"><span className="font-semibold text-gray-700">Description:</span> <span className="text-gray-900">{formData.description || 'Not provided'}</span></div>
                <div className="mb-3"><span className="font-semibold text-gray-700">Price:</span> <span className="text-gray-900">${Number(formData.price).toFixed(2)}</span></div>
                <div className="mb-3"><span className="font-semibold text-gray-700">Cost:</span> <span className="text-gray-900">${Number(formData.cost).toFixed(2)}</span></div>
                <div className="mb-3"><span className="font-semibold text-gray-700">Stock Quantity:</span> <span className="text-gray-900">{formData.stock_quantity} units</span></div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-700">Category:</span>
                  {formData.category ? (
                    <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      {formData.category}
                    </span>
                  ) : (
                    <span className="text-gray-500"> Not specified</span>
                  )}
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${formData.is_active ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {formData.image_url && !formData.image_url.includes('imgs.search.brave.com') && (
                  <div className="mt-4 mb-3">
                    <span className="font-semibold text-gray-700 block mb-2">Product Image:</span>
                    <div className="border rounded-lg p-2 flex justify-center">
                      <img
                        src={formData.image_url}
                        alt={formData.name}
                        className="h-32 object-contain"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.svg';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    onClick={() => {
                      closeModal();
                      setTimeout(() => handleEdit(formData), 100);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              // Add/Edit mode - Show form with StaffFormModal styling
              <>
                <form id="product-form" onSubmit={handleFormSubmit} className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                  {/* Form error message */}
                  {formError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start">
                      <div className="text-red-500 mr-3 flex-shrink-0 pt-0.5">
                        <AlertCircle size={18} />
                      </div>
                      <div className="text-sm font-medium">{formError}</div>
                    </div>
                  )}

                  {/* Product Name */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Package size={16} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        required
                        maxLength={100}
                        placeholder="Enter product name"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">Maximum 100 characters</p>
                  </div>

                  {/* Description */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      rows="3"
                      placeholder="Enter product description"
                    ></textarea>
                  </div>

                  {/* Price and Cost */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <DollarSign size={16} />
                        </div>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          min="0"
                          step="0.01"
                          required
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Cost ($)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <DollarSign size={16} />
                        </div>
                        <input
                          type="number"
                          name="cost"
                          value={formData.cost}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock and Category */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Stock Quantity
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Layers size={16} />
                        </div>
                        <input
                          type="number"
                          name="stock_quantity"
                          value={formData.stock_quantity}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          min="0"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Category
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Tag size={16} />
                        </div>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <option value="">Select a category</option>
                          <option value="Supplements">Supplements</option>
                          <option value="Apparel">Apparel</option>
                          <option value="Equipment">Equipment</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Nutrition">Nutrition</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Image URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        placeholder="https://example.com/image.jpg"
                        maxLength={255}
                      />
                    </div>
                    {formData.image_url && formData.image_url.includes('imgs.search.brave.com') && (
                      <p className="mt-1.5 text-xs text-red-600">
                        Warning: Brave search image URLs are not supported. Please use a direct image URL.
                      </p>
                    )}
                    <p className="mt-1.5 text-xs text-gray-500">Maximum 255 characters</p>

                    {/* Image Preview */}
                    {formData.image_url && !formData.image_url.includes('imgs.search.brave.com') && (
                      <div className="mt-2 border rounded-lg p-2 flex justify-center">
                        <img
                          src={formData.image_url}
                          alt="Product preview"
                          className="h-24 object-contain"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.svg';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <input type="hidden" name="gym_id" value={formData.gym_id} />
                  </div>

                  {/* Active Status */}
                  <div className="mb-6 flex items-center p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                      Active Product
                    </label>
                  </div>
                </form>

                {/* Form actions - fixed at the bottom */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    form="product-form" // Connect to the form
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        <span>{modalType === 'add' ? 'Adding...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <span>{modalType === 'add' ? 'Add Product' : 'Save Changes'}</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}


      {/* Delete confirmation dialog */}
      {showDeleteConfirm && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-2 sm:p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto relative my-4 sm:my-8 flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white flex-shrink-0 rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center">
                <AlertCircle className="mr-2" size={24} />
                Confirm Deletion
              </h2>
              <button
                className="absolute top-4 right-4 text-white hover:text-red-200 focus:outline-none transition-colors"
                onClick={handleCancelDelete}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{productToDelete.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition flex justify-center items-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification toast */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center z-50 ${notification.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
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
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  return (
    <div
      key={product.id}
      className="w-full max-w-[280px] bg-white rounded-xl overflow-hidden flex flex-col h-full border border-gray-200 relative "
    >
      {/* Product Image */}
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
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
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
              onClick={() => onView(product)}
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              className="p-1.5 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
              onClick={() => onEdit(product)}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => onDelete(product)}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsCards;