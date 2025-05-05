import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { staffService } from '../../lib/api';
import StaffFormModal from './StaffFormModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { toast } from 'react-hot-toast';

const StaffTable = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentStaff, setCurrentStaff] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchStaffData();
    }, []);

    // Update the fetchStaffData function with better error handling
    const fetchStaffData = async () => {
        try {
            setLoading(true);
            const response = await staffService.getAll();
            const staffData = response.data.data;
            setUsers(staffData);
            setFilteredUsers(staffData);
            console.log('Staff data loaded successfully:', staffData);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to load staff data';
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
        setSearchTerm(term);
        const filtered = users.filter(user =>
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.phone.toLowerCase().includes(term) ||
            user.role.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    // Handle opening the add staff modal
    const handleAddStaff = () => {
        setIsAddModalOpen(true);
    };

    // Handle opening the edit staff modal
    const handleEditStaff = (staff) => {
        setCurrentStaff(staff);
        setIsEditModalOpen(true);
    };

    // Handle opening the delete confirmation modal
    const handleDeleteClick = (staff) => {
        setCurrentStaff(staff);
        setIsDeleteModalOpen(true);
    };

    // Handle creating a new staff member
    const handleCreateStaff = async (staffData) => {
        setIsSubmitting(true);
        try {
            const response = await staffService.create(staffData);

            // Add the new staff to the list
            const newStaff = response.data.data;
            setUsers(prev => [...prev, newStaff]);
            setFilteredUsers(prev => [...prev, newStaff]);

            toast.success('Staff member added successfully');
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error creating staff:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add staff member';
            toast.error(errorMessage);
            throw error; // Re-throw to be handled by the form
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle updating a staff member
    const handleUpdateStaff = async (staffData) => {
        if (!currentStaff) return;

        setIsSubmitting(true);
        try {
            const response = await staffService.update(currentStaff.id, staffData);

            // Update the staff in the list
            const updatedStaff = response.data.data;
            setUsers(prev =>
                prev.map(user =>
                    (user.id === updatedStaff.id && user.role === updatedStaff.role)
                        ? updatedStaff
                        : user
                )
            );
            setFilteredUsers(prev =>
                prev.map(user =>
                    (user.id === updatedStaff.id && user.role === updatedStaff.role)
                        ? updatedStaff
                        : user
                )
            );

            toast.success('Staff member updated successfully');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating staff:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update staff member';
            console.error(errorMessage);
            throw error; // Re-throw to be handled by the form
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle deleting a staff member
    const handleDeleteStaff = async () => {
        if (!currentStaff) return;

        setIsSubmitting(true);
        try {
            await staffService.delete(currentStaff.id, currentStaff.role);

            // Remove the staff from the list
            setUsers(prev =>
                prev.filter(user =>
                    !(user.id === currentStaff.id && user.role === currentStaff.role)
                )
            );
            setFilteredUsers(prev =>
                prev.filter(user =>
                    !(user.id === currentStaff.id && user.role === currentStaff.role)
                )
            );

            console.log('Staff member deleted successfully');
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting staff:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete staff member';
            console.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get current users for pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <>
            <motion.div
                className="bg-white bg-opacity-50 border border-gray-200 rounded-xl p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Search and Add Staff Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search staff..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                    </div>
                    <button
                        onClick={handleAddStaff}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Staff
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                        <p className="mt-2 text-gray-400">Loading staff data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-4 text-red-500">
                        {error}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-y-2">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className="px-2 py-2 text-left text-sm font-semibold text-gray-100">Name</th>
                                    <th className="px-2 py-2 text-left text-sm font-semibold text-gray-100">Email</th>
                                    <th className="px-2 py-2 text-left text-sm font-semibold text-gray-100">Phone</th>
                                    <th className="px-2 py-2 text-left text-sm font-semibold text-gray-100">Role</th>
                                    <th className="px-2 py-2 text-left text-sm font-semibold text-gray-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {currentUsers.map((user) => (
                                        <motion.tr
                                            key={`${user.role}-${user.id}`} // Using a combination of role and id for uniqueness
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td className="px-2 py-2 whitespace-nowrap text-md font-semibold text-gray-800">
                                                {`${user.first_name} ${user.last_name}`}
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap text-md text-gray-700">
                                                {user.email}
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap text-md text-gray-700">
                                                {user.phone}
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded font-semibold ${user.role === 'Coach'
                                                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                    } text-[13px]`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                        onClick={() => handleEditStaff(user)}
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                        onClick={() => handleDeleteClick(user)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing {filteredUsers.length > 0 ? indexOfFirstUser + 1 : 0} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} results
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredUsers.length / usersPerPage)))}
                            disabled={indexOfLastUser >= filteredUsers.length}
                            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Add Staff Modal */}
            <StaffFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreateStaff}
                isEditing={false}
            />

            {/* Edit Staff Modal */}
            <StaffFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleUpdateStaff}
                initialData={currentStaff}
                isEditing={true}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteStaff}
                staffName={currentStaff ? `${currentStaff.first_name} ${currentStaff.last_name}` : ''}
                isDeleting={isSubmitting}
            />
        </>
    );
};

export default StaffTable;