'use client'

import React from 'react'
import VerifyEmail from '@/components/sections/user/VerifyEmail'

const VerifyEmailPage = () => {
  return (
    <div className="w-4/5 mx-auto relative py-48 md:py-0 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Coluna da Esquerda */}
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
        <div className="flex items-center text-3xl font-semibold mt-10">
          Por favor, aguarde...
        </div>
        <div className="flex items-center text-3xl font-semibold mt-10 ml-4">
          Estamos confirmando
        </div>
        <div className="flex items-center text-3xl font-semibold mt-10 ml-8">
          O seu E-mail cadastrado
        </div>
        <div className="flex items-center text-3xl font-semibold mt-10 ml-16">
          E levando você à sua...
        </div>
        <div className="flex items-center text-3xl font-semibold mt-10 ml-32">
          ...Rotina Monetária
        </div>
      </div>

      {/* Coluna da Direita */}
      <div className="p-2 bg-white rounded-3xl my-10 py-14">
        <div className="mx-auto flex w-full flex-col justify-center py-0 sm:w-[350px]">
          <VerifyEmail />
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
