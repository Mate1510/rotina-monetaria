'use client'

import React, { useEffect, useState } from 'react'
import useFetchGoals from '@/data/useFetchGoals'
import GoalCard from '@/components/sections/goals/GoalCard'
import InsertGoalModal from '../goals/InsertGoalModal'
import { useSession } from 'next-auth/react'
import { Goal } from '@/goal'
import Link from 'next/link'

const GoalsSection = () => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false)

  const { data: session } = useSession()
  const { data: goalsData } = useFetchGoals()

  useEffect(() => {
    if (!session) {
      //Tratamento de Erros
      return
    }

    if (Array.isArray(goalsData)) {
      setGoals(goalsData.slice(0, 2))
    }
  }, [session, goalsData])

  const handleAddClick = () => {
    setIsInsertModalOpen(true)
  }

  return (
    <div className="bg-white w-full flex flex-col gap-10 mb-5 p-10">
      <Link
        href="/goals"
        className="flex self-center text-constrastBlack font-semibold text-2xl md:text-3xl hover:underline"
      >
        Suas Metas
      </Link>

      <div className="columns-2">
        {goals.map(goal => (
          <div key={goal.id} className="w-full md:w-[15vw] self-center">
            <GoalCard goal={goal} onDelete={() => null} onEdit={() => null} />
          </div>
        ))}
      </div>

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

export default GoalsSection
