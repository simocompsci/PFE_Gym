import React from 'react'
import Header from '../components/common/header'
import StatCards from '../components/common/StatCards'
import { motion } from 'framer-motion'
import MessageCards from '../components/common/MessageCrads'
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";


const OverviewPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Overview' />
      <motion.div
        className=' max-w-7xl mx-auto py-6 px-4 lg:px-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <MessageCards name='Total Clients' icon={Zap} value='9879' color='#72b7ef' />
          <MessageCards name='Total Clients' icon={Zap} value='9879' color='#72b7ef' />
        </div>
        <StatCards />
        

      </motion.div>
    </div>
  )
}

export default OverviewPage