import Button from '@/components/components/Button'
import { Color } from '@/enum'
import { Goal } from '@/goal'
import axios from 'axios'
import React, { useState } from 'react'
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import DeleteGoalModal from './DeleteGoalModal'
import EditGoalModal from './EditGoalModal'
import { AiOutlineConsoleSql } from 'react-icons/ai'
import ContributionGoalModal from './contributions/ContributionGoalModal'
import ContributionTableModal from './contributions/ContibutionTableModal'
import { toast } from 'react-toastify'
import { useGoals } from '@/contexts/GoalContext'

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
  const { deleteGoal, editGoal } = useGoals();

  const handleEditClick = (goal: Goal) => {
    setGoalToEdit(goal)
  }

  const handleSave = async (updatedGoal: Goal) => {
    editGoal(updatedGoal);
    setGoalToEdit(null);
  }

  const handleDeleteClick = (goalId: string) => {
    setGoalToDelete(goalId)
  }

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return
    deleteGoal(goalToDelete);
    setGoalToDelete(null);
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
              className="text-primaryOrange cursor-pointer transform transition-transform duration-300 hover:scale-125"
              onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                handleInnerClick(e)
                handleEditClick(goal)
              }}
              size={20}
            />
            <MdDelete
              className="text-primaryOrange cursor-pointer transform transition-transform duration-300 hover:scale-125"
              onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
                handleInnerClick(e)
                handleDeleteClick(goal.id)
              }}
              size={20}
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
                  width: `${progressPercentage >= 100 ? 100.00 : progressPercentage}%`,
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
