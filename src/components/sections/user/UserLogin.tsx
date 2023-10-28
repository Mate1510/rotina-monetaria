'use client'

import Button from '@/components/components/Button'
import Input from '@/components/components/Input'
import Image from 'next/image'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useRouter } from 'next/navigation'

interface User {
  email: string
  password: string
}

const UserLogin = () => {
  const [data, setData] = useState<User>({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const { push } = useRouter()

  const validate = (): boolean => {
    let isValid = true

    if (!data.email) {
      setEmailError('Por favor, insira um e-mail.')
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      setEmailError('É preciso inserir um e-mail válido.')
      isValid = false
    } else {
      setEmailError(null)
    }

    if (!data.password) {
      setPasswordError('Por favor, insira uma senha.')
      isValid = false
    } else {
      setPasswordError(null)
    }

    if (!isValid) {
      setIsLoading(false)
    }

    return isValid
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    setIsLoading(true)

    if (!validate()) {
      return
    }

    const response = await signIn<'credentials'>('credentials', {
      ...data,
      redirect: false,
    })

    if (response?.error !== null || response?.error === 'Session required') {
      toast.error(response?.error)
    } else {
      toast.success('Login bem sucedido! 👌')
      push('/')
    }

    setData({
      email: '',
      password: '',
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
    <>
      <div className="border border-primaryOrange rounded-lg">
        <div className="mx-auto bg-white rounded-lg p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1 mb-3 items-center">
            <h3 className="text-center text-constrastBlack font-semibold text-xl">
              Faça seu Login:
            </h3>

            <p className="text-sm">Faça login com suas credenciais</p>
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
                className="w-full"
                error={Boolean(emailError)}
                errorMessage={emailError!}
              />

              <div className="w-full flex flex-col gap-1">
                <Input
                  placeholder="Senha"
                  type="password"
                  name="password"
                  value={data.password}
                  disabled={isLoading}
                  onChange={handleChange}
                  className="w-full"
                  error={Boolean(passwordError)}
                  errorMessage={passwordError!}
                />
                <div className="flex justify-end">
                  <Link
                    href={'/send-email/forget-password'}
                    className="text-right mb-3 cursor-pointer font-medium text-sm text-blue-500"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>

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
                Entrar
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
      <div className="flex justify-end">
        <Link
          href={'/send-email/email-verification'}
          className="text-right mt-3 mr-3 cursor-pointer font-medium text-sm text-blue-500"
        >
          Reenviar E-mail de Verificação
        </Link>
      </div>
    </>
  )
}

export default UserLogin
