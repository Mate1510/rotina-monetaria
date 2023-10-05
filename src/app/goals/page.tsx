import GoalsSection from '@/components/sections/goals/GoalSectionExtended'
import React from 'react'

const GoalsPage = () => {
  return (
    <div className="container flex min-h-screen flex-col items-center p-5 gap-12 lg:max-w-screen-xl lg:mx-auto">
      <GoalsSection />
    </div>
  )
}

export default GoalsPage
