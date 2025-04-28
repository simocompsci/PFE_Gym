import React from 'react';
import StatCards from '../components/common/StatCards';
import ClientsTable from '../components/Clients/ClientsTable';
import Header from '@/components/common/header';
import { motion } from 'framer-motion';

const ClientsPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
    <Header title='Clients' />
    <motion.div
      className=' max-w-7xl mx-auto py-6 px-4 lg:px-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <StatCards />
      
      <ClientsTable />
      
    </motion.div>
  </div>
  );
}

export default ClientsPage