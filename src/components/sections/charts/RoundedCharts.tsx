'use client'

import React, {
  useState,
  useEffect,
  InputHTMLAttributes,
  DetailedHTMLProps,
} from 'react'
import { useSession } from 'next-auth/react'
import { Doughnut, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import useFetchFinances from '@/data/useFetchFinances'
import useFetchCategories from '@/data/useFetchCategories'
import { Color, TransactionType } from '@/enum'
import { usePathname } from 'next/navigation'
import Select from '@/components/components/Select'
import Input from '@/components/components/Input'

ChartJS.register(ArcElement, Tooltip, Legend)

const RoundedCharts = ({
  selectedYear,
  transactionType,
  showOnChartsPage = false,
}: {
  selectedYear?: number
  transactionType?: TransactionType
  showOnChartsPage?: boolean
}) => {
  const [chartData, setChartData] = useState({
    labels: [] as any,
    datasets: [] as any,
  })
  const [chartOptions, setChartOptions] = useState({})
  const [isDoughnut, setIsDoughnut] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const year = selectedYear || new Date().getFullYear()

  const { data: session } = useSession()
  const { data: dataFinances } = useFetchFinances(selectedMonth, year)
  const { data: dataCategories } = useFetchCategories()

  const months = [
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value))
  }

  const handleSwitch = (
    e: DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
  ) => {
    setIsDoughnut(!isDoughnut)
  }

  useEffect(() => {
    if (!session) {
      console.error('User not authenticated.')
      return
    }

    if (!Array.isArray(dataFinances) || !Array.isArray(dataCategories)) {
      return
    }

    let filteredFinances = dataFinances
    let filteredCategories = dataCategories

    if (transactionType) {
      filteredFinances = dataFinances.filter(
        finance => finance.type === transactionType,
      )

      filteredCategories = dataCategories.filter(
        category => category.transactionType === transactionType,
      )
    }

    const financeMap: { [key: string]: number } = {}
    const colorMap: { [key: string]: string } = {}

    filteredCategories.forEach(category => {
      financeMap[category.id] = 0
      colorMap[category.id] = Color[category.color as keyof typeof Color]
    })

    filteredFinances.forEach(finance => {
      if (financeMap[finance.categoryId] !== undefined) {
        financeMap[finance.categoryId] += parseFloat(finance.value as any)
      }
    })

    const labels: string[] = []
    const data: number[] = []
    const backgroundColor: string[] = []

    for (const category of filteredCategories) {
      labels.push(category.name)
      data.push(financeMap[category.id])
      backgroundColor.push(colorMap[category.id])
    }

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Total R$',
          data: data,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
        },
      ],
    })

    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Finanças por Categoria',
        },
      },
    })
  }, [dataFinances, dataCategories, session, transactionType])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end">
        {showOnChartsPage && (
          <Select placeholder="Mês" onChange={handleChange} className="w-1/2">
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </Select>
        )}

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            onChange={handleSwitch}
            className="sr-only peer"
          />
          {showOnChartsPage ? (
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orangeDarker rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primaryOrange"></div>
          ) : (
            <div className="w-11 h-6 bg-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-constrastGray rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primaryOrange after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primaryOrange after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-200"></div>
          )}
          <span className="ml-3 text-sm font-medium text-gray-900">Pie</span>
        </label>
      </div>

      <div className="bg-white p-5 rounded-lg border-primaryOrange border-2">
        {isDoughnut ? (
          <Doughnut data={chartData} options={chartOptions} />
        ) : (
          <Pie data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  )
}

export default RoundedCharts
