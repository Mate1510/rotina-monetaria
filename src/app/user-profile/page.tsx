"use client";

import React from "react";
import { useSession } from "next-auth/react";
import UserProfile from "@/components/sections/user/UserProfile";

const UserProfilePage = () => {
  const { data: session } = useSession();
  return (
    <div className="container relative py-48 md:py-0 min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Coluna da Esquerda */}
      <div className="p-2">
        <div className="mx-auto flex min-w-max flex-col justify-center py-0 sm:w-[350px]">
            <UserProfile />
        </div>
      </div>

      {/* Coluna da Direita */}
      <div className="relative hidden h-full flex-col bg-primaryOrange p-10 text-white lg:flex">
        <div className="relative flex items-center text-3xl font-semibold mt-10">
          Olá, {session?.user?.name}!
        </div>
        <div className="relative flex items-center text-3xl font-semibold mt-5">
          Como vai?
        </div>
        <div className="relative flex items-center text-3xl font-semibold mt-20">
          O que você deseja fazer em seu perfil hoje?
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
