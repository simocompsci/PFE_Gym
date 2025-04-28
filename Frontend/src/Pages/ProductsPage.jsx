import React from 'react'
import Header from '@/components/common/header'
import ProductsCards from '@/components/Products/ProductsCards'


const ProductsPage = () => {
  return (
    <>
      <Header title="Products" />

      <div>
        <ProductsCards />
      </div></>
  )
}

export default ProductsPage