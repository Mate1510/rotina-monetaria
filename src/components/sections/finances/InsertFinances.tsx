'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Input from '@/components/components/Input'
import CurrencyInput from '@/components/components/CurrencyInput'
import Select from '@/components/components/Select'
import DatePicker from '@/components/components/DatePicker'
import Button from '@/components/components/Button'
import axios from 'axios'
import useFetchCategories from '@/data/useFetchCategories'
import { toast } from 'react-toastify'
import { FinanceContext } from '@/contexts/FinanceContext';

interface FinanceData {
  name: string
  value: string
  categoryId: string
  date: Date | null | string
  type: string
}

const Finances = () => {
  const [financeData, setFinanceData] = useState<FinanceData>({
    name: '',
    value: '',
    categoryId: '',
    date: null,
    type: '',
  })
  const [errors, setErrors] = useState<Partial<FinanceData>>({})
  const [loading, setLoading] = useState(false)
  const { addFinance } = useContext(FinanceContext);

  const { data: session } = useSession()
  const { data: categories } = useFetchCategories()

  const handleChange = (field: keyof FinanceData, value: any) => {
    setFinanceData(prev => ({ ...prev, [field]: value }))
  }

  const validateInputs = (): boolean => {
    const newErrors: Partial<FinanceData> = {}

    if (!financeData.name.trim())
      newErrors.name = 'É necessário inserir um título para a finança.'
    if (!financeData.value) newErrors.value = 'É necessário inserir um valor.'
    if (!financeData.categoryId)
      newErrors.categoryId = 'É necessário selecionar uma categoria.'
    if (!financeData.date) newErrors.date = 'É necessário inserir uma data.'
    if (!financeData.type)
      newErrors.type = 'É necessário selecionar um tipo de transação.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!session) return
    if (!validateInputs()) return

    setLoading(true)

    try {
      const userId = session?.user?.userId
      const response = await axios.post(`/api/finances/`, {
        ...financeData,
        userId: userId,
      })

      setFinanceData({
        name: '',
        value: '',
        categoryId: '',
        date: null,
        type: '',
      })

      if (response.status === 200) {
        addFinance(response.data);
        toast.success('Finança adicionada com sucesso!')
      } else {
        toast.error(response.data.error || response.data.message)
      }
    } catch (error) {
      toast.error('Erro ao adicionar finança!')
    }

    setLoading(false)
  }

  return (
    <div
      data-testid="insert-finances"
      className="container flex flex-col bg-constrastGray p-8 rounded-xl gap-5 shadow-sm"
    >
      <h3 className="text-center text-constrastBlack font-semibold text-2xl">
        Insira suas finanças:
      </h3>
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Título"
          className="w-full"
          value={financeData.name}
          onChange={e => handleChange('name', e.target.value)}
          error={!!errors.name}
          errorMessage={errors.name}
        />
        <div className="grid grid-cols-5 gap-3 w-full">
          <div className="col-span-2">
            <CurrencyInput
              placeholder="R$"
              className="w-full"
              value={financeData.value}
              onValueChange={val => handleChange('value', val || '')}
              error={!!errors.value}
              errorMessage={errors.value}
            />
          </div>
          <div className="col-span-3">
            <Select
              title="Categorias"
              placeholder="Categorias"
              className="w-full"
              value={financeData.categoryId}
              onChange={e => handleChange('categoryId', e.target.value)}
              error={!!errors.categoryId}
              errorMessage={errors.categoryId}
            >
              {categories?.map(category => (
                <option key={category.id} value={category.id}>
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
              selected={financeData.date ? new Date(financeData.date) : null}
              onChange={date => handleChange('date', date)}
              placeholderText="Data"
              error={!!errors.date}
              errorMessage={
                errors.date ? 'É necessário inserir a data.' : undefined
              }
            />
          </div>
          <div className="col-span-5">
            <Select
              title="Tipo Transação"
              placeholder="Tipo Transação"
              className="w-full"
              value={financeData.type}
              onChange={e => handleChange('type', e.target.value)}
              error={!!errors.type}
              errorMessage={errors.type}
            >
              <option value="INCOME">Receita</option>
              <option value="EXPENSE">Despesa</option>
            </Select>
          </div>
        </div>
        <Button
          className="w-11/12 self-center mt-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Adicionar'}
        </Button>
      </div>
    </div>
  )
}

export default Finances
