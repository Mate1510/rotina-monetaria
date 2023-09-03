import React, { SyntheticEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/components/Input";
import Button from "@/components/components/Button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";

interface UserResetPassword {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword = () => {
  const [data, setData] = useState<UserResetPassword>({
    password: "",
    passwordConfirmation: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { password, passwordConfirmation } = data;

      if (password !== passwordConfirmation) {
        //Tratativa de erro senha não coincide
        return;
      }

      const response = await axios.put("/api/reset-password", {
        password,
        token,
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
        password: "",
        passwordConfirmation: "",
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
            Reinicie sua Senha:
          </h3>

          <p className="text-sm text-center">
            Crie uma nova senha e confirme para atualizar
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-5">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center justify-center gap-5"
          >
            <Input
              placeholder="Nova Senha"
              type="password"
              name="password"
              value={data.password}
              disabled={isLoading}
              onChange={handleChange}
              className="w-full"
            />

            <Input
              placeholder="Confirme a Senha"
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
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
