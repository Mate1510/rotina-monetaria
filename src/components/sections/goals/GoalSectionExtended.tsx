'use client'

import React, { useEffect, useState } from 'react'
import { Goal } from '@/goal'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import GoalCard from './GoalCard'
import { MdAdd } from 'react-icons/md'
import InsertGoalModal from './InsertGoalModal'
import useFetchGoals from '@/data/useFetchGoals'

const GoalsSectionExtended = () => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)

  const { data: session } = useSession()
  const { data: goalsData } = useFetchGoals(updateCount)

  useEffect(() => {
    if (!session) {
      return
    }

    if (Array.isArray(goalsData)) {
      setGoals(goalsData)
    }
  }, [session, updateCount, goalsData])

  const handleAddClick = () => {
    setIsInsertModalOpen(true)
  }

  const handleDelete = (goalId: string) => {
    setGoals(goals => goals.filter(goal => goal.id !== goalId))
  }

  const handleEdit = (updatedGoal: Goal) => {
    setGoals(goals =>
      goals.map(goal => (goal.id === updatedGoal.id ? updatedGoal : goal)),
    )
    setUpdateCount(updateCount + 1)
  }

  return (
    <div data-testid="goals-section-extended" className="min-w-full w-full flex flex-wrap gap-5">
      <div
        onClick={handleAddClick}
        className="transition-all duration-300 ease-in-out transform hover:scale-105 container flex flex-col items-center justify-center gap-6 border border-solid border-primaryOrange rounded-lg p-5 w-full md:w-[19vw] h-[28vh] cursor-pointer shadow-sm"
      >
        <MdAdd size={42} className="text-primaryOrange" />

        <h3 className="text-primaryOrange text-xl font-semibold">
          Adicionar Meta
        </h3>
      </div>

      {goals.map(goal => (
        <div key={goal.id} className="w-full md:w-[19vw]">
          <GoalCard
            goal={goal}
            onDelete={() => handleDelete(goal.id)}
            onEdit={() => handleEdit(goal)}
          />
        </div>
      ))}

      {goals.length === 0 && (
        <div className="transition-all duration-300 ease-in-out transform hover:scale-105 container flex items-center justify-center gap-6 border border-solid border-primaryOrange rounded-lg p-5 w-full md:w-[19vw] h-[28vh]">
          <h3 className="text-constrastBlack text-lg font-semibold">
            Parece que você não tem metas ainda... 😔
          </h3>
        </div>
      )}

      {isInsertModalOpen && (
        <InsertGoalModal
          isOpen={isInsertModalOpen}
          onClose={() => setIsInsertModalOpen(false)}
          onGoalAdded={newGoal => setGoals([...goals, newGoal])}
        />
      )}
    </div>
  )
}

export default GoalsSectionExtended
