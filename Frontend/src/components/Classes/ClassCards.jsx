import React from "react";
import { User, Users, Info, Clock, Users2 } from "lucide-react";

// Dummy data for demonstration; replace with API data later
const classData = [
  {
    id: 1,
    name: "Yoga Flow",
    description: "A relaxing yoga class for all levels.",
    coach: "Sarah Lee",
    max_capacity: 20,
    duration_minutes: 60,
    color_code: "#f9e79f",
  },
  {
    id: 2,
    name: "HIIT Blast",
    description: "High-intensity interval training to get your heart pumping!",
    coach: "Mike Tyson",
    max_capacity: 15,
    duration_minutes: 45,
    color_code: "#fad7a0",
  },
  {
    id: 3,
    name: "Pilates Core",
    description: "Strengthen your core and improve flexibility.",
    coach: "Anna Smith",
    max_capacity: 18,
    duration_minutes: 50,
    color_code: "#b7e3fa",
  },
  {
    id: 4,
    name: "Yoga Flow",
    description: "A relaxing yoga class for all levels.",
    coach: "Sarah Lee",
    max_capacity: 20,
    duration_minutes: 60,
    color_code: "#f9e79f",
  },
  {
    id: 5,
    name: "HIIT Blast",
    description: "High-intensity interval training to get your heart pumping!",
    coach: "Mike Tyson",
    max_capacity: 15,
    duration_minutes: 45,
    color_code: "#fad7a0",
  },
  {
    id: 6,
    name: "Pilates Core",
    description: "Strengthen your core and improve flexibility.",
    coach: "Anna Smith",
    max_capacity: 18,
    duration_minutes: 50,
    color_code: "#b7e3fa",
  },
  {
    id: 7,
    name: "Yoga Flow",
    description: "A relaxing yoga class for all levels.",
    coach: "Sarah Lee",
    max_capacity: 20,
    duration_minutes: 60,
    color_code: "#f9e79f",
  },
  {
    id: 8,
    name: "HIIT Blast",
    description: "High-intensity interval training to get your heart pumping!",
    coach: "Mike Tyson",
    max_capacity: 15,
    duration_minutes: 45,
    color_code: "#fad7a0",
  },
  {
    id: 9,
    name: "Pilates Core",
    description: "Strengthen your core and improve flexibility.",
    coach: "Anna Smith",
    max_capacity: 18,
    duration_minutes: 50,
    color_code: "#b7e3fa",
  },
];

const statusColors = [
  { label: "Active", color: "bg-green-100 text-green-700" },
  { label: "Inactive", color: "bg-gray-100 text-gray-500" },
];

import { useState } from "react";
import { Edit, Trash2, Plus, Eye } from "lucide-react";

const ClassCards = ({ classes = classData }) => {
  const [classList, setClassList] = useState(classes);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // view | edit | add | delete
  const [selectedClass, setSelectedClass] = useState(null);

  // Modal form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coach: "",
    duration_minutes: 45,
    max_capacity: 10,
    color_code: "#e5e7eb",
  });

  // Open modal helpers
  const handleView = (cls) => {
    setSelectedClass(cls);
    setModalType("view");
    setShowModal(true);
  };
  const handleEdit = (cls) => {
    setSelectedClass(cls);
    setFormData(cls);
    setModalType("edit");
    setShowModal(true);
  };
  const handleAdd = () => {
    setFormData({
      name: "",
      description: "",
      coach: "",
      duration_minutes: 45,
      max_capacity: 10,
      color_code: "#e5e7eb",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (modalType === "add") {
      setClassList([
        ...classList,
        { ...formData, id: Date.now() },
      ]);
    } else if (modalType === "edit") {
      setClassList(
        classList.map((cls) =>
          cls.id === selectedClass.id ? { ...formData, id: cls.id } : cls
        )
      );
    }
    setShowModal(false);
  };
  const confirmDelete = () => {
    setClassList(classList.filter((cls) => cls.id !== selectedClass.id));
    setShowModal(false);
  };

  return (
    <div className="w-full relative">
      {/* Add Class Button at the top */}
      <div className="mb-6 flex w-full justify-end ">
        <button
          className="bg-black hover:bg-gray-900 text-white rounded-lg px-5 py-3 font-semibold flex items-center gap-2 shadow transition"
          onClick={handleAdd}
          title="Create Class"
        >
          <Plus size={20} />
          <span>Create Class</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-6 justify-start">
        {classList.map((cls) => (
          <div
            key={cls.id}
            className="rounded-2xl bg-white border border-gray-200 p-7 max-w-xs min-w-[320px] flex flex-col gap-4 relative transition-all duration-200 hover:shadow-xl hover:-translate-y-1 group"
          >
            {/* Modal Dialogs */}
            {showModal && selectedClass && modalType === "view" && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
                  <h2 className="text-xl font-bold mb-4">Class Details</h2>
                  <div className="mb-2"><span className="font-semibold">Name:</span> {selectedClass.name}</div>
                  <div className="mb-2"><span className="font-semibold">Description:</span> {selectedClass.description}</div>
                  <div className="mb-2"><span className="font-semibold">Coach:</span> {selectedClass.coach}</div>
                  <div className="mb-2"><span className="font-semibold">Capacity:</span> {selectedClass.max_capacity}</div>
                  <div className="mb-2"><span className="font-semibold">Duration:</span> {selectedClass.duration_minutes} min</div>
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
                      <textarea name="description" value={formData.description} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Coach</label>
                      <input type="text" name="coach" value={formData.coach} onChange={handleFormChange} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Capacity</label>
                        <input type="number" name="max_capacity" value={formData.max_capacity} onChange={handleFormChange} min={1} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Duration (min)</label>
                        <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleFormChange} min={1} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Color Code</label>
                      <input type="color" name="color_code" value={formData.color_code} onChange={handleFormChange} className="w-12 h-8 p-0 border-none bg-transparent" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">{modalType === "add" ? "Add" : "Save"}</button>
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
                    <button className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={confirmDelete}>Delete</button>
                    <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

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
                <span className="text-xs text-gray-500 font-medium">Coach: <span className="text-gray-700 font-semibold">{cls.coach}</span></span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-sans mb-3 leading-snug">{cls.description}</p>
            <div className="flex gap-4 items-center mt-auto">
              <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                <Clock size={16} className="text-blue-400" />
                <span>{cls.duration_minutes} min</span>
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                <Users2 size={16} className="text-emerald-400" />
                <span>{cls.max_capacity} spots</span>
              </span>
            </div>
            {/* Status badge (optional) */}
            {/* <div className="absolute top-4 right-4 text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700 font-semibold">Active</div> */}
            <button className="mt-2 w-full bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassCards;
