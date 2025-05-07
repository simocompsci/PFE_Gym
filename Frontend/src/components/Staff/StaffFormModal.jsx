import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Lock, Briefcase, Calendar, Loader2 } from 'lucide-react';
import './StaffFormModal.css'; // We'll create this CSS file for custom scrollbar

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
      setFormData(prevData => ({
        ...prevData,
        ...initialData,
        password: '' // Don't populate password when editing
      }));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-2 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto my-auto transform transition-all duration-300 scale-100 opacity-100 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl p-6 text-white relative">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h2>
          <p className="text-blue-100 mt-1 text-sm">
            {isEditing ? 'Update the information below' : 'Fill in the information below to add a new staff member'}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-blue-200 focus:outline-none transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form content */}
        <form id="staff-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Form error message */}
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start">
              <div className="text-red-500 mr-3 flex-shrink-0 pt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium">{errors.form}</div>
            </div>
          )}

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.first_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
              </div>
              {errors.first_name && (
                <p className="mt-1.5 text-xs text-red-600">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.last_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Doe"
                />
              </div>
              {errors.last_name && (
                <p className="mt-1.5 text-xs text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Email field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="john.doe@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone size={16} />
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Role field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Briefcase size={16} />
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="Coach">Coach</option>
                <option value="Secretary">Secretary</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Conditional fields based on role */}
          {formData.role === 'Coach' && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Specialization
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Briefcase size={16} />
                </div>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Yoga, Strength Training"
                />
              </div>
            </div>
          )}

          {formData.role === 'Secretary' && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Shift Schedule
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Calendar size={16} />
                </div>
                <input
                  type="text"
                  name="shift_schedule"
                  value={formData.shift_schedule}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="e.g., Morning: 6AM-2PM"
                />
              </div>
            </div>
          )}

          {/* Password field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder={isEditing ? "Leave blank to keep current" : "Minimum 8 characters"}
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
            )}
            {!errors.password && !isEditing && (
              <p className="mt-1.5 text-xs text-gray-500">Password must be at least 8 characters long</p>
            )}
          </div>

        </form>

        {/* Form actions - fixed at the bottom */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            form="staff-form" // Connect to the form
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditing ? 'Update' : 'Add Staff'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffFormModal;
