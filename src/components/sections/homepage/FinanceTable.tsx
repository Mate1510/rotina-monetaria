'use client'

import React, { useEffect, useState, useMemo, useContext } from 'react'
import { useSession } from 'next-auth/react'
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from 'react-icons/md'
import CardSection from './CardSection'
import { FinanceContext } from '@/contexts/FinanceContext'
import styles from '@/app/style/LittleSpinner.module.css'
import { toast } from 'react-toastify'
import Link from 'next/link'

const FinanceTable = () => {
  const [localMonth, setLocalMonth] = useState(new Date().getMonth() + 1)

  const localYear = new Date().getFullYear()
  const { data: session } = useSession()
  const { finances, setMonth, setYear, loading, error } =
    useContext(FinanceContext)

  setYear(localYear)

  const monthNames = useMemo(
    () => [
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
    ],
    [],
  )

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    [],
  )

  const prevMonth = () => {
    setLocalMonth(prev => (prev === 1 ? 12 : prev - 1))
  }

  const nextMonth = () => {
    setLocalMonth(prev => (prev === 12 ? 1 : prev + 1))
  }

  useEffect(() => {
    setMonth(localMonth)

    if (error) {
      toast.error(error)
    }
  }, [error, localMonth, setMonth])

  return (
    <div data-testid="finance-table-homepage" className="min-w-full w-full">
      <CardSection
        month={localMonth}
        year={localYear}
        userid={session?.user?.userId}
      />

      <div className="flex items-center justify-center mb-3">
        <MdOutlineNavigateBefore
          onClick={prevMonth}
          className="text-primaryOrange cursor-pointer transform transition-transform duration-300 hover:scale-125"
          size={38}
        />
        <Link href={'/finances'} className="text-primaryOrange font-semibold text-2xl transform transition-transform duration-300 hover:scale-x-110 hover:mx-0.5">
          {`${monthNames[localMonth - 1]}`}
        </Link>
        <MdOutlineNavigateNext
          onClick={nextMonth}
          className="text-primaryOrange cursor-pointer transform transition-transform duration-300 hover:scale-125"
          size={38}
        />
      </div>

      <div className="min-w-full overflow-x-auto rounded-2xl bg-primaryOrange p-0.5 no-scrollbar">
        <table className="min-w-full bg-white overflow-hidden rounded-2xl">
          <thead className="bg-primaryOrange rounded-t-lg">
            <tr>
              <th className="py-2 px-4 border-b text-white font-medium text-lg text-center w-60">
                Nome
              </th>
              <th className="py-2 px-4 border-b text-white font-medium text-lg text-center w-60">
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={2}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  <div className="flex gap-3 items-center justify-center">
                    <div className={styles.spinner}></div>
                    Carregando suas finanças... ⌛
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={2}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  <div className="flex gap-3 items-center justify-center">
                    Tivemos um pequeno erro, recarregue a página 😢
                  </div>
                </td>
              </tr>
            ) : finances.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  Suas finanças não chegaram aqui ainda...
                </td>
              </tr>
            ) : (
              finances.map((finance, index) => (
                <tr
                  key={finance.id}
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="py-2 px-4 border-b border-primaryOrange text-constrastBlack font-medium text-center">
                    <div className="truncate w-60 mx-auto">{finance.name}</div>
                  </td>
                  <td
                    className={`py-2 px-4 border-b border-primaryOrange font-medium text-center ${
                      finance.type === 'INCOME'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {currencyFormatter.format(parseFloat(finance.value.toString()))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FinanceTable
