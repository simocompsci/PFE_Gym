import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, icon, bgColor }) => {
  const isPositive = change >= 0;
  
  return (
    <div className={`rounded-xl p-5 ${bgColor || 'bg-white'} border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-800">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-white bg-opacity-60 shadow-sm">
          {icon}
        </div>
      </div>
      
      <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowUpRight size={16} className="mr-1" />
        ) : (
          <ArrowDownRight size={16} className="mr-1" />
        )}
        <span>{Math.abs(change)}%</span>
        <span className="ml-1.5 text-gray-500 text-xs">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;
