import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Edit } from 'lucide-react';

const ClientsTable = () => {
    const [clients, setClients] = useState([
        { id: 1, name: "Amina Karim", email: "amina@client.com", phone: "0654321900", membership: "Gold", active: true },
        { id: 2, name: "Youssef Messaoudi", email: "youssef@client.com", phone: "0678123400", membership: "Silver", active: false },
        { id: 3, name: "Nadia Fares", email: "nadia@client.com", phone: "0667891200", membership: "Bronze", active: true },
        { id: 4, name: "Karim Badr", email: "karim@client.com", phone: "0645678900", membership: "Gold", active: false },
    ]);
    const [filteredClients, setFilteredClients] = useState(clients);
    // Removed unused: searchTerm, setSearchTerm, currentClient, setCurrentClient


    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' | 'edit' | 'view'

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', membership: 'Gold', active: false });

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
        setFormData({ name: '', email: '', phone: '', membership: 'Gold', active: false });
        setModalType('add');
        setShowModal(true);
    };
    const handleEdit = (client) => {
        setFormData(client);
        setModalType('edit');
        setShowModal(true);
    };
    const handleView = (client) => {
        setFormData(client);
        setModalType('view');
        setShowModal(true);
    };
    const handleDelete = (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            setClients(clients.filter(c => c.id !== clientId));
            setFilteredClients(filteredClients.filter(c => c.id !== clientId));
        }
    };
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (modalType === 'add') {
            const newClient = { ...formData, id: Date.now() };
            setClients([...clients, newClient]);
            setFilteredClients([...filteredClients, newClient]);
        } else if (modalType === 'edit') {
            setClients(clients.map(c => c.id === formData.id ? formData : c));
            setFilteredClients(filteredClients.map(c => c.id === formData.id ? formData : c));
        }
        setShowModal(false);
    };
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    // Pagination calculations
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    // Pagination handlers
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                            {clients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-900">
                                        No clients found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.slice(indexOfFirstClient, indexOfLastClient).map((client, index) => (
                                    <motion.tr
                                        key={client.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={index % 2 === 0 ? 'bg-gradient-to-r from-blue-50 to-emerald-50' : 'bg-white'}
                                    >
                                        <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-800 rounded-l-xl">{client.name}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-700">{client.email}</td>
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
                                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /></svg>
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
                                                onClick={() => handleDelete(client.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Pagination */}
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
                                {[...Array(totalPages).keys()].map(number => (
                                    <button
                                        key={number + 1}
                                        onClick={() => paginate(number + 1)}
                                        className={`px-3 py-1 rounded-md ${currentPage === number + 1 ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                    >
                                        {number + 1}
                                    </button>
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
                </div>
            </motion.div>

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
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    required
                                    disabled={modalType === 'view'}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    required
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
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleInputChange}
                                    className="mr-2"
                                    disabled={modalType === 'view'}
                                />
                                <label className="text-gray-700 font-semibold">Active</label>
                            </div>
                            {modalType !== 'view' && (
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                >
                                    {modalType === 'add' ? 'Add Client' : 'Save Changes'}
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
