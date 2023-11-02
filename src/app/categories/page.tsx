import React from 'react'
import InsertCategories from '@/components/sections/categories/InsertCategories'
import CategoriesTableExtended from '@/components/sections/categories/CategoriesTableExtended'
import { CategoriesProvider } from '@/contexts/CategoriesContext'

const CategoriesPage = () => {
  return (
    <div className="container flex min-h-screen flex-col items-center p-5 gap-12 lg:max-w-screen-xl lg:mx-auto">
      <CategoriesProvider>
        <InsertCategories />
        <CategoriesTableExtended />
      </CategoriesProvider>
    </div>
  )
}

export default CategoriesPage
