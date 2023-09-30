'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ModalComponent from '../Modal'
import { Finance } from '@/finance'
import { MdDelete } from 'react-icons/md'
import { useSession } from 'next-auth/react'

type ContributionTableModalProps = {
  isOpen: boolean
  onClose: () => void
  goalId: string
}

const ContributionTableModal: React.FC<ContributionTableModalProps> = ({
  isOpen,
  onClose,
  goalId,
}) => {
  const [finances, setFinances] = useState<Finance[]>([])

  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      return
    }

    const userId = session?.user.userId

    if (isOpen) {
      const fetchFinancesForGoal = async () => {
        try {
          const response = await axios.get(
            `/api/goals/contributions?userid=${userId}&goalid=${goalId}`,
          )
          const goalFinances = response.data

          if (Array.isArray(goalFinances)) {
            setFinances(goalFinances)
          }
        } catch (error) {
          console.error("Error fetching goal's finances:", error)
        }
      }

      fetchFinancesForGoal()
    }
  }, [goalId, isOpen, session])

  const handleDeleteClick = async (finance: Finance) => {
    try {
      await axios.delete(`/api/finances/${finance.id}`)
      // Update the finances state to reflect the deletion
      setFinances(prevFinances => prevFinances.filter(f => f.id !== finance.id))
    } catch (error) {
      console.error('Error deleting the finance:', error)
    }
  }

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Histórico de Aportes"
    >
      <div className="min-w-full rounded-2xl bg-primaryOrange p-0.5">
        <table className="min-w-full bg-white overflow-hidden rounded-2xl">
          <thead className="bg-primaryOrange rounded-t-lg">
            <tr>
              <th className="py-2 px-4 border-b text-white font-medium text-lg text-center">
                Nome
              </th>
              <th className="py-2 px-4 border-b text-white font-medium text-lg text-center">
                Valor
              </th>
              <th className="py-2 px-4 border-b font-medium text-center">
                Excluir
              </th>
            </tr>
          </thead>
          <tbody>
            {finances.map((finance, index) => (
              <tr
                key={finance.id}
                className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
              >
                <td className="py-2 px-4 border-b border-primaryOrange text-constrastBlack font-medium text-center">
                  {finance.name}
                </td>
                <td className="py-2 px-4 border-b border-primaryOrange text-constrastBlack font-medium text-center">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(finance.value)}
                </td>

                <td className="py-2 px-4 border-b border-primaryOrange text-constrastBlack font-medium text-center">
                  <div className="flex justify-around items-center">
                    <MdDelete
                      className="text-primaryOrange cursor-pointer"
                      onClick={() => handleDeleteClick(finance)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {finances.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  Suas finanças não chegaram aqui ainda...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ModalComponent>
  )
}

export default ContributionTableModal
