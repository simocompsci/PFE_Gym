import { BarChart2, DollarSign, Menu, ShoppingBag, ShoppingCart, TrendingUp, Users, LogOut } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../lib/AuthContext';

const SIDEBAR_ITEMS = [
	{name: "Overview",icon: BarChart2,color: "black",href: "/admin/dashboard",},
    { name: "Staff", icon: ShoppingBag, color: "black", href: "/staff" },
	{ name: "Clients", icon: Users, color: "black", href: "/clients" },
	{ name: "Classes", icon: DollarSign, color: "black", href: "/classes" },
	{ name: "Products", icon: ShoppingCart, color: "black", href: "/products" },
	{ name: "Analytics", icon: TrendingUp, color: "black", href: "/analytics" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			} m-4 rounded-2xl shadow-lg`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-black p-4 flex flex-col border border-gray-900 rounded-2xl'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full text-gray-100 hover:bg-gray-800 hover:text-white transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>

				<nav className={`mt-8 flex-grow flex flex-col gap-1 ${isSidebarOpen ? '' : 'items-center'}`}>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href}>
							<motion.div className={`flex ${isSidebarOpen ? 'items-center justify-start' : 'items-center justify-center'} p-4 text-base font-medium rounded-lg hover:bg-gray-900 text-gray-100 hover:text-white transition-colors mb-2 group`}
								style={{ minHeight: 48 }}
							>
								<item.icon size={24} className="text-white group-hover:text-white transition-colors" />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 text-white whitespace-nowrap group-hover:text-white'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>

				{/* Logout Button at the Bottom */}
				<div className="mt-4 flex flex-col">
					<button
						onClick={handleLogout}
						className="flex items-center w-full p-4 text-base font-medium rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors mt-auto group focus:outline-none"
					>
						<LogOut size={20} className="text-white group-hover:text-white transition-colors" />
						{isSidebarOpen && (
							<motion.span
							className='ml-4 text-white whitespace-nowrap group-hover:text-white'
							initial={{ opacity: 0, width: 0 }}
							animate={{ opacity: 1, width: "auto" }}
							exit={{ opacity: 0, width: 0 }}
							transition={{ duration: 0.2, delay: 0.3 }}
						>
							Logout
						</motion.span>
						)}
					</button>
				</div>
			</div>
		</motion.div>
	);
};
export default Sidebar;