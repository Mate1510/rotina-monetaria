'use client'

import React, { useEffect, useState } from 'react'
import ModalComponent from '../Modal'
import Button from '@/components/components/Button'
import Input from '@/components/components/Input'
import { CirclePicker } from 'react-color'
import { Color } from '@/enum'
import { Goal } from '@/goal'
import CurrencyInput from '@/components/components/CurrencyInput'
import DatePicker from '@/components/components/DatePicker'

type Props = {
  isOpen: boolean
  onClose: () => void
  goal: Goal
  onSave: (updatedGoal: Goal) => void
}

const EditGoalModal: React.FC<Props> = ({ isOpen, onClose, goal, onSave }) => {
  const [updatedGoal, setUpdatedGoal] = useState<Goal>(goal)
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    setUpdatedGoal(goal)
  }, [goal])

  const handleSave = () => {
    onSave(updatedGoal)
    onClose()
  }

  const getColorName = (hexCode: string): string => {
    const colorName = Object.keys(Color).find(
      color => Color[color as keyof typeof Color] === hexCode,
    )
    return colorName ?? ''
  }

  const handleColorChange = (color: any) => {
    setUpdatedGoal({ ...updatedGoal, color: getColorName(color.hex) })
    setShowColorPicker(false)
  }

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Editar Meta"
      actionButton={
        <Button
          className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg"
          onClick={handleSave}
        >
          Salvar
        </Button>
      }
    >
      <div className="flex flex-col gap-3 w-full">
        <Input
          placeholder="Nome da Meta"
          className="w-full"
          value={updatedGoal.name}
          onChange={e =>
            setUpdatedGoal({ ...updatedGoal, name: e.target.value })
          }
        />

        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-6">
            <CurrencyInput
              placeholder="Valor Inicial R$"
              className="w-full"
              value={updatedGoal.currentGoalValue}
              onValueChange={value =>
                setUpdatedGoal({
                  ...updatedGoal,
                  currentGoalValue: value,
                })
              }
            />
          </div>

          <div className="col-span-6">
            <CurrencyInput
              placeholder="Valor Final R$"
              className="w-full"
              value={updatedGoal.finalGoalValue}
              onValueChange={value =>
                setUpdatedGoal({
                  ...updatedGoal,
                  finalGoalValue: value,
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-7">
            <DatePicker
              className="w-full"
              selected={
                updatedGoal.finalGoalDate
                  ? new Date(updatedGoal.finalGoalDate)
                  : null
              }
              onChange={date =>
                setUpdatedGoal({
                  ...updatedGoal,
                  finalGoalDate: date ? date : updatedGoal.finalGoalDate,
                })
              }
              placeholderText="Data Final"
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
                  backgroundColor:
                    Color[updatedGoal.color as keyof typeof Color],
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

export default EditGoalModal
