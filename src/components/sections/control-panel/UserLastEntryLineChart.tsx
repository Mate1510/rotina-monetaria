'use client'

import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const UserLastEntryLineChart = () => {
  const [chartData, setChartData] = useState({
    labels: [] as any,
    datasets: [] as any,
  })
  const [chartOptions, setChartOptions] = useState({})

  const { data: session } = useSession()

  useEffect(() => {
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

    if (!session) return

    const fetchData = async () => {
      try {
        const userRole = session?.user?.role
        const isAdmin: boolean = userRole === 'ADMIN' ? true : false

        if (!isAdmin) {
          return
        }

        const params = { isadmin: isAdmin }
        const response = await axios.get(
          '/api/get-user-info/users-last-entry',
          { params },
        )
        const lastEntries = response.data

        const monthlyCounts = Array(12).fill(0)

        lastEntries.forEach((entry: any) => {
          if (entry.lastEntry) {
            const date = new Date(entry.lastEntry)
            const month = date.getMonth()
            monthlyCounts[month]++
          }
        })

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Últimos Acessos',
              data: monthlyCounts,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              fill: false,
            },
          ],
        })

        setChartOptions({
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: `Últimos Acessos de Usuários`,
            },
          },
        })
      } catch (error) {
        toast.error(`Erro ao coletar últimos acessos.`)
      }
    }

    fetchData()
  }, [session])

  return (
    <div className="w-full bg-white p-5 rounded-lg border-primaryOrange border-2">
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}

export default UserLastEntryLineChart
