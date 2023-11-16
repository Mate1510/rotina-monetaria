import React, { useEffect, useState } from 'react'
import Select from '@/components/components/Select'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'

const YearSelector = ({
  selectedYear,
  setSelectedYear,
  onYearsFetched,
}: {
  selectedYear: number
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>
  onYearsFetched?: (years: number[] | null) => void
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

        if (yearsArray.length === 1 && yearsArray[0] === 0) {
          setYears(null)
          if (onYearsFetched) {
            onYearsFetched(null)
          }
        } else {
          setYears(yearsArray)
          if (onYearsFetched) {
            onYearsFetched(yearsArray)
          }
        }
      } catch (error) {
        toast.error('Erro ao buscar os anos. Tente novamente mais tarde!')
      }
    }

    fetchYears()
  }, [onYearsFetched, session])

  return (
    <div data-testid="year-selector" className="self-start">
      <h3 className="text-constrastBlack mb-2 font-medium text-lg">
        Ano da Consulta
      </h3>

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
