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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold font-sans text-gray-900">Staff Table</h2>
                    <div className="flex space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Staff..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="bg-gray-200 bg-opacity-15 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-200" size={18} />
                        </div>
                        <button
                            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center shadow"
                            onClick={handleAddStaff}
                        >
                            <Plus size={18} className="mr-1" /> Add Staff
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading staff data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
                            <p className="font-semibold">Error loading staff</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                        <button
                            onClick={fetchStaffData}
                            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-y-2 border-spacing-x-0 font-sans">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider rounded-s-lg'>Name</th>
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Email</th>
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Phone</th>
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Role</th>
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider rounded-e-lg'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="font-sans antialiased">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-900">
                                            No staff found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence>
                                        {currentUsers.map((user, index) => (
                                            <motion.tr
                                                key={`${user.role}-${user.id}`} // Using a combination of role and id for uniqueness
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={index % 2 === 0 ? 'bg-gradient-to-r from-blue-50 to-emerald-50' : 'bg-white'}
                                            >
                                                <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-800 rounded-l-xl">
                                                    {`${user.first_name} ${user.last_name}`}
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-700">
                                                    {user.email || 'N/A'}
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-700">
                                                    {user.phone}
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased">
                                                    <span className={`px-2 py-0.5 rounded font-semibold border ${
                                                        user.role === 'Coach'
                                                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                        } text-[13px] tracking-tight font-sans`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 rounded-r-xl">
                                                    <button
                                                        className='text-blue-500 hover:text-blue-700 p-2 rounded-full transition-colors duration-150'
                                                        onClick={() => handleEditStaff(user)}
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        className='text-red-400 hover:text-red-600 p-2 rounded-full transition-colors duration-150'
                                                        onClick={() => handleDeleteClick(user)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination - only show when not loading and no errors */}
                {!loading && !error && filteredUsers.length > 0 && (
                    <div className="flex items-center justify-between mt-4 px-2">
                        <div className="text-md text-gray-900">
                            Showing {filteredUsers.length === 0 ? 0 : indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} staff
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-900 cursor-not-allowed' : 'text-gray-50 hover:bg-gray-900'}`}
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {/* Page numbers */}
                            <div className="flex space-x-1">
                                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={`page-${page}`}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage === page
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredUsers.length / usersPerPage)))}
                                disabled={indexOfLastUser >= filteredUsers.length}
                                className={`p-2 rounded-md ${indexOfLastUser >= filteredUsers.length ? 'text-gray-900 cursor-not-allowed' : 'text-gray-50 hover:bg-gray-700'}`}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
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