'use client'

import React from 'react'
import useFetchCategories from '@/data/useFetchCategories'
import Link from 'next/link'
import { Color } from '@/enum'

const CategoriesSection = () => {
  const { data: categoriesData } = useFetchCategories()

  if (!Array.isArray(categoriesData)) {
    return
  }

  const categories = categoriesData.slice(0, 8)

  return (
    <div data-testid="categories-homepage" className="bg-white w-full flex flex-col gap-10 mb-5 p-10 px-12">
      <Link
        href="/categories"
        className="flex self-center text-constrastBlack font-semibold text-2xl md:text-3xl transform transition-transform duration-300 hover:scale-110"
      >
        Suas Categorias
      </Link>

      <div className="columns-2 gap-12">
        {categories.map(category => (
          <div
            key={category.id}
            className="w-full mb-3 flex items-center gap-3 group"
          >
            <div
              style={{
                backgroundColor: Color[category.color as keyof typeof Color],
              }}
              className="w-6 h-6 rounded-full transform transition-transform duration-300 group-hover:scale-125"
            ></div>
            <p className="text-lg group-hover:text-xl font-medium">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoriesSection
