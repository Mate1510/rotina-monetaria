import React, { useState } from 'react'
import Button from '@/components/components/Button'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import ModalComponent from '../Modal'
import CurrencyInput from '@/components/components/CurrencyInput'

type Props = {
  isOpen: boolean
  onClose: () => void
  goalId: string
  goalName: string
  goalCurrentValue: string
}

const ContributionGoalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  goalId,
  goalName,
  goalCurrentValue
}) => {
  const [contributionValue, setContributionValue] = useState<string>('')
  const { data: session } = useSession()

  const handleSubmit = async () => {
    if (!session) {
      return
    }

    try {
      const userId = session?.user?.userId
      const categoryResponse = await axios.get(
        `/api/categories/goal-category?userid=${userId}`,
      )
      const { categoryId } = categoryResponse.data

      if (!categoryId) {
        // Tratamento de Erros
        return
      }

      const finance = {
        name: goalName + ' - Aporte',
        value: parseFloat(contributionValue),
        type: 'EXPENSE',
        userId: userId,
        date: new Date(),
        categoryId: categoryId,
        goalId: goalId,
      }

      await axios.post(`/api/finances/`, finance)

      const updatedGoalValue =
        parseFloat(goalCurrentValue) + parseFloat(contributionValue)

      await axios.put(`/api/goals/${goalId}`, {
        currentGoalValue: updatedGoalValue,
      })

      onClose()
    } catch (error) {}
  }

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Adicionar Aporte"
      actionButton={
        <Button
          className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg"
          onClick={handleSubmit}
        >
          Adicionar
        </Button>
      }
    >
      <div className="flex flex-col gap-3 w-full">
        <CurrencyInput
          placeholder="Valor do Aporte R$"
          className="w-full"
          value={contributionValue}
          onValueChange={value => value && setContributionValue(value)}
        />
      </div>
    </ModalComponent>
  )
}

export default ContributionGoalModal
