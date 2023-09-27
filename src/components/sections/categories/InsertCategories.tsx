'use client'

import React, { useState } from 'react'
import Input from '@/components/components/Input'
import { CirclePicker } from 'react-color'
import Button from '@/components/components/Button'
import Select from '@/components/components/Select'
import { Color } from '@/enum'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const InsertCategories = () => {
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState(Color.ORANGE)
  const [colorName, setColorName] = useState('ORANGE')

  const { data: session } = useSession()

  const handleSubmit = async () => {
    if (!session) {
      console.error('User not authenticated.')
      return
    }

    try {
      const userId = session?.user?.userId

      const response = await axios.post(`/api/categories/`, {
        name: name,
        color: colorName,
        transactionType: type,
        userId: userId,
      })
      const data = response.data

      if (data.error) {
        console.error(data.error)
      } else {
        console.log('Category created:', data)
      }
    } catch (error) {
      console.error('Failed to add category')
    }
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

  return (
    <div className="container flex flex-col bg-constrastGray p-8 rounded-xl gap-5 shadow-sm lg:w-3/5">
      <h3 className="text-center text-constrastBlack font-semibold text-lg">
        Crie sua própria Categoria:
      </h3>

      <div className="flex flex-col gap-3">
        <Input
          placeholder="Nome da Categoria"
          className="w-full"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-7 flex flex-col gap-3">
            <Button
              className="bg-white text-textGray w-full flex items-center gap-3 hover:bg-textGray hover:text-white"
              onClick={() => setShowColorPicker(!showColorPicker)}
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
              onChange={e => setType(e.target.value)}
            >
              <option value="INCOME">Receita</option>
              <option value="EXPENSE">Despesa</option>
            </Select>
          </div>
        </div>

        <Button className="w-full self-center mt-3" onClick={handleSubmit}>
          Adicionar
        </Button>
      </div>
    </div>
  )
}

export default InsertCategories
