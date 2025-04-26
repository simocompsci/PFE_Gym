import React from 'react'
import Header from '@/components/common/header'
import { motion } from 'framer-motion'
import StatCards from '@/components/common/StatCards'
import StaffTbale from '@/components/Staff/StaffTbale'

const StaffPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
    <Header title='Staff' />
    <motion.div
      className=' max-w-7xl mx-auto py-6 px-4 lg:px-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <StatCards />
      
      <StaffTbale />
      
    </motion.div>
  </div>
  )
}

export default StaffPage