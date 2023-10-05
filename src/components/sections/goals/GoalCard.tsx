import Button from '@/components/components/Button'
import { Color } from '@/enum'
import { Goal } from '@/goal'
import axios from 'axios'
import React, { useState } from 'react'
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import DeleteGoalModal from './DeleteGoalModal'
import EditGoalModal from './EditGoalModal'
import { AiOutlineConsoleSql } from 'react-icons/ai'
import ContributionGoalModal from './ContributionGoalModal'
import ContributionTableModal from './ContibutionTableModal'

const GoalCard = ({
  goal,
  onDelete,
  onEdit,
}: {
  goal: Goal
  onDelete: () => void
  onEdit: (updatedGoal: Goal) => void
}) => {
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
  const [isContributionTableOpen, setIsContributionTableOpen] =
    useState<boolean>(false)
  const [contributionModal, setContributionModal] = useState<{
    goalId: string
    goalName: string
    goalCurrentValue: string
  } | null>(null)
  const progressPercentage = (goal.currentGoalValue / goal.finalGoalValue) * 100

  const handleEditClick = (goal: Goal) => {
    setGoalToEdit(goal)
  }

  const handleSave = async (updatedGoal: Goal) => {
    if (!updatedGoal) return

    try {
      const financeResponse = await axios.get(
        `/api/finances/goal?goalid=${updatedGoal.id}`,
      )
      const financeData = financeResponse.data

      const { currentGoalValue, ...rest } = updatedGoal
      const response = await axios.put(`/api/goals/${updatedGoal.id}`, rest)

      if (!response) {
        throw new Error('Failed to update goal data.')
      }

      const updatedFinance = {
        ...financeData,
        name: updatedGoal.name + ' - Meta',
      }
      const financeUpdateResponse = await axios.put(
        `/api/finances/${financeData.id}`,
        updatedFinance,
      )

      if (!financeUpdateResponse.data || financeUpdateResponse.data.error) {
        throw new Error('Failed to update the associated finance data.')
      }

      if (!financeData || financeData.error) {
        throw new Error('Failed to get finance data.')
      }

      onEdit(updatedGoal)
    } catch (error) {
      console.error(error)
    }

    setGoalToEdit(null)
  }

  const handleDeleteClick = (goalId: string) => {
    setGoalToDelete(goalId)
  }

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return

    try {
      const response = await axios.delete(`/api/goals/${goal.id}`)

      if (!response) {
        throw new Error('Failed to delete goal data.')
      }

      onDelete()
    } catch (error) {
      console.error(error)
    }

    setGoalToDelete(null)
  }

  const handleAddContributionClick = () => {
    setContributionModal({
      goalId: goal.id,
      goalName: goal.name,
      goalCurrentValue: goal.currentGoalValue,
    })
  }

  const handleGoalCardClick = () => {
    setIsContributionTableOpen(true)
  }

  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div>
      <div
        onClick={handleGoalCardClick}
        className="transition-all duration-300 ease-in-out transform hover:scale-105 container flex flex-col gap-3 p-5 border border-solid border-primaryOrange rounded-lg w-full h-[28vh] cursor-pointer shadow-sm"
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <div
              style={{
                backgroundColor:
                  Color[goal.color as string as keyof typeof Color],
              }}
              className="w-6 h-6 rounded-full group-hover:w-8 group-hover:h-8"
            ></div>
            <h3 className="text-lg font-semibold text-constrastBlack">
              {goal.name}
            </h3>
          </div>

          <div className="flex gap-3">
            <MdEdit
              className="text-primaryOrange cursor-pointer"
              onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                handleInnerClick(e)
                handleEditClick(goal)
              }}
            />
            <MdDelete
              className="text-primaryOrange cursor-pointer"
              onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                handleInnerClick(e)
                handleDeleteClick(goal.id)
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-sm text-gray-500">
            {`Valor atual: ${new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(goal.currentGoalValue))}`}
          </p>

          <p className="text-sm text-gray-500">
            {`Valor Final: ${new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(Number(goal.finalGoalValue))}`}
          </p>

          <div className="flex flex-col">
            <p className="text-xs text-gray-500 self-end">
              {`${progressPercentage.toFixed(2)}%`}
            </p>

            <div className="h-3 rounded-full bg-gray-200">
              <div
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: `${
                    Color[goal.color as string as keyof typeof Color]
                  }`,
                }}
                className="h-3 rounded-full"
              ></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Data Final:{' '}
            {goal.finalGoalDate
              ? new Date(goal.finalGoalDate).toLocaleDateString()
              : 'Data não definida'}
          </p>

          <Button
            className="flex gap-0.5 items-center justify-center"
            onClick={e => {
              handleInnerClick(e)
              handleAddContributionClick()
            }}
          >
            <MdAdd size={16} className="text-white" />
          </Button>
        </div>
      </div>

      {goalToEdit && (
        <EditGoalModal
          isOpen={!!goalToEdit}
          onClose={() => setGoalToEdit(null)}
          goal={goalToEdit}
          onSave={handleSave}
        />
      )}

      {goalToDelete && (
        <DeleteGoalModal
          isOpen={!!goalToDelete}
          onClose={() => setGoalToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {contributionModal && (
        <ContributionGoalModal
          isOpen={!!contributionModal}
          onClose={() => setContributionModal(null)}
          goalId={contributionModal.goalId}
          goalName={contributionModal.goalName}
          goalCurrentValue={contributionModal.goalCurrentValue}
        />
      )}

      {isContributionTableOpen && (
        <ContributionTableModal
          isOpen={isContributionTableOpen}
          onClose={() => setIsContributionTableOpen(false)}
          goalId={goal.id}
        />
      )}
    </div>
  )
}

export default GoalCard
