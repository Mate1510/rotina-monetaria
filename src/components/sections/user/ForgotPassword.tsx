"use client";

import Button from "@/components/components/Button";
import Input from "@/components/components/Input";
import Image from "next/image";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UserEmail {
  email: string;
}

const ForgotPassword = () => {
  const [data, setData] = useState<UserEmail>({ email: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email } = data;

      const response = await axios.post("/api/forgot-password", {
        email,
      });

      const responseData = await response.data;

      if (response.status == 200) {
        router.push("/login");
      } else {
        // Tratamento de Erros
        console.error(responseData);
      }
    } catch (error) {
      // Tratamento de Erros
      console.error(error);
    } finally {
      setData({
        email: "",
      });
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <div className="border border-primaryOrange rounded-lg p-">
      <div className="mx-auto bg-white rounded-lg p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1 mb-3 items-center">
          <h3 className="text-center text-constrastBlack font-semibold text-xl">
            Nos informe seu E-mail:
          </h3>

          <p className="text-sm text-center">
            Enviaremos um link de redefinição de senha
          </p>
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
  );
};

export default ForgotPassword;
