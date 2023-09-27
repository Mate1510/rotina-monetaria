'use client'

import UserLogin from '@/components/sections/user/UserLogin'
import React from 'react'

const LoginPage = () => {
  return (
    <div className="container relative py-48 md:py-0 min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Coluna da Esquerda */}
      <div className="relative hidden h-full flex-col bg-primaryOrange p-10 text-white lg:flex">
        <div className="relative z-20 flex items-center text-3xl font-semibold mt-10">
          Seja bem-vindo!
        </div>
        <div className="relative z-20 flex items-center text-3xl font-semibold mt-10 ml-16">
          Realize o Login para
        </div>
        <div className="relative z-20 flex items-center text-3xl font-semibold mt-10 ml-32">
          Sua Rotina Monetária
        </div>
      </div>

      {/* Coluna da Direita */}
      <div className="p-2">
        <div className="mx-auto flex w-full flex-col justify-center py-0 sm:w-[350px]">
          <UserLogin />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
