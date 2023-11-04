'use client'

import Button from '@/components/components/Button'
import Input from '@/components/components/Input'
import React, { useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

interface UserEmail {
  email: string
}

const ForgetPassword = () => {
  const [data, setData] = useState<UserEmail>({ email: '' })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ email?: string }>({})

  const { push } = useRouter()

  const validateEmail = (email: string) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    return regex.test(email)
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    if (!data.email || !validateEmail(data.email)) {
      setErrors({ email: 'Por favor, insira um e-mail válido.' })
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post('/api/forget-password', data)

      if (response.data.status === 403) {
        toast.error(response.data.message + "\nRedirecionando...")
        setTimeout(() => {
          push('/login')
        }, 2000)
      } else if (response.status === 200) {
        toast.success(response.data.message + "\nRedirecionando...")
        setTimeout(() => {
          push('/login')
        }, 2000)
      } else {
        toast.warn(response.data.message || 'Erro ao enviar o e-mail.')
      }
    } catch (error) {
      toast.error(
        'Não foi possível enviar o e-mail! Tente novamente mais tarde.',
      )
    } finally {
      setData({
        email: '',
      })
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  return (
    <div className="border border-primaryOrange rounded-lg p-">
      <div className="mx-auto bg-white rounded-lg p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1 mb-3 items-center">
          <h3 className="text-center text-constrastBlack font-semibold text-xl">
            Nos informe seu E-mail:
          </h3>

          <p className="text-sm text-center">
            Enviaremos um link de redefinição de senha
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-5">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-5"
          >
            <Input
              placeholder="E-mail"
              type="email"
              name="email"
              autoComplete="email"
              value={data.email}
              disabled={isLoading}
              onChange={handleChange}
              error={!!errors.email}
              errorMessage={errors.email}
              className="w-full"
            />

            <Button
              className="w-4/5 flex gap-3 items-center justify-center"
              disabled={isLoading}
            >
              {isLoading && (
                <AiOutlineLoading3Quarters
                  size={16}
                  className="text-white font-bold animate-spin"
                />
              )}
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword
