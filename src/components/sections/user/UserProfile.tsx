'use client'

import Button from '@/components/components/Button'
import Input from '@/components/components/Input'
import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MdAddCircleOutline, MdOutlineAccountCircle } from 'react-icons/md'
import DisableUserModal from './DisableUserModal'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { toast } from 'react-toastify'

interface User {
  image: string
  name: string
  password: string
  passwordConfirmation: string
}

const UserProfile = () => {
  const { data: session, status, update } = useSession()

  const [data, setData] = useState<User>({
    image: session?.user?.image || '',
    name: session?.user?.name || '',
    password: '',
    passwordConfirmation: '',
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userDisable, setUserDisable] = useState<User | null>(null)
  const [isUserOAuth, setIsUserOAuth] = useState<boolean>(false)
  const [errors, setErrors] = useState({
    name: '',
    password: '',
    passwordConfirmation: '',
  })

  const validateName = () => {
    if (!data.name.trim()) {
      setErrors(prev => ({ ...prev, name: 'O nome não pode estar vazio.' }))
      return false
    }
    return true
  }

  const validatePasswords = () => {
    if (!data.password) {
      setErrors(prev => ({ ...prev, password: 'A senha é obrigatória.' }))
      return false
    }

    if (data.password !== data.passwordConfirmation) {
      setErrors(prev => ({
        ...prev,
        passwordConfirmation: 'As senhas não correspondem.',
      }))
      return false
    }
    return true
  }

  const handleEditName = async () => {
    if (!validateName()) return
    setIsLoading(true)

    try {
      const userId = session?.user?.userId

      const response = await axios.put(`/api/user/${userId}`, {
        name: data.name,
      })

      if (response.status === 200) {
        update({ name: data.name})
        toast.success('Nome de usuário alterado com sucesso!')
      } else {
        toast.error('Erro ao alterar nome de usuário!\nTente novamente mais tarde.')
      }
    } catch (error) {
      toast.error('Erro ao atualizar o nome.')
    } finally {
      setIsLoading(false)

      setData({
        image: session?.user?.image ?? '',
        name: session?.user?.name ?? '',
        password: '',
        passwordConfirmation: '',
      })
    }
  }

  const handleEditPassword = async () => {
    if (!validatePasswords()) return
    setIsLoading(true)

    try {
      const userId = session?.user?.userId

      const response = await axios.put(`/api/user/${userId}`, {
        password: data.password,
      })

      if (response.status === 200) {
        toast.success('Senha de usuário alterada com sucesso!')
      } else {
        toast.error('Erro ao alterar senha de usuário!\nTente novamente mais tarde.')
      }
    } catch (error) {
      toast.error('Erro ao atualizar a senha.')
    } finally {
      setIsLoading(false)

      setData({
        image: session?.user?.image ?? '',
        name: session?.user?.name ?? '',
        password: '',
        passwordConfirmation: '',
      })
    }
  }

  /*SE FOR IMPLEMENTAR TROCA DE IMAGEM const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    };*/

  const handleDisableClick = (user: User) => {
    setUserDisable(user)
  }

  const handleConfirmDisable = async () => {
    setIsLoading(true)

    try {
      const userId = session?.user?.userId

      const response = await axios.delete(`/api/user/${userId}`)

      if (response.status === 200) {
        toast.success('Usuário inativado com sucesso!\nRedirecionando...')
        signOut()
      } else {
        toast.error('Erro ao inativar usuário!\nTente novamente mais tarde.')
      }
    } catch (error) {
      toast.error('Falha ao desativar usuário!')
    } finally {
      setIsLoading(false)

      setData({
        image: session?.user?.image ?? '',
        name: session?.user?.name ?? '',
        password: '',
        passwordConfirmation: '',
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  useEffect(() => {
    if (!session) {
      return
    }

    const fetchUserOAuth = async () => {
      try {
        const userId = session?.user?.userId

        const userOAuthresponse = await axios.get(
          `/api/get-user-info/oauth-account?userid=${userId}`,
        )
        const userOAuth = userOAuthresponse.data.userOAuth

        if (userOAuth) {
          setIsUserOAuth(true)
        }
      } catch (error) {
        toast.error('Falha ao verificar usuário!')
      }
    }

    fetchUserOAuth()
  }, [session, status])

  return (
    <div className="flex flex-col gap-y-10 border border-primaryOrange rounded-lg p-10 min-w-max">
      <div className="flex gap-5 items-center">
        <div className="relative group">
          {session?.user?.image ? (
            <Image
              className="rounded-full border-2 border-primaryOrange"
              src={session?.user?.image ?? ''}
              alt={session?.user?.name ?? ''}
              width={120}
              height={120}
            ></Image>
          ) : (
            <MdOutlineAccountCircle size={120} className="text-primaryOrange" />
          )}

          {/*SE FOR IMPLEMENTAR A TROCA DE IMAGEM
          <Input
            type="file"
            accept="image/*"
            className="opacity-0 absolute top-0 left-0 w-full h-full rounded-full cursor-pointer"
            onChange={handleFileChange}
          />

          <div className="absolute inset-0 bg-black opacity-0 rounded-full group-hover:opacity-50 transition-opacity duration-300"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <MdAddCircleOutline
              size={32}
              className="text-primaryOrange opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="text-primaryOrange text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Atualize sua Foto
            </span>
          </div>
          */}
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-constrastBlack text-2xl font-semibold whitespace-nowrap">
            {session?.user?.name}
          </h1>
          <h1 className="text-constrastBlack text-lg font-medium whitespace-nowrap">
            {session?.user?.email}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-primaryOrange text-lg font-medium">Editar Nome</h2>

        <div className="flex gap-3">
          <Input
            placeholder="Novo nome"
            className="w-full"
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            disabled={isLoading}
            error={!!errors.name}
            errorMessage={errors.name}
          />
          <Button
            className="w-2/5 flex gap-3 items-center justify-center"
            onClick={handleEditName}
          >
            {isLoading && (
              <AiOutlineLoading3Quarters
                size={16}
                className="text-white font-bold animate-spin"
              />
            )}
            Editar
          </Button>
        </div>
      </div>

      {!isUserOAuth && (
        <div className="flex flex-col gap-3">
          <h2 className="text-primaryOrange text-lg font-medium">
            Editar Senha
          </h2>

          <Input
            placeholder="Nova Senha"
            type="password"
            name="password"
            value={data.password}
            disabled={isLoading}
            onChange={handleChange}
            className="w-full"
            error={!!errors.password}
            errorMessage={errors.password}
          />

          <Input
            placeholder="Confirme a Senha"
            type="password"
            name="passwordConfirmation"
            value={data.passwordConfirmation}
            disabled={isLoading}
            onChange={handleChange}
            className="w-full"
            error={!!errors.passwordConfirmation}
            errorMessage={errors.name}
          />

          <Button
            className="w-3/5 flex gap-3 self-center justify-center"
            disabled={isLoading}
            onClick={handleEditPassword}
          >
            {isLoading && (
              <AiOutlineLoading3Quarters
                size={16}
                className="text-white font-bold animate-spin"
              />
            )}
            Editar
          </Button>
        </div>
      )}

      <Button
        className="w-full mt-5 flex gap-3 self-center justify-center"
        onClick={() => handleDisableClick(data)}
      >
        {isLoading && (
          <AiOutlineLoading3Quarters
            size={16}
            className="text-white font-bold animate-spin"
          />
        )}
        Desativar Conta
      </Button>

      {userDisable && (
        <DisableUserModal
          isOpen={!!userDisable}
          onClose={() => setUserDisable(null)}
          onConfirm={handleConfirmDisable}
        />
      )}
    </div>
  )
}

export default UserProfile
