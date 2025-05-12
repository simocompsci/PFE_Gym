import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/header';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import StatCards from '@/components/common/StatCards';
import { RevenueChart } from '../components/ui/RevenueChart';
import { MembershipStatsChart } from '../components/ui/MembershipStatsChart';
import { MemberdemgrChart } from '../components/ui/MemberdemgrChart';
import { ProductsSalesChart } from '../components/ui/ProductsSalesChart';
import { ProfitMarginChart } from '../components/ui/ProfitMarginChart';
import analyticsService from '@/lib/services/analyticsService';
import { toast } from 'react-hot-toast';

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    dashboardStats: null,
    revenueData: null,
    membershipStats: null,
    memberDemographics: null,
    productSales: null,
    profitMargins: null,
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // Fetch all analytics data in one call
        const data = await analyticsService.getAllAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Analytics' />
      <motion.div
        className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="mb-6">
              <StatCards stats={analyticsData.dashboardStats} />
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <RevenueChart data={analyticsData.revenueData} />
              <MembershipStatsChart data={analyticsData.membershipStats} />
            </div>

            {/* Secondary Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <MemberdemgrChart data={analyticsData.memberDemographics} />
              <ProductsSalesChart data={analyticsData.productSales} />
              <ProfitMarginChart data={analyticsData.profitMargins} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;