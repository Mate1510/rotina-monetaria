import React, { useEffect, useState } from 'react'
import Select from '@/components/components/Select'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const YearSelector = ({
  selectedYear,
  setSelectedYear,
}: {
  selectedYear: number
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>
}) => {
  const [years, setYears] = useState<number[] | null>([])
  const { data: session } = useSession()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value))
  }

  useEffect(() => {
    if (!session) {
      return
    }

    const fetchYears = async () => {
      const userId = session?.user?.userId
      try {
        const response = await axios.get('/api/get-user-info/years', {
          params: { userid: userId },
        })
        const data = response.data

        const yearsArray: number[] = Array.from(
          { length: data.maxYear - data.minYear + 1 },
          (_, k) => k + data.minYear,
        )

        console.log(yearsArray)

        if (yearsArray.length === 1 && yearsArray[0] === 0) {
          setYears(null)
        } else {
          setYears(yearsArray)
        }
      } catch (error) {
        console.error('Erro ao buscar os anos:', error)
      }
    }

    fetchYears()
  }, [session])

  return (
    <div className="">
      <Select
        placeholder="Selecione o Ano"
        value={selectedYear}
        onChange={handleChange}
        className="lg:w-60"
      >
        {years ? (
          years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))
        ) : (
          <option key="" value="">
            Sem finanças...
          </option>
        )}
      </Select>
    </div>
  )
}

export default YearSelector
