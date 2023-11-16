import { render, screen } from '@testing-library/react'
import GoalsPage from '@/app/(private)/goals/page'
import { GoalProvider } from '@/contexts/GoalContext'

jest.mock('@/components/sections/goals/GoalSectionExtended', () => {
  return function MockedGoalsSectionExtended() {
    return <div data-testid="goals-section-extended"></div>
  }
})

jest.mock('@/contexts/GoalContext', () => {
  const mockGoalProvider = ({ children }: { children: any }) => {
    return <div>{children}</div>
  }
  return {
    __esModule: true,
    GoalProvider: mockGoalProvider,
  }
})

describe('GoalsPage', () => {
  it('Should render GoalsSectionExtended component', () => {
    render(
      <GoalProvider>
        <GoalsPage />
      </GoalProvider>,
    )

    const goalsSectionExtendedComponent = screen.getByTestId(
      'goals-section-extended',
    )
    expect(goalsSectionExtendedComponent).toBeInTheDocument()
  })
})
