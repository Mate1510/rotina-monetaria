'use client'

import { createContext, ReactNode, useState, useEffect } from 'react'
import axios from 'axios'
import { Finance, FinanceInput } from '@/finance'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

interface FinanceContextData {
  finances: Finance[]
  addFinance: (finance: Finance) => void
  month?: number
  year?: number
  setMonth: (month: number) => void
  setYear: (year: number) => void
  loading: boolean
  error: string
  editFinance: (updatedFinance: Finance) => void
  deleteFinance: (id: string) => void
  createFinance: (newFinance: Partial<FinanceInput>) => void
}

interface FinanceProviderProps {
  children: ReactNode
}

export const FinanceContext = createContext({} as FinanceContextData)

export function FinanceProvider({ children }: FinanceProviderProps) {
  const [finances, setFinances] = useState<Finance[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const { data: session } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        setLoading(true)
        setError('')
        try {
          const userId = session?.user?.userId
          const params: { [key: string]: any } = { userid: userId, month, year }

          const response = await axios.get('/api/finances', { params })
          const data = response.data
          setFinances(data)
        } catch (error) {
          setError('Erro ao buscar finanças!')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [session, month, year])

  const addFinance = (finance: Finance) => {
    setFinances([...finances, finance])
  }

  const createFinance = async (newFinance: Partial<FinanceInput>) => {
    if (!session) return
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`/api/finances/`, {
        ...newFinance,
        userId: session.user.userId,
      })

      if (response.status === 200) {
        addFinance(response.data)
        toast.success('Finança adicionada com sucesso!')
      } else {
        toast.error(response.data.error || response.data.message)
      }
    } catch (error) {
      toast.error('Erro ao adicionar finança!')
    } finally {
      setLoading(false)
    }
  }

  const editFinance = async (updatedFinance: Finance) => {
    try {
      const response = await axios.put(
        `/api/finances/${updatedFinance.id}`,
        updatedFinance,
      )

      if (response.status === 200) {
        setFinances(
          finances.map(finance =>
            finance.id === updatedFinance.id ? updatedFinance : finance,
          ),
        )
      } else {
        throw new Error('Falha ao atualizar finança!')
      }
    } catch (error) {
      setError('Ocorreu um erro! Tente novamente mais tarde.')
    }
  }

  const deleteFinance = async (id: string) => {
    try {
      const response = await axios.delete(`/api/finances/${id}`)

      if (response.status === 200) {
        setFinances(finances.filter(finance => finance.id !== id))
      } else {
        throw new Error('Falha ao deletar finança!')
      }
    } catch (error) {
      setError('Ocorreu um erro! Tente novamente mais tarde.')
    }
  }

  return (
    <FinanceContext.Provider
      value={{
        finances,
        addFinance,
        month,
        year,
        setMonth,
        setYear,
        loading,
        error,
        editFinance,
        deleteFinance,
        createFinance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}
