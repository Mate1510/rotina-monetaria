import { TransactionType } from '@/enum'

type Finance = {
  id: string
  name: string
  value: number
  type: TransactionType
  date: Date
  categoryId: string
  goalId?: string | null
  userId: string
}
type FinanceInput = Omit<Finance, 'id'>
