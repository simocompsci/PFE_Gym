import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingBag, Eye, ArrowDownRight, ArrowUpRight } from "lucide-react";

const StatCards = ({ stats }) => {
	// If no stats are provided yet, use placeholder data
	const dashboardStats = stats || {
		totalMembers: 248,
		memberChange: 5.2,
		monthlyRevenue: 28459,
		revenueChange: 12.3,
		profitMargin: 32.8,
		profitMarginChange: -2.4,
		attendanceRate: 89,
		attendanceChange: 3.7
	};

	const overviewData = [
		{
			name: "Total Members",
			value: dashboardStats.totalMembers,
			change: dashboardStats.memberChange,
			icon: Users,
			bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
			iconColor: "text-blue-500"
		},
		{
			name: "Monthly Revenue",
			value: `$${dashboardStats.monthlyRevenue?.toLocaleString() || '0'}`,
			change: dashboardStats.revenueChange,
			icon: DollarSign,
			bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
			iconColor: "text-emerald-500"
		},
		{
			name: "Profit Margin",
			value: `${dashboardStats.profitMargin}%`,
			change: dashboardStats.profitMarginChange,
			icon: ShoppingBag,
			bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
			iconColor: "text-purple-500"
		},
		{
			name: "Class Attendance",
			value: `${dashboardStats.attendanceRate}%`,
			change: dashboardStats.attendanceChange,
			icon: Eye,
			bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
			iconColor: "text-amber-500"
		},
	];

	return (
		<div className='grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
			{overviewData.map((item, index) => (
				<motion.div
					key={item.name}
					className='bg-blue-300 bg-opacity-50 border border-blue-400 rounded-xl p-6'
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