import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/header';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import StatCards from '@/components/common/StatCards';
import { RevenueChart } from '../components/ui/RevenueChart';
import { MembershipStatsChart } from '../components/ui/MembershipStatsChart';
import { MemberdemgrChart } from '../components/ui/MemberdemgrChart';
import { ProductsSalesChart } from '../components/ui/ProductsSalesChart';
import { ProfitMarginChart } from '../components/ui/ProfitMarginChart';

const AnalyticsPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Analytics' />
      <motion.div
        className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Summary Stats */}
        <div className="mb-6">
          <StatCards />
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart />
          <MembershipStatsChart />
        </div>

        {/* Secondary Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <MemberdemgrChart />
          <ProductsSalesChart />
          <ProfitMarginChart />
        </div>

        
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;