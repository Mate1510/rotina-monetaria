import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Finance } from '@/finance'

const useFetchFinances = (month?: number, year?: number) => {
  const [data, setData] = useState<Finance[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const { data: session } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const userId = session?.user?.userId
        const params: { [key: string]: any } = { userid: userId }
        if (month) params.month = month
        if (year) params.year = year

        const response = await axios.get('/api/finances', { params })
        const data = response.data
        setData(data)
      } catch (error) {
        if (error instanceof Error) {
          setError(error)
        } else {
          setError(new Error('An unknown error occurred'))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [month, year, session])

  return { data, loading, error }
}

export default useFetchFinances
