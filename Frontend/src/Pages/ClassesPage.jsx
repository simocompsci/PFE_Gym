import ClassCards from '@/components/Classes/ClassCards'
import React from 'react'
import Header from '@/components/common/header'
import { motion } from 'framer-motion'

const ClassesPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title="Classes" />
      <motion.div
        className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ClassCards />
      </motion.div>
    </div>
  )
}

export default ClassesPage