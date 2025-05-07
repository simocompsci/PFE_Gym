import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, FileText, Briefcase, Loader2 } from 'lucide-react';
import { clientService } from '../../lib/api';
import './ClientFormModal.css';

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

      setFormData(prevData => ({
        ...prevData,
        ...initialData,
        first_name: first_name || '',
        last_name: last_name || '',
        is_active: initialData.active !== undefined ? initialData.active : true
      }));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-2 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto my-auto transform transition-all duration-300 scale-100 opacity-100 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl p-6 text-white relative">
          <h2 className="text-2xl font-bold">
            {isViewing ? 'Client Details' : isEditing ? 'Edit Client' : 'Add New Client'}
          </h2>
          <p className="text-blue-100 mt-1 text-sm">
            {isViewing
              ? 'View client information'
              : isEditing
                ? 'Update the client information below'
                : 'Fill in the information below to add a new client'}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-blue-200 focus:outline-none transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form id="client-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 custom-scrollbar">
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
                  disabled={isViewing}
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
                  disabled={isViewing}
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
                value={formData.email || ''}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="john.doe@example.com"
                disabled={isViewing}
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
                disabled={isViewing}
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Membership field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Membership
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Briefcase size={16} />
              </div>
              <select
                name="membership"
                value={formData.membership}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Notes field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Notes
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 text-gray-400">
                <FileText size={16} />
              </div>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                rows="3"
                placeholder="Additional information about the client"
                disabled={isViewing}
              ></textarea>
            </div>
          </div>

          {/* Active status */}
          <div className="mb-6 flex items-center p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isViewing}
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
              Active Client
            </label>
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
            {isViewing ? 'Close' : 'Cancel'}
          </button>

          {!isViewing && (
            <button
              form="client-form"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Update' : 'Add Client'}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientFormModal;
