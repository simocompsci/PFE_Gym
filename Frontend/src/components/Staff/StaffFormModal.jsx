import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const StaffFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Coach',
    gym_id: 1, // Default gym ID, adjust as needed
    specialization: '',
    shift_schedule: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with data when editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        ...formData,
        ...initialData,
        password: '' // Don't populate password when editing
      });
    } else {
      // Reset form when adding new staff
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'Coach',
        gym_id: 1,
        specialization: '',
        shift_schedule: ''
      });
    }
  }, [isEditing, initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Only validate password for new staff
    if (!isEditing && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isEditing && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Remove empty fields
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password) delete dataToSubmit.password;
      if (dataToSubmit.role === 'Coach') {
        delete dataToSubmit.shift_schedule;
      } else {
        delete dataToSubmit.specialization;
      }
      
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
            {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
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
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Coach">Coach</option>
              <option value="Secretary">Secretary</option>
            </select>
          </div>
          
          {formData.role === 'Coach' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Yoga, Strength Training"
              />
            </div>
          )}
          
          {formData.role === 'Secretary' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shift Schedule
              </label>
              <input
                type="text"
                name="shift_schedule"
                value={formData.shift_schedule}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Morning: 6AM-2PM"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>
          
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
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffFormModal;
