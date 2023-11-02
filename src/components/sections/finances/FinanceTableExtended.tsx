'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Finance } from '@/finance'
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from 'react-icons/md'
import { Category } from '@/categories'
import { MdTrendingUp, MdTrendingDown, MdDelete, MdEdit } from 'react-icons/md'
import EditFinanceModal from './EditFinanceModal'
import DeleteFinanceModal from './DeleteFinanceModal'
import useFetchCategories from '@/data/useFetchCategories'
import { FinanceContext } from '@/contexts/FinanceContext'
import { toast } from 'react-toastify'
import styles from '@/app/LittleSpinner.module.css'

const FinanceTable = () => {
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [localMonth, setLocalMonth] = useState(new Date().getMonth() + 1)

  const {
    finances,
    setMonth,
    setYear,
    loading,
    error,
    editFinance,
    deleteFinance,
  } = useContext(FinanceContext)
  const { data: session } = useSession()
  const { data: categories } = useFetchCategories()

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  useEffect(() => {
    setMonth(localMonth)

    if (error) {
      toast.error(error)
    }
  }, [error, localMonth, setMonth])

  const prevMonth = () => {
    setLocalMonth(prev => (prev === 1 ? 12 : prev - 1))
  }

  const nextMonth = () => {
    setLocalMonth(prev => (prev === 12 ? 1 : prev + 1))
  }

  const handleEditClick = (finance: Finance) => {
    setSelectedFinance(finance)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (finance: Finance) => {
    setSelectedFinance(finance)
    setIsDeleteModalOpen(true)
  }

  const handleSave = (updatedFinance: Finance) => {
    if (updatedFinance) {
      editFinance(updatedFinance)
      setIsEditModalOpen(false)
    }
  }

  const handleConfirmDelete = () => {
    deleteFinance(selectedFinance!.id)
    setIsDeleteModalOpen(false)
  }

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(category => category.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  return (
    <div data-testid="finance-table-extended" className="min-w-full w-full">
      <div className="flex items-center justify-center mb-3">
        <MdOutlineNavigateBefore
          onClick={prevMonth}
          className="text-primaryOrange cursor-pointer"
          size={38}
        />
        <h3 className="text-primaryOrange font-semibold text-2xl">{`${
          monthNames[localMonth - 1]
        }`}</h3>
        <MdOutlineNavigateNext
          onClick={nextMonth}
          className="text-primaryOrange cursor-pointer"
          size={38}
        />
      </div>

      <div className="min-w-full overflow-x-auto rounded-2xl bg-primaryOrange p-0.5 no-scrollbar">
        <table className="min-w-full bg-white overflow-hidden rounded-2xl">
          <thead className="bg-primaryOrange text-left text-white font-medium text-base">
            <tr>
              <th className="py-2 px-4 border-b font-medium">Nome</th>
              <th className="py-2 px-4 border-b font-medium">Categoria</th>
              <th className="py-2 px-4 border-b font-medium">Data</th>
              <th className="py-2 px-4 border-b font-medium">Tipo</th>
              <th className="py-2 px-4 border-b font-medium">Valor</th>
              <th className="py-2 px-4 border-b font-medium text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="font-medium">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  <div className="flex gap-3 items-center justify-center">
                    <div className={styles.spinner}></div>
                    Carregando suas finanças... ⌛
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  <div className="flex gap-3 items-center justify-center">
                    Tivemos um pequeno erro, recarregue a página 😢
                  </div>
                </td>
              </tr>
            ) : !finances || finances.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  Suas finanças não chegaram aqui ainda...
                </td>
              </tr>
            ) : (
              finances.map(finance => (
                <tr key={finance.id}>
                  <td className="py-2 px-4 border-b">
                    <div className="truncate w-36">{finance.name}</div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="truncate w-36">
                      {getCategoryName(finance.categoryId)}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(finance.date).toLocaleDateString()}
                  </td>
                  {finance.type === 'INCOME' ? (
                    <td className="py-2 px-4 border-b text-green-500">
                      <MdTrendingUp size={38} />
                    </td>
                  ) : (
                    <td className="py-2 px-4 border-b text-red-500">
                      <MdTrendingDown size={38} />
                    </td>
                  )}
                  <td
                    className={`py-2 px-4 border-b ${
                      finance.type === 'INCOME'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {currencyFormatter.format(finance.value)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex justify-around items-center">
                      <MdEdit
                        className="text-primaryOrange cursor-pointer"
                        onClick={() => handleEditClick(finance)}
                      />
                      <MdDelete
                        className="text-primaryOrange cursor-pointer"
                        onClick={() => handleDeleteClick(finance)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {selectedFinance && (
          <EditFinanceModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            finance={selectedFinance}
            onSave={handleSave}
            categories={categories}
          />
        )}
        {selectedFinance && (
          <DeleteFinanceModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </div>
  )
}

export default FinanceTable
