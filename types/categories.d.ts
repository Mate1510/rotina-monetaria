import { Color, TransactionType } from '@enum'

type Category = {
  id: string
  name: string
  color: Color
  transactionType: TransactionType
  userId: string
  isHidden: boolean
}
type CategoryInput = Omit<Category, 'id'>
