'use client'

import React, { createContext, ReactNode, useState, useEffect } from 'react'
import axios from 'axios'
import { Category, CategoryInput } from '@/categories'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

interface CategoriesContextData {
  categories: Category[]
  addCategory: (category: Category) => void
  createCategory: (newCategory: Partial<CategoryInput>) => void
  editCategory: (updatedCategory: Category) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  loading: boolean
  error: string
}

interface CategoriesProviderProps {
  children: ReactNode
}

export const CategoriesContext = createContext<CategoriesContextData>(
  {} as CategoriesContextData,
)

export const CategoriesProvider = ({ children }: CategoriesProviderProps) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const { data: session } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        setLoading(true)
        try {
          const userId = session.user.userId
          const response = await axios.get('/api/categories', {
            params: { userid: userId },
          })
          const data = response.data
          setCategories(data)
        } catch (error) {
          setError('Erro ao buscar categorias!')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [session])

  const addCategory = (category: Category) => {
    setCategories([...categories, category])
  }

  const createCategory = async (newCategory: Partial<CategoryInput>) => {
    if (!session) return
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post(`/api/categories/`, {
        ...newCategory,
        userId: session.user.userId,
      })

      if (response.status === 200) {
        addCategory(response.data)
        toast.success('Categoria adicionada com sucesso!')
      } else {
        toast.error(response.data.error || response.data.message)
      }
    } catch (error) {
      toast.error('Erro ao adicionar categoria!')
    } finally {
      setLoading(false)
    }
  }

  const editCategory = async (updatedCategory: Category) => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.put(
        `/api/categories/${updatedCategory.id}`,
        updatedCategory,
      )

      if (response.status === 200) {
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.id === updatedCategory.id ? updatedCategory : cat,
          ),
        )
        toast.success('Categoria atualizada com sucesso!')
      } else {
        setError('Falha ao atualizar finança!')
      }
    } catch (error) {
      setError('Ocorreu um erro! Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.delete(`/api/categories/${id}`)

      if (response.status === 200) {
        setCategories(prevCategories =>
          prevCategories.filter(cat => cat.id !== id),
        )
        toast.success('Categoria excluída com sucesso!')
      } else {
        setError('Falha ao deletar finança!')
      }
    } catch (error) {
      setError('Erro ao excluir categoria!')
      toast.error('Erro ao excluir categoria!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory,
        createCategory,
        editCategory,
        deleteCategory,
        loading,
        error,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}
