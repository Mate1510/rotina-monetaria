'use client'

import Finances from '@/components/sections/finances/InsertFinances'
import CardSection from '@/components/sections/homepage/CardSection'
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
    <main className="container flex min-h-screen flex-col items-center py-10 gap-y-12">
      <div className="w-4/5 flex flex-col items-center gap-12">
        <h1 className="text-primaryOrange font-semibold text-4xl self-start">
          Bem vindo(a), {session?.user?.name}
        </h1>
        <FinanceProvider>
          <Finances />
          <FinanceTable />
        </FinanceProvider>
      </div>

      <ChartsSection />

      <div className="w-4/5 flex flex-col md:flex-row">
        <GoalsSection />
        <span className="border-2 border-constrastBlack bg-constrastBlack mx-auto my-20"></span>
        <CategoriesSection />
      </div>
    </main>
  )
}
