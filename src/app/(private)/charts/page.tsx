'use client'

import React, { useState } from 'react'
import RoundedCharts from '@/components/sections/charts/RoundedCharts'
import YearSelector from '@/components/sections/charts/YearSelector'
import BarChart from '@/components/sections/charts/BarChart'
import { TransactionType } from '@/enum'
import LineChart from '@/components/sections/charts/LineChart'

const ChartsPage = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  )

  return (
    <div className="container flex min-h-screen flex-col items-center p-5 gap-12 lg:max-w-screen-xl lg:mx-auto">
      <h1 className="text-primaryOrange font-semibold text-4xl">
        Suas Estatísticas
      </h1>

      <div className="self-start">
        <h3 className="text-constrastBlack mb-2 font-medium text-lg">
          Ano da Consulta
        </h3>
        <YearSelector
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </div>

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
