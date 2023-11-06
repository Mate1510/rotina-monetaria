'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import UserProfile from '@/components/sections/user/UserProfile'

const UserProfilePage = () => {
  const { data: session } = useSession()
  return (
    <div className="w-4/5 mx-auto relative py-10 md:py-0 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Coluna da Esquerda */}
      <div className="p-2 bg-white rounded-3xl my-10 py-14">
        <div className="mx-auto flex w-full flex-col justify-center py-0 sm:w-[350px]">
          <UserProfile />
        </div>
      </div>

      {/* Coluna da Direita */}
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
      <div className="flex items-center text-3xl font-semibold mt-10 ml-10">
          Olá, {session?.user?.name}!
        </div>
        <div className="flex items-center text-3xl font-semibold mt-5 ml-10">
          Como você está?
        </div>
        <div className="flex items-center text-3xl font-semibold mt-20 ml-10">
          O que deseja fazer em seu perfil hoje?
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
