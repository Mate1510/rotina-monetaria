import React, { SyntheticEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '@/components/components/Input'
import Button from '@/components/components/Button'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import axios from 'axios'
import { toast } from 'react-toastify'

interface UserResetPassword {
  password: string
  passwordConfirmation: string
}

const ResetPassword = () => {
  const [data, setData] = useState<UserResetPassword>({
    password: '',
    passwordConfirmation: '',
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState({
    password: '',
    passwordConfirmation: '',
  })

  const { push } = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const validatePasswords = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

    if (!data.password) {
      setErrors(prev => ({
        ...prev,
        password: 'A senha é obrigatória.',
      }))
      return false
    }

    if (!passwordRegex.test(data.password)) {
      setErrors(prev => ({
        ...prev,
        password:
          'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
      }))
      return false
    }

    if (!data.passwordConfirmation) {
      setErrors(prev => ({
        ...prev,
        passwordConfirmation: 'A confirmação de senha é obrigatória.',
      }))
      return false
    }

    if (data.password !== data.passwordConfirmation) {
      setErrors(prev => ({
        ...prev,
        passwordConfirmation: 'As senhas não correspondem.',
      }))
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setErrors({ password: '', passwordConfirmation: '' })

    if (!validatePasswords()) return

    setIsLoading(true)

    try {
      const response = await axios.put('/api/reset-password', {
        password: data.password,
        token,
      })

      const responseData = await response.data

      if (response.status == 200) {
        toast.success('Senha redefinida com sucesso!\nRedirecionando...')
        setTimeout(() => {
          push('/login')
        }, 2000)
      } else {
        toast.error('Erro ao redefinir senha!')
      }
    } catch (error) {
      toast.error('Erro ao redefinir senha!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div className="border border-primaryOrange rounded-lg p-">
      <div className="mx-auto bg-white rounded-lg p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1 mb-3 items-center">
          <h3 className="text-center text-constrastBlack font-semibold text-xl">
            Reinicie sua Senha:
          </h3>

          <p className="text-sm text-center">
            Crie uma nova senha e confirme para atualizar
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-5">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-5"
          >
            <Input
              placeholder="Nova Senha"
              type="password"
              name="password"
              value={data.password}
              disabled={isLoading}
              onChange={handleChange}
              className="w-full"
              error={!!errors.password}
              errorMessage={errors.password}
            />

            <Input
              placeholder="Confirme a Senha"
              type="password"
              name="passwordConfirmation"
              value={data.passwordConfirmation}
              disabled={isLoading}
              onChange={handleChange}
              className="w-full"
              error={!!errors.passwordConfirmation}
              errorMessage={errors.passwordConfirmation}
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

export default ResetPassword
