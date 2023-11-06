import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import axios from 'axios'

const VerifyEmail = () => {
  const [localToken, setLocalToken] = useState<string | null>(null);

  const { push } = useRouter()
  const searchParams = useSearchParams()

  const tokenFromParams = searchParams.get('token');

  useEffect(() => {
    if (tokenFromParams) {
      setLocalToken(tokenFromParams);
    }
  }, [tokenFromParams]);

  useEffect(() => {
    if (!localToken) return;

    const verifyEmail = async () => {
      try {
        const response = await axios.put('/api/verify-email', { token: localToken })

        if (response.status === 200) {
          toast.success('E-mail verificado com sucesso! Redirecionando...')
          setTimeout(() => {
            push('/login')
          }, 6000)
        } else {
          throw new Error('Erro ao verificar o e-mail.')
        }
      } catch (error) {
        toast.error('Erro ao verificar o e-mail. Redirecionando...')
        setTimeout(() => {
          push('/login')
        }, 2000)
      }
    }

    verifyEmail()
  }, [localToken, push])

  return (
    <div className="border border-primaryOrange rounded-lg lg:m-0 lg:p-0 mx-6 p-2">
      <div className="mx-auto bg-white rounded-lg p-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1 mb-3 items-center">
        <h3 className="text-center text-constrastBlack font-semibold text-sm md:text-lg lg:text-xl">
            Verificando seu E-mail
          </h3>

          <p className="text-xs text-center md:text-sm">
            Por favor, aguarde enquanto confirmamos seu cadastro.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
