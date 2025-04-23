import { BarChart2, DollarSign, Menu, ShoppingBag, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

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

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-blue-400  p-4 flex flex-col border-r border-r-gray-300'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full text-gray-100 hover:bg-blue-300 hover:text-white transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>

				<nav className='mt-8 flex-grow'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href}>
							<motion.div className='flex items-center p-4 text-base font-medium rounded-lg hover:bg-blue-300 text-gray-100 hover:text-white transition-colors mb-2 group'>
								<item.icon size={20} style={{ minWidth: "20px" }} className="text-white group-hover:text-white transition-colors" />
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
			</div>
		</motion.div>
	);
};
export default Sidebar;