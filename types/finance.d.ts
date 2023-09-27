import { TransactionType } from '@/enum'
import { Decimal } from 'prisma'

type Finance = {
  id: string
  name: string
  value: Decimal
  type: TransactionType
  date: Date
  categoryId: string
  goalId?: string | null
  userId: string
}
type FinanceInput = Omit<Finance, 'id'>
