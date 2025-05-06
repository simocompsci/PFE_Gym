import React, { useState, useEffect } from "react";
import { User, Users, Info, Clock, Users2, AlertCircle, Check, X, Search } from "lucide-react";
import { classService } from "../../lib/api";

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
      <div className="mb-6 flex w-full justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Classes..."
            className="bg-gray-100 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          className="bg-black hover:bg-gray-900 text-white rounded-lg px-5 py-3 font-semibold flex items-center gap-2 shadow transition"
          onClick={handleAdd}
          title="Create Class"
        >
          <Plus size={20} />
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
        <div className="flex flex-wrap gap-6 justify-start">
          {filteredClasses.length === 0 ? (
            <div className="w-full text-center py-10 text-gray-500">
              No classes found matching your search.
            </div>
          ) : (
            filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="rounded-2xl bg-white border border-gray-200 p-7 max-w-xs min-w-[320px] flex flex-col gap-4 relative transition-all duration-200 hover:shadow-xl hover:-translate-y-1 group"
              >
                <div
                  className="flex items-center gap-4 mb-3 p-4 rounded-2xl"
                  style={{ background: cls.color_code || '#e5e7eb' }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center font-extrabold text-4xl shadow-sm border-2 border-white group-hover:scale-105 transition-all duration-200"
                    style={{ background: cls.color_code || '#e5e7eb', color: '#222' }}
                  >
                    {cls.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 font-sans tracking-tight mb-0.5">{cls.name}</h3>
                    <span className="text-xs text-gray-500 font-medium">
                      Coach: <span className="text-gray-700 font-semibold">
                        {cls.coach ? `${cls.coach.first_name} ${cls.coach.last_name}` : 'Not assigned'}
                      </span>
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-sans mb-3 leading-snug">{cls.description || 'No description available.'}</p>
                <div className="flex gap-4 items-center mt-auto">
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
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {cls.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {/* Card action buttons - styled row inside card */}
                <div className="flex flex-row items-center gap-2 mb-2 mt-1">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Class Details</h2>
            <div className="mb-2"><span className="font-semibold">Name:</span> {formData.name}</div>
            <div className="mb-2"><span className="font-semibold">Description:</span> {formData.description}</div>
            <div className="mb-2"><span className="font-semibold">Coach:</span> {coaches.find(c => c.id === formData.coach_id) ?
              `${coaches.find(c => c.id === formData.coach_id).first_name} ${coaches.find(c => c.id === formData.coach_id).last_name}` :
              'Not assigned'}</div>
            <div className="mb-2"><span className="font-semibold">Capacity:</span> {formData.max_capacity}</div>
            <div className="mb-2"><span className="font-semibold">Duration:</span> {formData.duration_minutes} min</div>
            <div className="mb-2"><span className="font-semibold">Status:</span> {formData.is_active ? 'Active' : 'Inactive'}</div>
            <div className="flex gap-2 mt-6">
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" onClick={() => { setShowModal(false); handleEdit(selectedClass); }}>Edit</button>
              <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (modalType === "edit" || modalType === "add") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">{modalType === "add" ? "Add Class" : "Edit Class"}</h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleFormChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coach</label>
                <select name="coach_id" value={formData.coach_id} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200">
                  <option value="">Select a coach</option>
                  {coaches.map(coach => (
                    <option key={coach.id} value={coach.id}>
                      {coach.first_name} {coach.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input type="number" name="max_capacity" value={formData.max_capacity} onChange={handleFormChange} min={1} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Duration (min)</label>
                  <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleFormChange} min={1} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color Code</label>
                <input type="color" name="color_code" value={formData.color_code} onChange={handleFormChange} className="w-full h-10 p-0 border rounded-lg" />
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleFormChange} className="mr-2" />
                <label className="text-sm font-medium">Active</label>
              </div>

              {/* Form error message */}
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle size={18} className="mr-2" />
                    <span className="text-sm">{formError}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {modalType === "add" ? "Adding..." : "Saving..."}
                    </>
                  ) : (
                    modalType === "add" ? "Add" : "Save"
                  )}
                </button>
                <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && modalType === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Delete Class</h2>
            <p>Are you sure you want to delete <span className="font-semibold">{selectedClass?.name}</span>?</p>
            <div className="flex gap-2 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center justify-center"
                onClick={confirmDelete}
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
              <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center z-50 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
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
    </div>
  );
};

export default ClassCards;
