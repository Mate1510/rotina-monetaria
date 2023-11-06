'use client'

import Finances from '@/components/sections/finances/InsertFinances'
import CategoriesSection from '@/components/sections/homepage/CategoriesSection'
import ChartsSection from '@/components/sections/homepage/ChartsSection'
import FinanceTable from '@/components/sections/homepage/FinanceTable'
import GoalsSection from '@/components/sections/homepage/GoalSection'
import { FinanceProvider } from '@/contexts/FinanceContext'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session } = useSession()
  const { push } = useRouter()

  if (!session) {
    push('/login')
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-3 gap-y-5 md:gap-y-8 lg:gap-y-12">
      <div className="w-11/12 lg:w-4/5 flex flex-col items-center gap-5 md:gap-8 lg:gap-12">
        <h1 className="text-primaryOrange font-semibold text-lg md:text-2xl lg:text-4xl self-start">
          Bem vindo(a), {session?.user?.name}
        </h1>
        <FinanceProvider selectedYear={new Date().getFullYear()}>
          <Finances />
          <FinanceTable />
        </FinanceProvider>
      </div>

      <ChartsSection />

      <div className="w-11/12 lg:w-4/5 flex flex-col lg:flex-row">
        <GoalsSection />
        <span className="border-2 border-constrastBlack bg-constrastBlack mx-24 md:mx-32 lg:mx-auto my-10"></span>
        <CategoriesSection />
      </div>
    </main>
  )
}
