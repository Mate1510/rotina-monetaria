'use client'

import React, { useState, useContext, useEffect } from 'react'
import Input from '@/components/components/Input'
import { CirclePicker } from 'react-color'
import Button from '@/components/components/Button'
import Select from '@/components/components/Select'
import { Color } from '@/enum'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CategoriesContext } from '@/contexts/CategoriesContext'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const InsertCategories = () => {
  const { createCategory, loading, error } = useContext(CategoriesContext)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState(Color.ORANGE)
  const [colorName, setColorName] = useState('ORANGE')
  const [formErrors, setFormErrors] = useState({ name: '', type: '' })

  const validateInputs = () => {
    const errors = { name: '', type: '' }
    let formIsValid = true

    if (!name) {
      formIsValid = false
      errors.name = 'Nome é obrigatório.'
    }

    if (!type) {
      formIsValid = false
      errors.type = 'Tipo é obrigatório.'
    }

    setFormErrors(errors)
    return formIsValid
  }

  const handleSubmit = async () => {
    if (!validateInputs()) return

    await createCategory({
      name,
      color: getColorName(selectedColor),
      transactionType: type,
    })

    setName('')
    setType('')
    setColorName(Color.ORANGE)
    setSelectedColor(Color.ORANGE)
  }

  const getColorName = (hexCode: string): string => {
    const colorName = Object.keys(Color).find(
      color => Color[color as keyof typeof Color] === hexCode,
    )
    return colorName ?? ''
  }

  const handleColorChange = (color: any) => {
    setSelectedColor(color.hex)
    setColorName(getColorName(color.hex))
    setShowColorPicker(false)
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <div
      data-testid="insert-categories"
      className="container flex flex-col bg-constrastGray p-8 rounded-xl gap-5 shadow-sm lg:w-3/5"
    >
      <h3 className="text-center text-constrastBlack font-semibold text-2xl">
        Crie sua própria Categoria:
      </h3>

      <div className="flex flex-col gap-3">
        <Input
          placeholder="Nome da Categoria"
          className="w-full"
          value={name}
          onChange={e => {
            setName(e.target.value)
            setFormErrors(errors => ({ ...errors, name: '' }))
          }}
          error={!!formErrors.name}
          errorMessage={formErrors.name}
        />

        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-7 flex flex-col gap-3">
            <Button
              className="bg-white text-textGray w-full flex items-center gap-3 hover:bg-textGray hover:text-white"
              onClick={() => setShowColorPicker(!showColorPicker)}
              disabled={loading}
            >
              <span
                className="w-8 h-8 rounded-full ml-3 border border-textGray"
                style={{ backgroundColor: selectedColor }}
              ></span>
              Selecione sua Cor
            </Button>

            {showColorPicker && (
              <div className="w-full mx-auto p-3 bg-white border border-primaryOrange rounded-lg">
                <CirclePicker
                  colors={Object.values(Color)}
                  onChange={handleColorChange}
                  circleSize={26}
                  circleSpacing={7}
                  className="mx-auto max-w-fit circle-picker"
                />
              </div>
            )}
          </div>

          <div className="col-span-5">
            <Select
              placeholder="Tipo Transação"
              className="w-full"
              value={type}
              onChange={e => {
                setType(e.target.value)
                setFormErrors(errors => ({ ...errors, type: '' }))
              }}
              error={!!formErrors.type}
              errorMessage={formErrors.type}
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
          {loading && (
            <AiOutlineLoading3Quarters
              size={20}
              className="text-white font-bold animate-spin"
            />
          )}
          {loading ? 'Carregando...' : 'Adicionar'}
        </Button>
      </div>
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  )
}

export default InsertCategories
