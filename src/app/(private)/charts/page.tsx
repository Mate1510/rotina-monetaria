'use client'

import React, { useState } from 'react'
import RoundedCharts from '@/components/sections/charts/RoundedCharts'
import YearSelector from '@/components/sections/YearSelector'
import BarChart from '@/components/sections/charts/BarChart'
import { TransactionType } from '@/enum'
import LineChart from '@/components/sections/charts/LineChart'

const ChartsPage = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  )
  const [hasYears, setHasYears] = useState(true)

  const handleYearsFetched = (years: number[] | null) => {
    setHasYears(years !== null && years.length > 0)
  }

  if (!hasYears) {
    return (
      <div className="w-11/12 md:4/5 flex min-h-[62vh] flex-col items-center justify-center lg:max-w-screen-xl mx-auto">
        <h1 className="text-primaryOrange font-semibold text-2xl md:text-4xl mb-16 text-center">
          Você não possui Estatísticas =(
        </h1>
        <div className="w-3/4 border border-primaryOrange rounded-lg flex flex-col items-center justify-center p-5">
          <h2 className="text-primaryOrange text-lg md:text-2xl text-center font-semibold mb-5">
            Sentimos muito, mas você ainda não possui nenhuma estatística.
          </h2>
          <h2 className="text-primaryOrange text-lg md:text-2xl text-center font-semibold">
            Precisamos que você tenha pelo menos uma finança adicionada em nosso
            sistema para gerar suas estatísticas.
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex flex-col items-center p-5 gap-12 lg:max-w-screen-xl lg:mx-auto">
      <h1 className="text-primaryOrange font-semibold text-4xl">
        Suas Estatísticas
      </h1>

      <YearSelector
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        onYearsFetched={handleYearsFetched}
      />

      <div className="flex flex-wrap gap-12">
        <RoundedCharts
          selectedYear={selectedYear}
          transactionType={TransactionType.INCOME}
          showOnChartsPage={true}
        />
        <RoundedCharts
          selectedYear={selectedYear}
          transactionType={TransactionType.EXPENSE}
          showOnChartsPage={true}
        />
      </div>

      <BarChart selectedYear={selectedYear} />

      <LineChart selectedYear={selectedYear} />
    </div>
  )
}

export default ChartsPage
