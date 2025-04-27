import React from 'react'
import Header from '../components/common/header'
import StatCards from '../components/common/StatCards'
import { motion } from 'framer-motion'
import MessageCards from '../components/common/MessageCrads'
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import MyCalendar from '@/components/Overview/MyCalendar'
import GymEvents from '@/components/Overview/GymEvents'
import StaffAttendance from '@/components/Overview/StaffAttendance'


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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
          <MessageCards
            type="quote"
            icon={Zap}
            color="#72b7ef"
            quote="You should always strive to be better."
            author="Unknown"
          />
          <MessageCards
            type="event"
            icon={Zap}
            color="#72b7ef"
            eventTitle="Yoga Masterclass"
            eventTime="18:00"
            eventType="Class"
          />
        </div>
        <StatCards />
        <div className="grid grid-cols-3 gap-3 mt-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <MyCalendar />
          <GymEvents />
          <StaffAttendance />
        </div>
      </motion.div>
    </div>
  )
}

export default OverviewPage