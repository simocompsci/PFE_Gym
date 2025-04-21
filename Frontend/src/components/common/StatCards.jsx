import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingBag, Eye, ArrowDownRight, ArrowUpRight } from "lucide-react";

const overviewData = [
	{ name: "Revenue", value: "$1,288,539", change: 12.5, icon: DollarSign },
	{ name: "Users", value: "58", change: 8.3, icon: Users },
	{ name: "Orders", value: "9,879", change: -3.2, icon: ShoppingBag },
	{ name: "Page Views", value: "1,235", change: 15.7, icon: Eye },
];

const StatCards = () => {
	return (
		<div className='grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
			{overviewData.map((item, index) => (
				<motion.div
					key={item.name}
					className='bg-emerald-200 bg-opacity-50 border border-emerald-300 rounded-xl p-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: index * 0.1 }}
					whileHover={{ y: -5 }}
				>
					<div className='flex items-center justify-between'>
						<div>
							<h3 className='text-sm font-medium text-gray-600'>{item.name}</h3>
							<p className='mt-1 text-xl font-semibold text-gray-800'>{item.value}</p>
						</div>

						<div
							className={`
              p-3 rounded-full bg-opacity-20 ${item.change >= 0 ? "bg-white" : "bg-white"}
              `}
						>
							<item.icon className={`size-6  ${item.change >= 0 ? "text-cyan-500" : "text-cyan-500"}`} />
						</div>
					</div>
					<div
						className={`
              mt-4 flex items-center ${item.change >= 0 ? "text-green-500" : "text-red-500"}
            `}
					>
						{item.change >= 0 ? <ArrowUpRight size='20' /> : <ArrowDownRight size='20' />}
						<span className='ml-1 text-sm font-medium'>{Math.abs(item.change)}%</span>
						<span className='ml-2 text-sm text-gray-600'>vs last period</span>
					</div>
				</motion.div>
			))}
		</div>
	);
};
export default StatCards;