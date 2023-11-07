'use client'

import React, { useState } from 'react'
import GoalCard from '@/components/sections/goals/GoalCard'
import InsertGoalModal from '../goals/InsertGoalModal'
import { Goal } from '@/goal'
import Link from 'next/link'
import { useGoals } from '@/contexts/GoalContext'

const GoalsSection = () => {
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false)
  const { goals, addGoal, deleteGoal, editGoal } = useGoals()

  const handleDelete = (goalId: string) => {
    deleteGoal(goalId)
  }

  const handleEdit = (updatedGoal: Goal) => {
    editGoal(updatedGoal)
  }

  return (
    <div
      data-testid="goals-homepage"
      className="bg-white w-full flex flex-col gap-10 mb-5 justify-center lg:items-center"
    >
      <Link
        href="/goals"
        className="self-center text-constrastBlack font-semibold text-2xl md:text-3xl transform transition-transform duration-300 hover:scale-110"
      >
        Suas Metas
      </Link>

      <div className="md:columns-2">
        {goals.map(goal => (
          <div
            key={goal.id}
            className="w-11/12 md:w-9/12 lg:w-[18vw] mx-auto mb-5 md:mb-0"
          >
            <GoalCard
              goal={goal}
              onDelete={() => handleDelete(goal.id)}
              onEdit={() => handleEdit(goal)}
            />
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="transition-all duration-300 ease-in-out transform hover:scale-105 container mx-auto flex items-center justify-center gap-6 border border-solid border-primaryOrange rounded-lg p-5 w-11/12 md:w-5/12 lg:w-[20vw] h-[26vh]">
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

export default GoalsSection
