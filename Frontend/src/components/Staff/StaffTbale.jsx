import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Edit } from 'lucide-react';


const StaffTbale = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", role: "customer", status: "active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin", status: "active" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "customer", status: "inactive" },
        { id: 4, name: "Alice Brown", email: "alice@example.com", role: "customer", status: "active" },
        { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "moderator", status: "active" },
    ]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                user.role.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <>
            <motion.div
                className="bg-gray-100 border border-gray-200 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Users</h2>
                    <div className="flex space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="bg-gray-400 bg-opacity-15 text-black  placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-600" size={18} />
                        </div>
                        <button
                            className="bg-[#118ac1] hover:bg-[#118ac1]/50 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <Plus size={18} className="mr-1" /> Add User
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
                    <table className="min-w-full border-separate border-spacing-y-1 border-spacing-x-0">
                        <thead>
                            <tr className="bg-gray-900">
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider rounded-s-lg'>
                                    Name
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
                                    Email
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
                                    Role
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider rounded-e-lg'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-700'>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-900">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className={`${index % 2 === 0 ? 'bg-gray-400 bg-opacity-10' : 'bg-gray-100'} overflow-hidden rounded-xl`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-l-xl">
                                            {user.name}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                            {user.email}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                            {user.role}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                            {user.status}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-r-xl'>
                                            <button
                                                className='text-blue-900 hover:text-blue-500 mr-2'

                                            >
                                                <Edit size={20} />
                                            </button>
                                            <button
                                                className='text-red-700 hover:text-red-500'

                                            >
                                                <Trash2 size={20} />
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
                            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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






            </motion.div>
        </>
    )
}

export default StaffTbale;