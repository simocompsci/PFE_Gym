import React, { useState, useEffect } from "react";
import { User, Users, Info, Clock, Users2, AlertCircle, Check, X, Search, Loader2 } from "lucide-react";
import { classService } from "../../lib/api";
import './ClassCards.css';

const statusColors = [
  { label: "Active", color: "bg-green-100 text-green-700" },
  { label: "Inactive", color: "bg-gray-100 text-gray-500" },
];
import { Edit, Trash2, Plus, Eye } from "lucide-react";

const ClassCards = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coaches, setCoaches] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // view | edit | add | delete
  const [selectedClass, setSelectedClass] = useState(null);

  // Modal form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coach_id: "",
    gym_id: 1,
    duration_minutes: 45,
    max_capacity: 10,
    color_code: "#e5e7eb",
    is_active: true
  });

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Delete confirmation state
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: ''
  });

  // Fetch classes and coaches on component mount
  useEffect(() => {
    fetchClassesData();
    fetchCoachesData();
  }, []);

  const fetchClassesData = async () => {
    try {
      setLoading(true);
      const response = await classService.getAll();
      const classesData = response.data.data;
      setClasses(classesData);
      setFilteredClasses(classesData);
      console.log('Classes data loaded successfully:', classesData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load classes data';
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

  const fetchCoachesData = async () => {
    try {
      const response = await classService.getCoaches();
      setCoaches(response.data.data);
    } catch (error) {
      console.error('Error fetching coaches:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = classes.filter(
      (classItem) =>
        classItem.name.toLowerCase().includes(term) ||
        classItem.description?.toLowerCase().includes(term) ||
        classItem.coach?.first_name?.toLowerCase().includes(term) ||
        classItem.coach?.last_name?.toLowerCase().includes(term)
    );
    setFilteredClasses(filtered);
  };

  // Open modal helpers
  const handleView = async (cls) => {
    try {
      // Get detailed class information
      const response = await classService.getById(cls.id);
      const classData = response.data.data;

      setSelectedClass(cls);
      setFormData({
        id: classData.id,
        name: classData.name,
        description: classData.description || '',
        coach_id: classData.coach_id,
        gym_id: classData.gym_id,
        max_capacity: classData.max_capacity || 20,
        duration_minutes: classData.duration_minutes,
        color_code: classData.color_code || '#3498db',
        is_active: classData.is_active
      });

      setModalType("view");
      setShowModal(true);
    } catch (error) {
      console.error('Error preparing class for view:', error);
      setNotification({
        show: true,
        message: 'Failed to load class details',
        type: 'error'
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  const handleEdit = async (cls) => {
    try {
      // Get detailed class information
      const response = await classService.getById(cls.id);
      const classData = response.data.data;

      setSelectedClass(cls);
      setFormData({
        id: classData.id,
        name: classData.name,
        description: classData.description || '',
        coach_id: classData.coach_id,
        gym_id: classData.gym_id,
        max_capacity: classData.max_capacity || 20,
        duration_minutes: classData.duration_minutes,
        color_code: classData.color_code || '#3498db',
        is_active: classData.is_active
      });

      setModalType("edit");
      setShowModal(true);
    } catch (error) {
      console.error('Error preparing class for edit:', error);
      setNotification({
        show: true,
        message: 'Failed to load class details',
        type: 'error'
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      description: "",
      coach_id: coaches.length > 0 ? coaches[0].id : '',
      gym_id: 1,
      duration_minutes: 45,
      max_capacity: 20,
      color_code: "#3498db",
      is_active: true
    });
    setModalType("add");
    setShowModal(true);
  };

  const handleDelete = (cls) => {
    setSelectedClass(cls);
    setModalType("delete");
    setShowModal(true);
  };

  // CRUD actions
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (modalType === "add") {
        const response = await classService.create(formData);
        const newClass = response.data.data;
        setClasses([...classes, newClass]);
        setFilteredClasses([...filteredClasses, newClass]);

        // Show success notification
        setNotification({
          show: true,
          message: 'Class added successfully',
          type: 'success'
        });
      } else if (modalType === "edit") {
        const response = await classService.update(formData.id, formData);
        const updatedClass = response.data.data;
        setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
        setFilteredClasses(filteredClasses.map(c => c.id === updatedClass.id ? updatedClass : c));

        // Show success notification
        setNotification({
          show: true,
          message: 'Class updated successfully',
          type: 'success'
        });
      }

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);

      setShowModal(false);
    } catch (error) {
      console.error('Error submitting form:', error);

      // Set form error
      setFormError(error.response?.data?.message || 'An error occurred while saving the class');

      // Show error notification
      setNotification({
        show: true,
        message: error.response?.data?.message || 'Failed to save class',
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

  const confirmDelete = async () => {
    if (!selectedClass) return;

    setIsDeleting(true);
    try {
      await classService.delete(selectedClass.id);
      setClasses(classes.filter(c => c.id !== selectedClass.id));
      setFilteredClasses(filteredClasses.filter(c => c.id !== selectedClass.id));

      // Show success notification
      setNotification({
        show: true,
        message: 'Class deleted successfully',
        type: 'success'
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);

      setShowModal(false);
    } catch (error) {
      console.error('Error deleting class:', error);

      // Show error notification
      setNotification({
        show: true,
        message: error.response?.data?.message || 'Failed to delete class',
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

  return (
    <div className="w-full relative">
      {/* Header with search and add button */}
      <div className="mb-6 flex flex-col sm:flex-row w-full justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search Classes..."
            className="bg-gray-200 bg-opacity-15 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500" onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white rounded-lg px-5 py-2.5 font-semibold flex items-center justify-center gap-2 shadow transition"
          onClick={handleAdd}
          title="Create Class"
        >
          <Plus size={18} />
          <span>Create Class</span>
        </button>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading classes data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
            <p className="font-semibold">Error loading classes</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={fetchClassesData}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClasses.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              No classes found matching your search.
            </div>
          ) : (
            filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="rounded-2xl bg-white border border-gray-200 p-5 sm:p-6 md:p-7 flex flex-col gap-4 relative transition-all duration-200 hover:shadow-xl hover:-translate-y-1 group h-full"
              >
                <div
                  className="flex flex-col sm:flex-row items-center gap-3 mb-3 p-3 sm:p-4 rounded-2xl"
                  style={{ background: cls.color_code || '#e5e7eb' }}
                >
                  <div
                    className="w-16 h-16 sm:w-18 md:w-20 sm:h-18 md:h-20 rounded-full flex items-center justify-center font-extrabold text-3xl sm:text-4xl shadow-sm border-2 border-white group-hover:scale-105 transition-all duration-200 mb-2 sm:mb-0"
                    style={{ background: cls.color_code || '#e5e7eb', color: '#222' }}
                  >
                    {cls.name[0]}
                  </div>
                  <div className="flex flex-col text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-sans tracking-tight mb-0.5 line-clamp-1">{cls.name}</h3>
                    <span className="text-xs text-gray-500 font-medium">
                      Coach: <span className="text-gray-700 font-semibold">
                        {cls.coach ? `${cls.coach.first_name} ${cls.coach.last_name}` : 'Not assigned'}
                      </span>
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-sans mb-3 leading-snug line-clamp-3">{cls.description || 'No description available.'}</p>
                <div className="flex flex-wrap gap-3 items-center mt-auto">
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Clock size={16} className="text-blue-400" />
                    <span>{cls.duration_minutes} min</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Users2 size={16} className="text-emerald-400" />
                    <span>{cls.max_capacity || 'Unlimited'} spots</span>
                  </span>
                </div>
                {/* Status badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {cls.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {/* Card action buttons - styled row inside card */}
                <div className="flex flex-row items-center justify-center sm:justify-start gap-2 mb-2 mt-3">
                  <button
                    className="p-2 rounded-full transition-colors bg-gray-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 shadow-sm"
                    title="Show Info"
                    onClick={() => handleView(cls)}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="p-2 rounded-full transition-colors bg-gray-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800 shadow-sm"
                    title="Edit"
                    onClick={() => handleEdit(cls)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="p-2 rounded-full transition-colors bg-gray-50 hover:bg-red-100 text-red-600 hover:text-red-800 shadow-sm"
                    title="Delete"
                    onClick={() => handleDelete(cls)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Dialogs */}
      {showModal && selectedClass && modalType === "view" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-2 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <h2 className="text-xl font-bold">Class Details</h2>
              <button
                className="absolute top-4 right-4 text-white hover:text-blue-200 focus:outline-none transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-3"><span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-900">{formData.name}</span></div>
              <div className="mb-3"><span className="font-semibold text-gray-700">Description:</span> <span className="text-gray-900">{formData.description || 'No description available'}</span></div>
              <div className="mb-3"><span className="font-semibold text-gray-700">Coach:</span> <span className="text-gray-900">{coaches.find(c => c.id === formData.coach_id) ?
                `${coaches.find(c => c.id === formData.coach_id).first_name} ${coaches.find(c => c.id === formData.coach_id).last_name}` :
                'Not assigned'}</span></div>
              <div className="mb-3"><span className="font-semibold text-gray-700">Capacity:</span> <span className="text-gray-900">{formData.max_capacity}</span></div>
              <div className="mb-3"><span className="font-semibold text-gray-700">Duration:</span> <span className="text-gray-900">{formData.duration_minutes} min</span></div>
              <div className="mb-3"><span className="font-semibold text-gray-700">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${formData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {formData.is_active ? 'Active' : 'Inactive'}
              </span></div>
              <div className="flex gap-3 mt-6">
                <button className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" onClick={() => { setShowModal(false); handleEdit(selectedClass); }}>Edit</button>
                <button className="flex-1 px-4 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (modalType === "edit" || modalType === "add") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-2 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <h2 className="text-xl font-bold">{modalType === "add" ? "Add Class" : "Edit Class"}</h2>
              <p className="text-blue-100 text-sm mt-1">
                {modalType === "add" ? "Create a new class" : "Update class information"}
              </p>
              <button
                className="absolute top-4 right-4 text-white hover:text-blue-200 focus:outline-none transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <form id="class-form" onSubmit={handleFormSubmit} className="flex flex-col gap-4 p-6 overflow-y-auto custom-scrollbar">
              {/* Name field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Class Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Info size={16} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border-gray-300"
                    placeholder="Yoga, HIIT, etc."
                  />
                </div>
              </div>

              {/* Description field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border-gray-300"
                    placeholder="Brief description of the class"
                    rows={3}
                  />
                </div>
              </div>

              {/* Coach field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Coach</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <select
                    name="coach_id"
                    value={formData.coach_id}
                    onChange={handleFormChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Select a coach</option>
                    {coaches.map(coach => (
                      <option key={coach.id} value={coach.id}>
                        {coach.first_name} {coach.last_name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Capacity and Duration fields */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Capacity</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Users size={16} />
                    </div>
                    <input
                      type="number"
                      name="max_capacity"
                      value={formData.max_capacity}
                      onChange={handleFormChange}
                      min={1}
                      className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border-gray-300"
                      placeholder="10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (min)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Clock size={16} />
                    </div>
                    <input
                      type="number"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleFormChange}
                      min={1}
                      required
                      className="w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border-gray-300"
                      placeholder="45"
                    />
                  </div>
                </div>
              </div>

              {/* Color Code field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Color Code</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color_code"
                    value={formData.color_code}
                    onChange={handleFormChange}
                    className="h-10 w-10 p-0 border rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">Select a color for the class card</span>
                </div>
              </div>

              {/* Active status */}
              <div className="mb-6 flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleFormChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                  Active Class
                </label>
              </div>

              {/* Form error message */}
              {formError && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start">
                  <div className="text-red-500 mr-3 flex-shrink-0 pt-0.5">
                    <AlertCircle size={18} />
                  </div>
                  <div className="text-sm font-medium">{formError}</div>
                </div>
              )}

            </form>

            {/* Form buttons in fixed footer */}
            <div className="p-4 border-t border-gray-100 mt-auto">
              <div className="flex gap-3">
                <button
                  type="submit"
                  form="class-form"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      <span>{modalType === "add" ? "Adding..." : "Saving..."}</span>
                    </>
                  ) : (
                    <span>{modalType === "add" ? "Add Class" : "Save Changes"}</span>
                  )}
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && modalType === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 p-2 sm:p-4 overflow-hidden">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center text-red-600">
              <AlertCircle className="mr-2" size={24} />
              Delete Class
            </h3>
            <p className="mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedClass?.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex justify-center items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span>Deleting...</span>
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
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-xl flex items-center z-50 transform transition-all duration-300 ${notification.type === 'success'
            ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200'
            : 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200'
          }`}>
          <div className={`mr-3 p-2 rounded-full ${notification.type === 'success' ? 'bg-green-200' : 'bg-red-200'
            }`}>
            {notification.type === 'success' ? (
              <Check className="text-green-600" size={18} />
            ) : (
              <AlertCircle className="text-red-600" size={18} />
            )}
          </div>
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification({ show: false, message: '', type: '' })}
            className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassCards;
