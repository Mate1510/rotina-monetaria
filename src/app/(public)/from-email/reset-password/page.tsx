'use client'

import React from 'react'
import ResetPassword from '@/components/sections/user/ResetPassword'

const ResetPasswordPage = () => {
  return (
    <div className="w-4/5 mx-auto h-[72vh] relative py-10 md:py-0 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Coluna da Esquerda */}
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
        <div className="flex items-center text-3xl font-semibold mt-10">
          Parece que você
        </div>
        <div className="flex items-center text-3xl font-semibold mt-10 ml-4">
          quer trocar sua senha...
        </div>
        <div className="flex items-center text-3xl font-semibold mt-10 ml-8">
          Redefina agora mesmo
        </div>
        <div className="flex items-center text-3xl font-semibold mt-10 ml-16">
          E volte à sua Rotina Monetária
        </div>
      </div>

      {/* Coluna da Direita */}
      <div className="p-2 bg-white rounded-3xl my-10 py-14">
        <div className="mx-auto flex w-full flex-col justify-center py-0 sm:w-[350px]">
          <ResetPassword />
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
