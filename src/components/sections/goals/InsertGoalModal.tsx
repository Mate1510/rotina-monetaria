import React, { useState } from 'react'
import Input from '@/components/components/Input'
import { CirclePicker } from 'react-color'
import Button from '@/components/components/Button'
import { Color } from '@/enum'
import { useSession } from 'next-auth/react'
import ModalComponent from '../Modal'
import { Goal, GoalInput } from '@/goal'
import CurrencyInput from '@/components/components/CurrencyInput'
import DatePicker from '@/components/components/DatePicker'
import { toast } from 'react-toastify'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useGoals } from '@/contexts/GoalContext'

type Props = {
  isOpen: boolean
  onClose: () => void
  onGoalAdded: (newGoal: Goal) => void
}

const InsertGoalModal: React.FC<Props> = ({ isOpen, onClose, onGoalAdded }) => {
  const [data, setData] = useState<GoalInput>({
    name: '',
    color: 'ORANGE',
    currentGoalValue: '',
    finalGoalValue: '',
    finalGoalDate: '',
    userId: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    currentGoalValue: '',
    finalGoalValue: '',
    finalGoalDate: '',
  })
  const [showColorPicker, setShowColorPicker] = useState(false)

  const { data: session } = useSession()
  const { createGoal, loading } = useGoals()

  const validateInputs = (): boolean => {
    let isValid = true

    const newErrors = {
      name: '',
      currentGoalValue: '',
      finalGoalValue: '',
      finalGoalDate: '',
    }

    if (!data.name.trim()) {
      isValid = false
      newErrors.name = 'Nome da meta é obrigatório.'
    }

    if (
      !data.currentGoalValue ||
      parseFloat(data.currentGoalValue) <= 0 ||
      parseFloat(data.currentGoalValue) > 1000000
    ) {
      isValid = false
      newErrors.currentGoalValue =
        'Valor atual da meta é obrigatório, deve ser maior que zero e menor que R$1.000.000,00.'
    }

    if (!data.finalGoalValue || parseFloat(data.finalGoalValue) <= 0) {
      isValid = false
      newErrors.finalGoalValue =
        'Valor final da meta é obrigatório e deve ser maior que zero.'
    }

    if (!data.finalGoalDate) {
      isValid = false
      newErrors.finalGoalDate = 'Data final da meta é obrigatória.'
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validateInputs()) return
    if (!session) return

    try {
      const newGoalData = {
        ...data,
        userId: session.user.userId,
        currentGoalValue: parseFloat(data.currentGoalValue || '0'),
        finalGoalValue: parseFloat(data.finalGoalValue || '0'),
      }

      createGoal(newGoalData)
      onClose()
    } catch (error) {
      toast.error('Erro ao criar a meta!')
    }
  }

  const getColorName = (hexCode: string): string => {
    const colorName = Object.keys(Color).find(
      color => Color[color as keyof typeof Color] === hexCode,
    )
    return colorName ?? ''
  }

  const handleColorChange = (color: any) => {
    setData({ ...data, color: getColorName(color.hex) })
    setShowColorPicker(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData(prevData => ({ ...prevData, [name]: value }))
  }

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Adicionar Meta"
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
        <Input
          placeholder="Nome da Meta"
          className="w-full"
          name="name"
          value={data.name}
          onChange={handleChange}
          error={!!errors.name}
          errorMessage={errors.name}
        />

        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-6">
            <CurrencyInput
              placeholder="Valor Inicial R$"
              className="w-full"
              name="initialGoalValue"
              value={data.currentGoalValue}
              onValueChange={value =>
                setData(prevData => ({
                  ...prevData,
                  currentGoalValue: value,
                }))
              }
              error={!!errors.currentGoalValue}
              errorMessage={errors.currentGoalValue}
            />
          </div>

          <div className="col-span-6">
            <CurrencyInput
              placeholder="Valor Final R$"
              className="w-full"
              name="finalGoalValue"
              value={data.finalGoalValue}
              onValueChange={value =>
                setData(prevData => ({
                  ...prevData,
                  finalGoalValue: value,
                }))
              }
              error={!!errors.finalGoalValue}
              errorMessage={errors.finalGoalValue}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-7">
            <DatePicker
              className="w-full"
              selected={data.finalGoalDate ? new Date(data.finalGoalDate) : ''}
              onChange={date =>
                setData(prevData => ({
                  ...prevData,
                  finalGoalDate: date as Date,
                }))
              }
              placeholderText="Data Final"
              error={!!errors.finalGoalDate}
              errorMessage={errors.finalGoalDate}
            />
          </div>

          <div className="col-span-5 flex flex-col gap-3">
            <Button
              className="bg-white text-textGray w-full flex items-center gap-3 hover:bg-textGray hover:text-white"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <span
                className="w-8 h-8 rounded-full ml-3 border border-textGray"
                style={{
                  backgroundColor: Color[data.color as keyof typeof Color],
                }}
              ></span>
              Selecione sua Cor
            </Button>

            {showColorPicker && (
              <div className="w-full mx-auto p-3 bg-white border border-primaryOrange rounded-lg">
                <CirclePicker
                  colors={Object.values(Color)}
                  onChange={handleColorChange}
                  circleSize={25}
                  circleSpacing={6}
                  className="mx-auto max-w-fit circle-picker"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalComponent>
  )
}

export default InsertGoalModal
