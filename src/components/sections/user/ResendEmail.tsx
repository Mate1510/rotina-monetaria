import Button from '@/components/components/Button';
import Input from '@/components/components/Input';
import React, { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import axios from 'axios';
import { toast } from 'react-toastify';

interface UserEmail {
  email: string;
}

const ResendEmail = () => {
  const [data, setData] = useState<UserEmail>({ email: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email } = data;
      const response = await axios.post('/api/verify-email/resend-verification-email', { email });

      if (response.status === 200) {
        toast.success('E-mail de verificação reenviado com sucesso!');
      } else {
        toast.error('Não foi possível reenviar o e-mail de verificação.');
      }
    } catch (error) {
      toast.error('Erro ao tentar reenviar o e-mail de verificação.');
    } finally {
      setData({ email: '' });
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="border border-primaryOrange rounded-lg p-">
      <div className="mx-auto bg-white rounded-lg p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1 mb-3 items-center">
          <h3 className="text-center text-constrastBlack font-semibold text-xl">
            Reenviar E-mail de Verificação
          </h3>
          <p className="text-sm text-center">
            Por favor, informe o e-mail utilizado no cadastro.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-5">
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center gap-5">
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

            <Button className="w-4/5 flex gap-3 items-center justify-center" disabled={isLoading}>
              {isLoading && <AiOutlineLoading3Quarters size={16} className="text-white font-bold animate-spin" />}
              Reenviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResendEmail;
