'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/components/Button'
import Input from '@/components/components/Input'
import Image from 'next/image'
import axios from 'axios'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { signIn } from 'next-auth/react'
import { toast } from 'react-toastify'

interface User {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

type ErrorsType = {
  name?: string
  email?: string
  password?: string
  passwordConfirmation?: string
}

const UserRegister = () => {
  const [data, setData] = useState<User>({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<ErrorsType>({})

  const router = useRouter()

  const validate = (): boolean => {
    const newErrors: ErrorsType = {}
    let isValid = true

    if (!data.name) {
      newErrors.name = 'Nome é obrigatório.'
      isValid = false
    }

    if (!data.email) {
      newErrors.email = 'E-mail é obrigatório.'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'E-mail inválido.'
      isValid = false
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

    if (!data.password) {
      newErrors.password = 'Senha é obrigatória.'
      isValid = false
    } else if (!passwordRegex.test(data.password)) {
      newErrors.password =
        'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
      isValid = false
    }

    if (data.password !== data.passwordConfirmation) {
      newErrors.passwordConfirmation = 'As senhas não coincidem.'
      toast.error("As senhas não coincidem! 😔")
      isValid = false
    }

    setErrors(newErrors)

    if (!isValid) {
      setIsLoading(false)
    }

    return isValid
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { name, email, password, passwordConfirmation } = data

    if (!validate()) {
      return
    }

    try {
      const response = await axios.post('/api/user', {
        name,
        email,
        password,
      })

      const userData = response.data

      if (userData.status !== 200) {
        toast.error(userData.error)
      } else {
        toast.warn("Verifique seu e-mail para realizar Login!")
        toast.success('Registro bem sucedido! 👌')
        router.push('/login')
      }
    } catch (error) {
      toast.error('Erro ao criar o usuário. 🤯')
    }

    setData({
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    })
    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleGoogleClick = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="border border-primaryOrange rounded-lg lg:m-0 lg:p-0 mx-6 p-2">
      <div className="mx-auto bg-white rounded-lg p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1 mb-3 items-center">
          <h3 className="text-center text-constrastBlack font-semibold text-lg md:text-xl">
            Cadastre-se:
          </h3>

          <p className="text-xs md:text-sm text-center">Faça seu cadastro com as credenciais</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-5">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-5"
          >
            <Input
              placeholder="Nome"
              type="text"
              name="name"
              value={data.name}
              disabled={isLoading}
              onChange={handleChange}
              className="w-full"
              error={Boolean(errors.name)}
              errorMessage={errors.name}
            />

            <Input
              placeholder="E-mail"
              type="email"
              name="email"
              autoComplete="email"
              value={data.email}
              disabled={isLoading}
              onChange={handleChange}
              className="w-full"
              error={Boolean(errors.email)}
              errorMessage={errors.email}
            />

            <Input
              placeholder="Senha"
              type="password"
              name="password"
              value={data.password}
              disabled={isLoading}
              onChange={handleChange}
              className="w-full"
              error={Boolean(errors.password)}
              errorMessage={errors.password}
            />

            <Input
              placeholder="Confirmar senha"
              type="password"
              name="passwordConfirmation"
              value={data.passwordConfirmation}
              disabled={isLoading}
              onChange={handleChange}
              className="w-full"
              error={Boolean(errors.passwordConfirmation)}
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
              Cadastrar
            </Button>
          </form>

          <div className="flex items-center justify-center">
            <div className="min-w-full h-[1px] bg-primaryOrange"></div>
            <h3 className="w-full text-constrastBlack font-medium whitespace-nowrap px-4">
              Ou
            </h3>
            <div className="min-w-full h-[1px] bg-primaryOrange"></div>
          </div>

          <div className="flex gap-3 items-center justify-center transform transition-transform duration-300 hover:scale-110">
            <span
              className="border border-primaryOrange rounded-full p-2 cursor-pointer"
              onClick={handleGoogleClick}
            >
              <Image
                src="https://authjs.dev/img/providers/google.svg"
                alt="Logo Google"
                width={24}
                height={24}
              ></Image>
            </span>
            <p
              onClick={handleGoogleClick}
              className="text-constrastBlack cursor-pointer"
            >
              Continue com o Google
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserRegister
