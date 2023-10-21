import React from 'react'
import RoundedCharts from '../charts/RoundedCharts'
import BarChart from '../charts/BarChart'
import Link from 'next/link'

const ChartsSection = () => {
  const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long' })
  const currentYear = new Date().getFullYear()

  return (
    <div data-testid="charts-homepage" className="bg-primaryOrange w-full my-5 p-5 md:p-10">
      <div className="w-4/5 flex flex-col gap-10 mx-auto">
        <Link
          href="/charts"
          className="flex self-center text-white font-semibold text-2xl md:text-4xl hover:underline"
        >
          Estatísticas
        </Link>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          <div className="w-full md:w-auto text-center">
            <h2 className="text-white font-medium text-lg md:text-xl mb-3">
              {`Mês de ${currentMonth}`}
            </h2>
            <RoundedCharts />
          </div>
          <div className="w-full md:w-auto flex-grow text-center">
            <h2 className="text-white font-medium text-lg md:text-xl mb-3">
              {`Ano de ${currentYear}`}
            </h2>
            <BarChart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartsSection
