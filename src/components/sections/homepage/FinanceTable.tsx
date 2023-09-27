'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { TransactionType } from '@/enum'
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from 'react-icons/md'
import useFetchFinances from '@/data/useFetchFinances'
import { Finance } from '@/finance'

const FinanceTable = () => {
  const [finances, setFinances] = useState<Finance[]>([])
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const { data: dataFinances } = useFetchFinances(month, year)

  const { data: session } = useSession()

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  useEffect(() => {
    if (!session) {
      console.error('User not authenticated.')
      return
    }

    if (Array.isArray(dataFinances)) {
      setFinances(dataFinances)
    }
  }, [session, month, year, dataFinances])

  const handlePrevMonth = () => {
    setMonth(prevMonth => (prevMonth === 1 ? 12 : prevMonth - 1))
    setYear(prevYear => (month === 1 ? prevYear - 1 : prevYear))
  }

  const handleNextMonth = () => {
    setMonth(prevMonth => (prevMonth === 12 ? 1 : prevMonth + 1))
    setYear(prevYear => (month === 12 ? prevYear + 1 : prevYear))
  }

  return (
    <div className="min-w-full">
      <div className="flex items-center justify-center mb-3">
        <MdOutlineNavigateBefore
          onClick={handlePrevMonth}
          className="text-primaryOrange cursor-pointer"
          size={38}
        />
        <h3 className="text-primaryOrange font-semibold text-2xl">{`${
          monthNames[month - 1]
        }`}</h3>
        <MdOutlineNavigateNext
          onClick={handleNextMonth}
          className="text-primaryOrange cursor-pointer"
          size={38}
        />
      </div>

      <div className="min-w-full rounded-2xl bg-primaryOrange p-0.5">
        <table className="min-w-full bg-white overflow-hidden rounded-2xl">
          <thead className="bg-primaryOrange rounded-t-lg">
            <tr>
              <th className="py-2 px-4 border-b text-white font-medium text-lg text-center">
                Name
              </th>
              <th className="py-2 px-4 border-b text-white font-medium text-lg text-center">
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {finances.map((finance, index) => (
              <tr
                key={finance.id}
                className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
              >
                <td className="py-2 px-4 border-b border-primaryOrange text-constrastBlack font-medium text-center">
                  {finance.name}
                </td>
                <td
                  className={`py-2 px-4 border-b border-primaryOrange font-medium text-center ${
                    finance.type === 'INCOME'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(finance.value)}
                </td>
              </tr>
            ))}
            {finances.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  Suas finanças não chegaram aqui ainda...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FinanceTable
