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
        className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Message Cards Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
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

        {/* Stats Section */}
        <div className="mb-6">
          <StatCards />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 xl:grid-cols-3 mb-8">
          <div className="h-full">
            <MyCalendar />
          </div>
          <div className="h-full">
            <GymEvents />
          </div>
          <div className="h-full md:col-span-2 xl:col-span-1">
            <StaffAttendance />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OverviewPage