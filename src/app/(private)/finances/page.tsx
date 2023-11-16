'use client'

import React, { useState } from 'react'
import InsertFinances from '@/components/sections/finances/InsertFinances'
import FinanceTableExtended from '@/components/sections/finances/FinanceTableExtended'
import { FinanceProvider } from '@/contexts/FinanceContext'
import YearSelector from '@/components/sections/YearSelector'

const FinancesPage = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  )

  return (
    <div className="container flex flex-col items-center p-5 gap-12 lg:max-w-screen-xl lg:mx-auto">
      <FinanceProvider selectedYear={selectedYear}>
        <InsertFinances />
        <YearSelector
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <FinanceTableExtended />
      </FinanceProvider>
    </div>
  )
}

export default FinancesPage
