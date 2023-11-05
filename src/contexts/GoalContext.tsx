'use client'

import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from 'react'
import axios from 'axios'
import { Goal, GoalInput } from '@/goal'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

interface GoalContextData {
  goals: Goal[]
  addGoal: (goal: Goal) => void
  createGoal: (newGoal: Partial<GoalInput>) => void
  editGoal: (updatedGoal: Goal) => void
  deleteGoal: (id: string) => void
  loading: boolean
  error: string
}

interface GoalProviderProps {
  children: ReactNode
}

export const GoalContext = createContext({} as GoalContextData)

export function GoalProvider({ children }: GoalProviderProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const { data: session } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        setLoading(true)
        setError('')
        try {
          const userId = session?.user?.userId
          const response = await axios.get('/api/goals', {
            params: { userid: userId },
          })
          const data = response.data
          setGoals(data)
        } catch (error) {
          setError('Erro ao buscar metas!')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [session])

  const addGoal = (goal: Goal) => {
    setGoals([...goals, goal])
  }

  const createGoal = async (newGoal: Partial<GoalInput>) => {
    if (!session) return
    setLoading(true)
    setError('')

    try {
      const responseGoal = await axios.post(`/api/goals/`, {
        ...newGoal,
        userId: session.user.userId,
        currentGoalValue: parseFloat(newGoal.currentGoalValue || '0'),
        finalGoalValue: parseFloat(newGoal.finalGoalValue || '0'),
      })
      const createdGoal = responseGoal.data

      if (createdGoal.error) {
        toast.error('Erro ao criar a meta!')
        return
      }

      addGoal(createdGoal)

      const categoryResponse = await axios.get(
        `/api/categories/goal-category?userid=${session.user.userId}`,
      )
      const { categoryId } = categoryResponse.data

      if (!categoryId) {
        toast.error('Erro ao criar a meta!')
        return
      }

      const finance = {
        name: createdGoal.name + ' - Meta',
        value: createdGoal.currentGoalValue,
        type: 'EXPENSE',
        userId: session.user.userId,
        date: new Date(),
        categoryId: categoryId,
        goalId: createdGoal.id,
      }
      await axios.post(`/api/finances/`, finance)

      toast.success('Meta criada com sucesso!')
    } catch (error) {
      toast.error('Erro ao adicionar meta!')
    } finally {
      setLoading(false)
    }
  }

  const editGoal = async (updatedGoal: Goal) => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.put(
        `/api/goals/${updatedGoal.id}`,
        updatedGoal,
      )

      if (response.status === 200) {
        setGoals(
          goals.map(goal => (goal.id === updatedGoal.id ? updatedGoal : goal)),
        )
        toast.success('Meta atualizada com sucesso!')

        const updateContributionsResponse = await axios.put(
          `/api/goals/contributions/${updatedGoal.id}`,
          {
            goalName: updatedGoal.name,
          },
        )

        if (updateContributionsResponse.status !== 200) {
          toast.error(
            'Não foi possível excluírmos os aportes dessa meta. Exclua manualmente.',
          )
        }
      } else {
        setError('Falha ao atualizar meta!')
      }

      const financeResponse = await axios.get(
        `/api/finances/goal?goalid=${updatedGoal.id}`,
      )
      const financeData = financeResponse.data
      const updatedFinance = {
        ...financeData,
        name: updatedGoal.name + ' - Meta',
      }
      await axios.put(`/api/finances/${financeData.id}`, updatedFinance)
    } catch (error) {
      setError('Ocorreu um erro! Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      const deleteGoalResponse = await axios.delete(`/api/goals/${id}`)

      if (deleteGoalResponse.status === 200) {
        setGoals(goals.filter(goal => goal.id !== id))
        toast.success('Meta excluída com sucesso!')

        const deleteContributionsResponse = await axios.delete(
          `/api/goals/contributions/${id}`,
        )

        if (deleteContributionsResponse.status !== 200) {
          toast.error('Falha ao excluir aportes! Exclua manualmente.')
        }
      } else {
        setError('Falha ao deletar meta!')
      }
    } catch (error) {
      setError('Ocorreu um erro! Tente novamente mais tarde.')
    }
  }

  return (
    <GoalContext.Provider
      value={{
        goals,
        addGoal,
        loading,
        error,
        editGoal,
        deleteGoal,
        createGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  )
}

export const useGoals = () => useContext(GoalContext)
