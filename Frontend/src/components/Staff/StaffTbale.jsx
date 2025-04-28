import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Edit } from 'lucide-react';


const StaffTbale = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "Sara Benali", email: "sara@fitgym.com", phone: "0654321987", role: "Coach", present: true },
        { id: 2, name: "Omar Hachem", email: "omar@fitgym.com", phone: "0678123456", role: "Coach", present: false },
        { id: 3, name: "Lina Sassi", email: "lina@fitgym.com", phone: "0667891234", role: "Secretary", present: true },
        { id: 4, name: "Rami Toumi", email: "rami@fitgym.com", phone: "0645678912", role: "Secretary", present: false },
    ]);
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' | 'edit' | 'view'

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Coach', present: false });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const lowerTerm = term.toLowerCase();
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(lowerTerm) ||
                user.email.toLowerCase().includes(lowerTerm) ||
                user.phone.toLowerCase().includes(lowerTerm) ||
                user.role.toLowerCase().includes(lowerTerm)
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };


    // CRUD logic
    const handleAdd = () => {
        setFormData({ name: '', email: '', phone: '', role: 'Coach', present: false });
        setModalType('add');
        setShowModal(true);
    };
    const handleEdit = (user) => {
        setFormData(user);
        setModalType('edit');
        setShowModal(true);
    };
    const handleView = (user) => {
        setFormData(user);
        setModalType('view');
        setShowModal(true);
    };

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            setUsers(users.filter(u => u.id !== userId));
            setFilteredUsers(filteredUsers.filter(u => u.id !== userId));
        }
    };
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (modalType === 'add') {
            const newUser = { ...formData, id: Date.now() };
            setUsers([...users, newUser]);
            setFilteredUsers([...filteredUsers, newUser]);
        } else if (modalType === 'edit') {
            setUsers(users.map(u => u.id === formData.id ? formData : u));
            setFilteredUsers(filteredUsers.map(u => u.id === formData.id ? formData : u));
        }
        setShowModal(false);
    };


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    // Pagination calculations
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
                    <h2 className="text-lg font-bold font-sans text-gray-900">Staff Table</h2>
                    <div className="flex space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Staff..."
                                className="bg-gray-200 bg-opacity-15 text-black  placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"                                onChange={handleSearch}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-200" size={18} />
                        </div>
                        <button
                            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center shadow"
                            onClick={handleAdd}
                        >
                            <Plus size={18} className="mr-1" /> Add Staff
                        </button>
                    </div>
                </div>

                {/*{error && (
                    <div className="bg-red-900 bg-opacity-50 text-red-200 p-3 rounded-md mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <AlertCircle size={18} className="mr-2" />
                            {error}
                        </div>
                        <button
                            className="flex items-center text-red-200 hover:text-white bg-red-800 hover:bg-red-700 px-2 py-1 rounded text-sm"
                        >
                            <RefreshCw size={14} className="mr-1" /> Retry
                        </button>
                    </div>
                )}*/}

                {/* {!apiAvailable && !error && (
					<div className="bg-yellow-900 bg-opacity-50 text-yellow-200 p-3 rounded-md mb-4 flex items-center justify-between">
						<div className="flex items-center">
							<AlertCircle size={18} className="mr-2" />
							Using mock data. API server is not available.
						</div>
						<button
							onClick={fetchUsers}
							className="flex items-center text-yellow-200 hover:text-white bg-yellow-800 hover:bg-yellow-700 px-2 py-1 rounded text-sm"
						>
							<RefreshCw size={14} className="mr-1" /> Check Connection
						</button>
					</div>
				)}*/}

                <div className="overflow-x-auto">
                    {/*{loading ? (
						<div className="text-center py-4">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
							<p className="mt-2 text-gray-400">Loading users...</p>
						</div>
					) : (
						<>*/}
                    <table className="min-w-full border-separate border-spacing-y-2 border-spacing-x-0 font-sans">
                        <thead>
                            <tr className="bg-gray-900">
                                <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider rounded-s-lg'>Name</th>
                                <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Email</th>
                                <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Phone</th>
                                <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Role</th>
                                <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider'>Present</th>
                                <th className='px-2 py-2 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider rounded-e-lg'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="font-sans antialiased">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-900">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.slice(indexOfFirstUser, indexOfLastUser).map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={index % 2 === 0 ? 'bg-gradient-to-r from-blue-50 to-emerald-50' : 'bg-white'}
                                    >
                                        <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-800 rounded-l-xl">{user.name}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-700">{user.email}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased text-gray-700">{user.phone}</td>
                                        <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased">
                                            <span className={`px-2 py-0.5 rounded font-semibold border ${user.role === 'Coach' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'} text-[13px] tracking-tight font-sans`}>{user.role}</span>
                                        </td>
                                        <td className="px-2 py-2 whitespace-nowrap text-md font-semibold antialiased">
                                            {user.present ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded font-semibold border border-green-200 text-[10px] font-sans">
                                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded font-semibold border border-red-200 text-[10px] font-sans">
                                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 rounded-r-xl">
                                            <button
                                                className='text-gray-400 hover:text-blue-600 p-2 rounded-full transition-colors duration-150'
                                                onClick={() => handleView(user)}
                                                title="View"
                                            >
                                                <span className="sr-only">View</span>
                                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                                            </button>
                                            <button
                                                className='text-blue-500 hover:text-blue-700 p-2 rounded-full transition-colors duration-150'
                                                onClick={() => handleEdit(user)}
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                className='text-red-400 hover:text-red-600 p-2 rounded-full transition-colors duration-150'
                                                onClick={() => handleDelete(user.id)}
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
                </div>
                {/* Pagination Controls */}
                {filteredUsers.length > 0 && (
                    <div className="flex items-center justify-between mt-4 px-2">
                        <div className="text-md text-gray-900">
                            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} staff
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
                )}

                {/* Modal for CRUD operations */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="bg-white rounded-xl p-8 min-w-[320px] max-w-lg shadow-xl relative">
                            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
                            {modalType === 'view' ? (
                                <div>
                                    <h3 className="text-lg font-bold font-sans mb-2 text-gray-800">Staff Details</h3>
                                    <div className="space-y-2">
                                        <div><span className="font-semibold">Name:</span> {formData.name}</div>
                                        <div><span className="font-semibold">Email:</span> {formData.email}</div>
                                        <div><span className="font-semibold">Phone:</span> {formData.phone}</div>
                                        <div><span className="font-semibold">Role:</span> {formData.role}</div>
                                        <div><span className="font-semibold">Present:</span> {formData.present ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <h3 className="text-lg font-bold font-sans mb-2 text-gray-800">{modalType === 'add' ? 'Add Staff' : 'Edit Staff'}</h3>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Role</label>
                                        <select name="role" value={formData.role} onChange={handleInputChange} className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200">
                                            <option value="Coach">Coach</option>
                                            <option value="Secretary">Secretary</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="present" checked={formData.present} onChange={handleInputChange} id="present" />
                                        <label htmlFor="present" className="text-sm">Present today</label>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={() => setShowModal(false)}>Cancel</button>
                                        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{modalType === 'add' ? 'Add' : 'Update'}</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </>
    )
}

export default StaffTbale;