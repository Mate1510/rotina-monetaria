import { Color, TransactionType } from '@enum'

type Category = {
  id: string
  name: string
  color: Color
  transactionType: TransactionType
  userId: string
}
type CategoryInput = Omit<Category, 'id'>
