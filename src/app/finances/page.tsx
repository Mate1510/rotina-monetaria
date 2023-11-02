import React from 'react'
import InsertFinances from '@/components/sections/finances/InsertFinances'
import FinanceTableExtended from '@/components/sections/finances/FinanceTableExtended'
import { FinanceProvider } from '@/contexts/FinanceContext'

const FinancesPage = () => {
  return (
    <div className="container flex min-h-screen flex-col items-center p-5 gap-12 lg:max-w-screen-xl lg:mx-auto">
      <FinanceProvider>
        <InsertFinances />
        <FinanceTableExtended />
      </FinanceProvider>
    </div>
  )
}

export default FinancesPage
