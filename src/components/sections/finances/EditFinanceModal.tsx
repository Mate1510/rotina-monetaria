'use client'

import React, { useState, useEffect } from 'react'
import { Finance } from '@/finance'
import Input from '@/components/components/Input'
import CurrencyInput from '@/components/components/CurrencyInput'
import Select from '@/components/components/Select'
import DatePicker from '@/components/components/DatePicker'
import Button from '@/components/components/Button'
import { Category } from '@/categories'
import { TransactionType } from '@/enum'
import ModalComponent from '@/components/sections/Modal'
import { FinanceDataInputs } from './InsertFinances'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

type Props = {
  isOpen: boolean
  onClose: () => void
  finance: Finance
  onSave: (updatedFinance: Finance) => void
  categories: Category[]
}

const EditFinanceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  finance,
  onSave,
  categories,
}) => {
  const [updatedFinance, setUpdatedFinance] = useState<Finance>(finance)
  const [errors, setErrors] = useState<Partial<FinanceDataInputs>>({})
  const [loading, setLoading] = useState(false)

  const validateInputs = (): boolean => {
    const newErrors: Partial<FinanceDataInputs> = {}

    if (!updatedFinance.name.trim())
      newErrors.name = 'É necessário inserir um nome para a finança.'
    if (!updatedFinance.value)
      newErrors.value = 'É necessário inserir um valor.'
    if (!updatedFinance.categoryId)
      newErrors.categoryId = 'É necessário selecionar uma categoria.'
    if (!updatedFinance.date) newErrors.date = 'É necessário inserir uma data.'
    if (!updatedFinance.type)
      newErrors.type = 'É necessário selecionar um tipo de transação.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    setUpdatedFinance(finance)
  }, [finance])

  const handleSave = () => {
    if (!validateInputs()) return
    setLoading(true)
    onSave(updatedFinance)
    setLoading(false)
    onClose()
  }

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Editar Finança"
      actionButton={
        <Button
          className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg flex gap-3 items-center"
          onClick={handleSave}
          disabled={loading}
        >
          {loading && (
            <AiOutlineLoading3Quarters
              size={20}
              className="text-white font-bold animate-spin"
            />
          )}
          {loading ? 'Carregando...' : 'Salvar'}
        </Button>
      }
    >
      <div className="flex flex-col gap-3 w-full">
        <Input
          placeholder="Nome"
          className="w-full"
          value={updatedFinance.name}
          onChange={e =>
            setUpdatedFinance({
              ...updatedFinance,
              name: e.target.value,
            })
          }
          error={!!errors.name}
          errorMessage={errors.name}
        />

        <div className="grid grid-cols-5 gap-3 w-full">
          <div className="col-span-2">
            <CurrencyInput
              placeholder="R$"
              className="w-full"
              value={updatedFinance.value.toString()}
              onValueChange={val =>
                setUpdatedFinance({
                  ...updatedFinance,
                  value: parseFloat(val || '0'),
                })
              }
              error={!!errors.value}
              errorMessage={errors.value}
            />
          </div>

          <div className="col-span-3">
            <Select
              placeholder="Categorias"
              className="w-full"
              value={updatedFinance.categoryId}
              onChange={e =>
                setUpdatedFinance({
                  ...updatedFinance,
                  categoryId: e.target.value,
                })
              }
              error={!!errors.categoryId}
              errorMessage={errors.categoryId}
            >
              {categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-7">
            <DatePicker
              className="w-full"
              selected={new Date(updatedFinance.date)}
              onChange={date =>
                setUpdatedFinance({
                  ...updatedFinance,
                  date: date as Date,
                })
              }
              placeholderText="Data"
              error={!!errors.date}
              errorMessage={
                errors.date ? 'É necessário inserir a data.' : undefined
              }
            />
          </div>

          <div className="col-span-5">
            <Select
              placeholder="Tipo Transação"
              className="w-full"
              value={updatedFinance.type}
              onChange={e =>
                setUpdatedFinance({
                  ...updatedFinance,
                  type: e.target.value as TransactionType,
                })
              }
              error={!!errors.type}
              errorMessage={errors.type}
            >
              <option value="INCOME">Receita</option>
              <option value="EXPENSE">Despesa</option>
            </Select>
          </div>
        </div>
      </div>
    </ModalComponent>
  )
}

export default EditFinanceModal
