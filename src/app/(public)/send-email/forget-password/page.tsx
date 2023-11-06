'use client'

import ForgetPassword from '@/components/sections/user/ForgetPassword'
import React from 'react'

const ForgetPasswordPage = () => {
  return (
    <div className="w-4/5 mx-auto h-[70vh] relative py-10 md:py-0 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Coluna da Esquerda */}
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
      <div className="flex items-center text-3xl font-semibold mt-10">
          Seja bem-vindo!
        </div>
        <div className="flex items-center text-3xl font-semibold mt-10 ml-4">
          Esqueceu sua senha?
        </div>
        <div className="flex items-center text-3xl font-semibold mt-10 ml-8">
          Não tem problema,
        </div>
        <div className="flex items-center text-3xl font-semibold mt-10 ml-16">
          Basta nos informar seu email!
        </div>
        <div className="flex flex-grow items-end justify-end text-base font-semibold mt-20">
          Lembre-se de olhar também sua caixa de SPAM.
        </div>
      </div>

      {/* Coluna da Direita */}
      <div className="p-2 bg-white rounded-3xl my-10 py-14">
        <div className="mx-auto flex w-full flex-col justify-center py-0 sm:w-[350px]">
          <ForgetPassword />
        </div>
      </div>
    </div>
  )
}

export default ForgetPasswordPage
