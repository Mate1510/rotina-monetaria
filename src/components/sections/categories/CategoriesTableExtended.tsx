'use client'

import React, { useContext, useEffect, useState } from 'react'
import { Category } from '@/categories'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { MdDelete, MdEdit, MdTrendingDown, MdTrendingUp } from 'react-icons/md'
import EditCategoryModal from './EditCategoryModal'
import DeleteCategoryModal from './DeleteCategoryModal'
import { Color } from '@/enum'
import { CategoriesContext } from '@/contexts/CategoriesContext'
import styles from '@/app/LittleSpinner.module.css'
import { toast } from 'react-toastify'

const CategoryTable = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { categories, loading, error, editCategory, deleteCategory } =
    useContext(CategoriesContext)
  const { data: session } = useSession()

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (updatedCategory: Category) => {
    if (updatedCategory) {
      editCategory(updatedCategory)
      setIsEditModalOpen(false)
    }
  }

  const handleConfirmDelete = () => {
    deleteCategory(selectedCategory!.id)
    setIsDeleteModalOpen(false)
  }

  return (
    <div data-testid="categories-table-extended" className="min-w-full w-full">
      <div className="min-w-full overflow-x-auto rounded-2xl bg-primaryOrange p-0.5 no-scrollbar">
        <table className="w-full bg-white overflow-hidden rounded-2xl">
          <thead className="bg-primaryOrange text-left text-white font-medium text-base">
            <tr>
              <th className="py-2 px-4 border-b font-medium">Cor</th>
              <th className="py-2 px-4 border-b font-medium">
                Nome da Categoria
              </th>
              <th className="py-2 px-4 border-b font-medium">Tipo</th>
              <th className="py-2 px-4 border-b font-medium">Ações</th>
            </tr>
          </thead>

          <tbody className="font-medium">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  <div className="flex gap-3 items-center justify-center">
                    <div className={styles.spinner}></div>
                    Carregando suas categorias... ⌛
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  <div className="flex gap-3 items-center justify-center">
                    Tivemos um pequeno erro, recarregue a página 😢
                  </div>
                </td>
              </tr>
            ) : !categories || categories.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  Suas categorias não chegaram aqui ainda...
                </td>
              </tr>
            ) : (
              categories.map(category => (
                <tr key={category.id}>
                  <td className="flex py-2 px-4 border-b">
                    <span
                      className="w-10 h-10 rounded-full border border-textGray"
                      style={{
                        backgroundColor:
                          Color[category.color as keyof typeof Color],
                      }}
                    ></span>
                  </td>
                  <td className="py-2 px-4 border-b">{category.name}</td>
                  {category.transactionType === 'INCOME' ? (
                    <td className="py-2 px-4 border-b text-green-500">
                      <MdTrendingUp size={38} />
                    </td>
                  ) : (
                    <td className="py-2 px-4 border-b text-red-500">
                      <MdTrendingDown size={38} />
                    </td>
                  )}
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center justify-center gap-5">
                      <MdEdit
                        className="text-primaryOrange cursor-pointer transform transition-transform duration-300 hover:scale-125"
                        onClick={() => handleEditClick(category)}
                        size={20}
                      />
                      <MdDelete
                        className="text-primaryOrange cursor-pointer transform transition-transform duration-300 hover:scale-125"
                        onClick={() => handleDeleteClick(category)}
                        size={20}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}

            {selectedCategory && (
              <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                category={selectedCategory}
                onSave={handleSave}
              />
            )}
            {selectedCategory && (
              <DeleteCategoryModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryTable
