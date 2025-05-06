import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight, Eye, X, AlertCircle, Check } from 'lucide-react';
import { Edit } from 'lucide-react';
import { clientService } from '../../lib/api';

const ClientsTable = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' | 'edit' | 'view'
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        membership: 'Gold',
        is_active: true,
        gym_id: 1 // Default gym ID
    });

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    // Delete confirmation state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Notification state
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Fetch clients on component mount
    useEffect(() => {
        fetchClientsData();
    }, []);

    const fetchClientsData = async () => {
        try {
            setLoading(true);
            const response = await clientService.getAll();
            const clientsData = response.data.data;
            setClients(clientsData);
            setFilteredClients(clientsData);
            console.log('Clients data loaded successfully:', clientsData);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to load clients data';
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

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(10);

    const handleSearch = (e) => {
        const term = e.target.value;
        const lowerTerm = term.toLowerCase();
        const filtered = clients.filter(
            (client) =>
                client.name.toLowerCase().includes(lowerTerm) ||
                client.email.toLowerCase().includes(lowerTerm) ||
                client.phone.toLowerCase().includes(lowerTerm) ||
                client.membership.toLowerCase().includes(lowerTerm)
        );
        setFilteredClients(filtered);
        setCurrentPage(1);
    };


    // CRUD logic
    const handleAdd = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            membership: 'Gold',
            is_active: true,
            gym_id: 1
        });
        setModalType('add');
        setShowModal(true);
    };

    const handleEdit = async (client) => {
        try {
            // Get detailed client information
            const response = await clientService.getById(client.id);
            const clientData = response.data.data;

            // If we have detailed data, use it
            if (clientData) {
                setFormData({
                    id: clientData.id,
                    first_name: clientData.first_name,
                    last_name: clientData.last_name,
                    email: clientData.email || '',
                    phone: clientData.phone,
                    membership: clientData.membership_plan?.name || 'Gold',
                    is_active: clientData.is_active,
                    gym_id: clientData.gym_id || 1
                });
            } else {
                // Fallback to splitting the name if detailed data isn't available
                const nameParts = client.name.split(' ');
                const first_name = nameParts[0];
                const last_name = nameParts.slice(1).join(' ');

                setFormData({
                    id: client.id,
                    first_name,
                    last_name,
                    email: client.email || '',
                    phone: client.phone,
                    membership: client.membership,
                    is_active: client.active,
                    gym_id: 1
                });
            }

            setModalType('edit');
            setShowModal(true);
        } catch (error) {
            console.error('Error preparing client for edit:', error);
            setNotification({
                show: true,
                message: 'Failed to load client details',
                type: 'error'
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
        }
    };

    const handleView = async (client) => {
        try {
            // Get detailed client information
            const response = await clientService.getById(client.id);
            const clientData = response.data.data;

            // If we have detailed data, use it
            if (clientData) {
                setFormData({
                    id: clientData.id,
                    first_name: clientData.first_name,
                    last_name: clientData.last_name,
                    email: clientData.email || '',
                    phone: clientData.phone,
                    membership: clientData.membership_plan?.name || 'Gold',
                    is_active: clientData.is_active,
                    gym_id: clientData.gym_id || 1
                });
            } else {
                // Fallback to splitting the name if detailed data isn't available
                const nameParts = client.name.split(' ');
                const first_name = nameParts[0];
                const last_name = nameParts.slice(1).join(' ');

                setFormData({
                    id: client.id,
                    first_name,
                    last_name,
                    email: client.email || '',
                    phone: client.phone,
                    membership: client.membership,
                    is_active: client.active,
                    gym_id: 1
                });
            }

            setModalType('view');
            setShowModal(true);
        } catch (error) {
            console.error('Error preparing client for view:', error);
            setNotification({
                show: true,
                message: 'Failed to load client details',
                type: 'error'
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
        }
    };

    // Show delete confirmation dialog
    const handleDeleteClick = (client) => {
        setClientToDelete(client);
        setShowDeleteConfirm(true);
    };

    // Handle actual deletion
    const handleDelete = async () => {
        if (!clientToDelete) return;

        setIsDeleting(true);
        try {
            await clientService.delete(clientToDelete.id);
            setClients(clients.filter(c => c.id !== clientToDelete.id));
            setFilteredClients(filteredClients.filter(c => c.id !== clientToDelete.id));

            // Show success notification
            setNotification({
                show: true,
                message: 'Client deleted successfully',
                type: 'success'
            });

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);

            // Close confirmation dialog
            setShowDeleteConfirm(false);
            setClientToDelete(null);
        } catch (error) {
            console.error('Error deleting client:', error);

            // Show error notification
            setNotification({
                show: true,
                message: error.response?.data?.message || 'Failed to delete client',
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

    // Cancel delete operation
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setClientToDelete(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Reset form error
        setFormError(null);
        setIsSubmitting(true);

        try {
            if (modalType === 'add') {
                const response = await clientService.create(formData);
                const newClient = response.data.data;
                setClients([...clients, newClient]);
                setFilteredClients([...filteredClients, newClient]);

                // Show success notification
                setNotification({
                    show: true,
                    message: 'Client added successfully',
                    type: 'success'
                });
            } else if (modalType === 'edit') {
                // Prepare the update data
                const updateData = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone: formData.phone,
                    is_active: formData.is_active,
                    gym_id: formData.gym_id,
                    membership_plan: formData.membership
                };

                console.log('Sending update data:', updateData);

                const response = await clientService.update(formData.id, updateData);
                const updatedClient = response.data.data;

                // Create a client object with the format expected by the table
                const displayClient = {
                    id: updatedClient.id,
                    name: `${updatedClient.first_name} ${updatedClient.last_name}`,
                    email: updatedClient.email,
                    phone: updatedClient.phone,
                    membership: updatedClient.membership_plan?.name || formData.membership,
                    active: updatedClient.is_active
                };

                setClients(clients.map(c => c.id === updatedClient.id ? displayClient : c));
                setFilteredClients(filteredClients.map(c => c.id === updatedClient.id ? displayClient : c));

                // Show success notification
                setNotification({
                    show: true,
                    message: 'Client updated successfully',
                    type: 'success'
                });
            }

            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);

            // Close modal
            setShowModal(false);
        } catch (error) {
            console.error('Error submitting form:', error);

            // Set form error
            setFormError(error.response?.data?.message || 'An error occurred while saving the client');

            // Show error notification
            setNotification({
                show: true,
                message: error.response?.data?.message || 'Failed to save client',
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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    // Pagination calculations
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    // Enhanced pagination functions
    const paginate = (pageNumber) => {
        // Smooth scroll to top of table
        document.querySelector('.overflow-x-auto')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            // Smooth scroll to top of table
            document.querySelector('.overflow-x-auto')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            // Smooth scroll to top of table
            document.querySelector('.overflow-x-auto')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setCurrentPage(prev => prev - 1);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Show at most 5 page numbers

        if (totalPages <= maxPagesToShow) {
            // If we have 5 or fewer pages, show all of them
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);

            // Calculate start and end of page numbers to show
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're near the beginning
            if (currentPage <= 3) {
                end = 4;
            }

            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }

            // Add ellipsis after first page if needed
            if (start > 2) {
                pageNumbers.push('...');
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pageNumbers.push('...');
            }

            // Always show last page
            if (totalPages > 1) {
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    return (
        <>
            <motion.div
                className="bg-white bg-opacity-50 border border-gray-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold font-sans text-gray-900">Clients Table</h2>
                    <div className="flex space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Clients..."
                                className="bg-gray-200 bg-opacity-15 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                onChange={handleSearch}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-200" size={18} />
                        </div>
                        <button
                            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center shadow"
                            onClick={handleAdd}
                        >
                            <Plus size={18} className="mr-1" /> Add Client
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading clients data...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10">
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
                                <p className="font-semibold">Error loading clients</p>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                            <button
                                onClick={fetchClientsData}
                                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <table className="min-w-full border-separate border-spacing-y-2 border-spacing-x-0 font-sans">
                            <thead>
                                <tr className="bg-gray-900">
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider rounded-s-lg'>Name</th>
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Email</th>
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Phone</th>
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Membership</th>
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Active</th>
                                    <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider rounded-e-lg'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="font-sans antialiased">
                                {filteredClients.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-900">
                                            No clients found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence>
                                        {filteredClients.slice(indexOfFirstClient, indexOfLastClient).map((client, index) => (
                                            <motion.tr
                                                key={client.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={index % 2 === 0 ? 'bg-gradient-to-r from-blue-50 to-emerald-50' : 'bg-white'}
                                            >
                                                <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-800 rounded-l-xl">{client.name}</td>
                                                <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-700">{client.email || 'N/A'}</td>
                                                <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-700">{client.phone}</td>
                                                <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased">
                                                    <span className={`px-2 py-0.5 rounded font-semibold border ${client.membership === 'Gold' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : client.membership === 'Silver' ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-orange-100 text-orange-700 border-orange-200'} text-[13px] tracking-tight font-sans`}>
                                                        {client.membership}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased">
                                                    {client.active ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded font-semibold border border-green-200 text-[10px] font-sans">
                                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded font-semibold border border-red-200 text-[10px] font-sans">
                                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 rounded-r-xl">
                                                    <button
                                                        className='text-gray-400 hover:text-blue-600 p-2 rounded-full transition-colors duration-150'
                                                        onClick={() => handleView(client)}
                                                        title="View"
                                                    >
                                                        <span className="sr-only">View</span>
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        className='text-blue-500 hover:text-blue-700 p-2 rounded-full transition-colors duration-150'
                                                        onClick={() => handleEdit(client)}
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        className='text-red-400 hover:text-red-600 p-2 rounded-full transition-colors duration-150'
                                                        onClick={() => handleDeleteClick(client)}
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
                    )}

                    {/* Pagination - only show when not loading and no errors */}
                    {!loading && !error && filteredClients.length > 0 && (
                        <div className="flex items-center justify-between mt-4 px-2">
                            <div className="text-md text-gray-900">
                                Showing {filteredClients.length === 0 ? 0 : indexOfFirstClient + 1} to {Math.min(indexOfLastClient, filteredClients.length)} of {filteredClients.length} clients
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-900 cursor-not-allowed' : 'text-gray-50 hover:bg-gray-900'}`}
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {/* Page numbers */}
                                <div className="flex space-x-1">
                                    {getPageNumbers().map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
                                                {page}
                                            </span>
                                        ) : (
                                            <button
                                                key={`page-${page}`}
                                                onClick={() => paginate(page)}
                                                className={`px-3 py-1 rounded-md ${
                                                    currentPage === page
                                                        ? 'bg-gray-900 text-white'
                                                        : 'text-gray-300 hover:bg-gray-700'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>

                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-900 cursor-not-allowed' : 'text-gray-50 hover:bg-gray-700'}`}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && clientToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
                        <h3 className="text-lg font-bold mb-4 flex items-center text-red-600">
                            <AlertCircle className="mr-2" size={24} />
                            Confirm Deletion
                        </h3>
                        <p className="mb-6">
                            Are you sure you want to delete <span className="font-semibold">{clientToDelete.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleCancelDelete}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex justify-center items-center"
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

            {/* Modal for Add/Edit/View */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto">
                        <h3 className="text-lg font-bold mb-4">
                            {modalType === 'add' && 'Add Client'}
                            {modalType === 'edit' && 'Edit Client'}
                            {modalType === 'view' && 'Client Details'}
                        </h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                        disabled={modalType === 'view'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        required
                                        disabled={modalType === 'view'}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    disabled={modalType === 'view'}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    required
                                    disabled={modalType === 'view'}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Membership</label>
                                <select
                                    name="membership"
                                    value={formData.membership}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    disabled={modalType === 'view'}
                                >
                                    <option value="Gold">Gold</option>
                                    <option value="Silver">Silver</option>
                                    <option value="Bronze">Bronze</option>
                                </select>
                            </div>
                            <div className="mb-6 flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                    disabled={modalType === 'view'}
                                />
                                <label className="text-gray-700 font-semibold">Active</label>
                            </div>

                            {/* Form error message */}
                            {formError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                    <div className="flex items-center">
                                        <AlertCircle size={18} className="mr-2" />
                                        <span className="text-sm">{formError}</span>
                                    </div>
                                </div>
                            )}
                            {modalType !== 'view' && (
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex justify-center items-center"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {modalType === 'add' ? 'Adding...' : 'Saving...'}
                                        </>
                                    ) : (
                                        modalType === 'add' ? 'Add Client' : 'Save Changes'
                                    )}
                                </button>
                            )}
                            {modalType === 'view' && (
                                <button
                                    type="button"
                                    className="w-full bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold mt-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ClientsTable;
