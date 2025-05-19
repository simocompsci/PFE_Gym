import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Cloud, Sun } from 'lucide-react';

const Header = ({ title }) => {
	const [currentDate, setCurrentDate] = useState('');

	useEffect(() => {
		const date = new Date();
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		setCurrentDate(date.toLocaleDateString('en-US', options));
	}, []);

	return (
		<header className='bg-gray-100'>
			<div className='max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center'>
					{/* Left side - Title with decorative element */}
					<div className='relative flex items-center'>
						
						<div className='pl-2'>
							<h1 className='text-3xl font-bold text-gray-900'>{title}</h1>
						</div>
					</div>

					{/* Right side - Date, Weather, Location */}
					<div className='hidden md:flex items-center space-x-6 bg-white py-2 px-4 rounded-lg  border border-gray-100'>
						{/* Date */}
						<div className='flex items-center text-gray-600'>
							<Calendar className='mr-2 text-gray-400' size={18} />
							<span className='text-sm font-medium'>{currentDate}</span>
						</div>

						{/* Weather */}
						<div className='flex items-center text-gray-600 border-l border-gray-200 pl-6'>
							<div className='flex items-center'>
								<Sun className='mr-2 text-yellow-500' size={18} />
								<span className='text-sm font-medium'>24°C</span>
							</div>
							<div className='ml-2 flex items-center'>
								<Cloud className='mr-1 text-blue-400' size={16} />
								<span className='text-xs text-gray-500'>Partly Cloudy</span>
							</div>
						</div>

						{/* Location */}
						<div className='flex items-center text-gray-600 border-l border-gray-200 pl-6'>
							<MapPin className='mr-2 text-red-500' size={18} />
							<span className='text-sm font-medium'>Morocco, Rabat</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;