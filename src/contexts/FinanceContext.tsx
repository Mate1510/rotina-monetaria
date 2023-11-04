'use client'

import { createContext, ReactNode, useState, useEffect } from 'react'
import axios from 'axios'
import { Finance, FinanceInput } from '@/finance'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

interface FinanceContextData {
  finances: Finance[]
  addFinance: (finance: Finance) => void
  createFinance: (newFinance: Partial<FinanceInput>) => void
  editFinance: (updatedFinance: Finance) => void
  deleteFinance: (id: string) => void
  month?: number
  year?: number
  setMonth: (month: number) => void
  setYear: (year: number) => void
  loading: boolean
  error: string
}

interface FinanceProviderProps {
  children: ReactNode
  selectedYear: number
}

export const FinanceContext = createContext({} as FinanceContextData)

export function FinanceProvider({ children, selectedYear }: FinanceProviderProps) {
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
          const params: { [key: string]: any } = { userid: userId, month, year: selectedYear }

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
  }, [session, month, selectedYear])

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

      if (response.data.status === 400) {
        toast.error(response.data.error || response.data.message)
      } else {
        addFinance(response.data)
        toast.success('Finança adicionada com sucesso!')
      }
    } catch (error) {
      toast.error('Erro ao adicionar finança!')
    } finally {
      setLoading(false)
    }
  }

  const editFinance = async (updatedFinance: Finance) => {
    setLoading(true)
    setError('')

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
        toast.success('Finança atualizada com sucesso!')
      } else {
        setError('Falha ao atualizar finança!')
      }
    } catch (error) {
      setError('Ocorreu um erro! Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  const deleteFinance = async (id: string) => {
    try {
      const response = await axios.delete(`/api/finances/${id}`)

      if (response.status === 200) {
        setFinances(finances.filter(finance => finance.id !== id))
      } else {
        setError('Falha ao deletar finança!')
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
