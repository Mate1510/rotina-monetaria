"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/components/Button";
import Input from "@/components/components/Input";
import Image from "next/image";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { signIn } from "next-auth/react";

interface User {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const UserRegister = () => {
  const [data, setData] = useState<User>({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, password, passwordConfirmation } = data;

    if (password !== passwordConfirmation) {
      //Tratativa de Erro senhas não coincidem
      return;
    }

    try {
      const response = await axios.post("/api/user", {
        name,
        email,
        password,
      });

      const userData = response.data;

      if (response.status !== 200) {
        //tratativa de erros
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error while creating the user.", error);
    }

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 5000);

    setData({
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    });
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleGoogleClick = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="border border-primaryOrange rounded-lg">
      <div className="mx-auto bg-white rounded-lg p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1 mb-3 items-center">
          <h3 className="text-center text-constrastBlack font-semibold text-xl">
            Cadastre-se:
          </h3>

          <p className="text-sm">Faça seu cadastro com as credenciais</p>
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
            />

            <Input
              placeholder="Senha"
              type="password"
              name="password"
              value={data.password}
              disabled={isLoading}
              onChange={handleChange}
              className="w-full"
            />

            <Input
              placeholder="Confirmar senha"
              type="password"
              name="passwordConfirmation"
              value={data.passwordConfirmation}
              disabled={isLoading}
              onChange={handleChange}
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
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
