import { render, screen } from '@testing-library/react';
import GoalsPage from '@/app/goals/page';

jest.mock('@/components/sections/goals/GoalSectionExtended', () => {
  return function MockedGoalsSectionExtended() {
    return <div data-testid="goals-section-extended"></div>;
  };
});

describe('GoalsPage', () => {
  it('Should render GoalsSectionExtended component', () => {
    render(<GoalsPage />);

    const goalsSectionExtendedComponent = screen.getByTestId('goals-section-extended');
    expect(goalsSectionExtendedComponent).toBeInTheDocument();
  });
});
