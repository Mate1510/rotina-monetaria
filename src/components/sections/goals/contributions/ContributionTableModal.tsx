'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ModalComponent from '../../Modal'
import { Finance } from '@/finance'
import { MdDelete } from 'react-icons/md'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import DeleteContributionModal from './DeleteContributionModal'
import { useGoals } from '@/contexts/GoalContext'

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [contributionToDelete, setContributionToDelete] =
    useState<Finance | null>(null)
  const { data: session } = useSession()
  const { deleteContribution } = useGoals()

  useEffect(() => {
    if (!session) return

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
          toast.error('Erro ao coletar aportes. Tente novamente mais tarde!')
        }
      }

      fetchFinancesForGoal()
    }
  }, [goalId, isOpen, session])

  const handleDeleteClick = (finance: Finance) => {
    setContributionToDelete(finance)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (contributionToDelete) {
      try {
        await axios.delete(`/api/finances/${contributionToDelete.id}`)

        setFinances(prevFinances =>
          prevFinances.filter(f => f.id !== contributionToDelete.id),
        )

        deleteContribution(
          goalId,
          contributionToDelete.id,
          parseFloat(contributionToDelete.value.toString()),
        )
        toast.success('Aporte deletado com sucesso!')
      } catch (error) {
        toast.error('Erro ao deletar aporte. tente novamente mais tarde!')
      }

      setIsDeleteModalOpen(false)
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
              <th className="py-2 px-4 border-b text-white font-medium text-lg text-center">
                Data
              </th>
              <th className="py-2 px-4 border-b text-white font-medium text-center">
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
                  }).format(parseFloat(finance.value.toString()))}
                </td>
                <td className="py-2 px-4 border-b border-primaryOrange text-constrastBlack font-medium text-center">
                  {new Date(finance.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b border-primaryOrange text-constrastBlack font-medium text-center">
                  <div className="flex justify-around items-center">
                    {!finance.name.endsWith(' - Meta') && (
                      <MdDelete
                        className="text-primaryOrange cursor-pointer transform transition-transform duration-300 hover:scale-125"
                        onClick={() => handleDeleteClick(finance)}
                        size={20}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {finances.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  Suas finanças não chegaram aqui ainda...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteContributionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </ModalComponent>
  )
}

export default ContributionTableModal
