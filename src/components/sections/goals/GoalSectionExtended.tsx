'use client'

import React, { useEffect, useState } from 'react'
import { Goal } from '@/goal'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import GoalCard from './GoalCard'
import { MdAdd } from 'react-icons/md'
import InsertGoalModal from './InsertGoalModal'
import useFetchGoals from '@/data/useFetchGoals'
import { useGoals } from '@/contexts/GoalContext'

const GoalsSectionExtended = () => {
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false)

  const { data: session } = useSession()
  const { goals, addGoal, deleteGoal, editGoal } = useGoals()

  const handleAddClick = () => {
    setIsInsertModalOpen(true)
  }

  const handleDelete = (goalId: string) => {
    deleteGoal(goalId)
  }

  const handleEdit = (updatedGoal: Goal) => {
    editGoal(updatedGoal)
  }

  return (
    <div
      data-testid="goals-section-extended"
      className="min-w-full w-full flex flex-wrap gap-5 items-center justify-center lg:justify-start"
    >
      <div
        onClick={handleAddClick}
        className="transition-all duration-300 ease-in-out transform hover:scale-105 container flex flex-col items-center justify-center gap-6 border border-solid border-primaryOrange rounded-lg p-5 h-[26vh] w-11/12 md:w-5/12 lg:w-[20vw] cursor-pointer shadow-sm"
      >
        <MdAdd size={42} className="text-primaryOrange" />

        <h3 className="text-primaryOrange text-xl font-semibold">
          Adicionar Meta
        </h3>
      </div>

      {goals.map(goal => (
        <div key={goal.id} className="w-11/12 md:w-5/12 lg:w-[20vw] xl:w-[18vw]">
          <GoalCard
            goal={goal}
            onDelete={() => handleDelete(goal.id)}
            onEdit={() => handleEdit(goal)}
          />
        </div>
      ))}

      {goals.length === 0 && (
        <div className="transition-all duration-300 ease-in-out transform hover:scale-105 container flex items-center justify-center gap-6 border border-solid border-primaryOrange rounded-lg p-5 h-[26vh] w-11/12 md:w-5/12 lg:w-[20vw]">
          <h3 className="text-constrastBlack text-lg font-semibold">
            Parece que você não tem metas ainda... 😔
          </h3>
        </div>
      )}

      {isInsertModalOpen && (
        <InsertGoalModal
          isOpen={isInsertModalOpen}
          onClose={() => setIsInsertModalOpen(false)}
          onGoalAdded={addGoal}
        />
      )}
    </div>
  )
}

export default GoalsSectionExtended
