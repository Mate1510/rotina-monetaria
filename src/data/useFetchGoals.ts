import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Goal } from '@/goal'

const useFetchGoals = (updateCount?: number) => {
  const [data, setData] = useState<Goal[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const { data: session } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const userId = session?.user?.userId
        const response = await axios.get('/api/goals', {
          params: { userid: userId },
        })
        const data = await response.data
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
  }, [session, updateCount])

  return { data, loading, error }
}

export default useFetchGoals
