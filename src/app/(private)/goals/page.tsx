import GoalsSectionExtended from '@/components/sections/goals/GoalSectionExtended'
import { GoalProvider } from '@/contexts/GoalContext'
import React from 'react'

const GoalsPage = () => {
  return (
    <div className="container flex min-h-screen flex-col items-center p-5 gap-12 lg:max-w-screen-xl lg:mx-auto">
      <GoalProvider>
        <GoalsSectionExtended />
      </GoalProvider>
    </div>
  )
}

export default GoalsPage
