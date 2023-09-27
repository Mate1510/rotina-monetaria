import { Color } from '@enum'
import { Decimal } from 'prisma'

type Goal = {
  id: string
  name: string
  finalGoalValue: Decimal
  currentGoalValue: Decimal
  finalGoalDate: Date | string
  color: Color
  userId: string
}
type GoalInput = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>
type EditableGoal = Omit<GoalInput, 'userId'>

export { Goal, GoalInput, EditableGoal }
