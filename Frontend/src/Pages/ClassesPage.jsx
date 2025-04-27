import ClassCards from '@/components/Classes/ClassCards'
import React from 'react'
import Header from '@/components/common/header'

const ClassesPage = () => {
  return (
    <>
      <Header title="Classes" />

      <div className="mt-12">
        <ClassCards />
      </div></>

  )
}

export default ClassesPage