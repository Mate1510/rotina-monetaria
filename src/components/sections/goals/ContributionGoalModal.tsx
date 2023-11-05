import React, { useState } from 'react'
import Button from '@/components/components/Button'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import ModalComponent from '../Modal'
import CurrencyInput from '@/components/components/CurrencyInput'
import { toast } from 'react-toastify'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

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
  goalCurrentValue,
}) => {
  const [contributionValue, setContributionValue] = useState<string>('')
  const { data: session } = useSession()
  const [errors, setErrors] = useState({
    contributionValue: '',
  })
  const [loading, setLoading] = useState(false)

  const validateInputs = (): boolean => {
    let isValid = true

    const newErrors = {
      contributionValue: '',
    }

    if (
      !contributionValue ||
      parseFloat(contributionValue) <= 0 ||
      parseFloat(contributionValue) > 1000000
    ) {
      newErrors.contributionValue =
        'Valor atual da meta é obrigatório, deve ser maior que zero e menor que R$1.000.000,00.'
      setErrors(newErrors)
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateInputs()) return
    if (!session) return

    setLoading(true)

    try {
      const userId = session?.user?.userId
      const categoryResponse = await axios.get(
        `/api/categories/goal-category?userid=${userId}`,
      )
      const { categoryId } = categoryResponse.data

      if (!categoryId) {
        toast.error('Erro ao criar a meta!')
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

      toast.success('Aporte de meta criado com sucesso!')

      const updatedGoalValue =
        parseFloat(goalCurrentValue) + parseFloat(contributionValue)

      await axios.put(`/api/goals/${goalId}`, {
        currentGoalValue: updatedGoalValue,
      })
    } catch (error) {
      toast.error('Erro ao criar a meta!')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Adicionar Aporte"
      actionButton={
        <Button
          className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg flex gap-3 items-center"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading && (
            <AiOutlineLoading3Quarters
              size={20}
              className="text-white font-bold animate-spin"
            />
          )}
          {loading ? 'Carregando...' : 'Adicionar'}
        </Button>
      }
    >
      <div className="flex flex-col gap-3 w-full">
        <CurrencyInput
          placeholder="Valor do Aporte R$"
          className="w-full"
          value={contributionValue}
          onValueChange={value => value && setContributionValue(value)}
          error={!!errors.contributionValue}
          errorMessage={errors.contributionValue}
        />
      </div>
    </ModalComponent>
  )
}

export default ContributionGoalModal
