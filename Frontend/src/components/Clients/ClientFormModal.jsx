import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { clientService } from '../../lib/api';

const ClientFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditing, isViewing }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    membership: 'Gold',
    is_active: true,
    gym_id: 1, // Default gym ID, adjust as needed
    notes: ''
  });
  
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Load membership plans
  useEffect(() => {
    if (isOpen) {
      fetchMembershipPlans();
    }
  }, [isOpen]);

  // Initialize form with data when editing or viewing
  useEffect(() => {
    if ((isEditing || isViewing) && initialData) {
      // Split the name into first_name and last_name if needed
      let first_name = initialData.first_name;
      let last_name = initialData.last_name;
      
      if (!first_name && initialData.name) {
        const nameParts = initialData.name.split(' ');
        first_name = nameParts[0];
        last_name = nameParts.slice(1).join(' ');
      }
      
      setFormData({
        ...formData,
        ...initialData,
        first_name: first_name || '',
        last_name: last_name || '',
        is_active: initialData.active !== undefined ? initialData.active : true
      });
    } else {
      // Reset form when adding new client
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        membership: 'Gold',
        is_active: true,
        gym_id: 1,
        notes: ''
      });
    }
  }, [isEditing, isViewing, initialData, isOpen]);

  const fetchMembershipPlans = async () => {
    setIsLoadingPlans(true);
    try {
      const response = await clientService.getMembershipPlans();
      if (response.data && response.data.data) {
        setMembershipPlans(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching membership plans:', error);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        // Convert is_active to active for the UI if needed
        active: formData.is_active
      };
      
      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Handle validation errors from the server
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ form: error.response?.data?.message || 'An error occurred' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isViewing ? 'Client Details' : isEditing ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {errors.form && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {errors.form}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isViewing}
              />
              {errors.first_name && (
                <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isViewing}
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isViewing}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              disabled={isViewing}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Membership
            </label>
            <select
              name="membership"
              value={formData.membership}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isViewing || isLoadingPlans}
            >
              {isLoadingPlans ? (
                <option>Loading plans...</option>
              ) : (
                membershipPlans.length > 0 ? (
                  membershipPlans.map(plan => (
                    <option key={plan.id} value={plan.name}>{plan.name}</option>
                  ))
                ) : (
                  <>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Bronze">Bronze</option>
                  </>
                )
              )}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              disabled={isViewing}
            ></textarea>
          </div>
          
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2"
              disabled={isViewing}
            />
            <label className="text-gray-700 font-medium">Active</label>
          </div>
          
          {!isViewing && (
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add Client'}
              </button>
            </div>
          )}
          
          {isViewing && (
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;
