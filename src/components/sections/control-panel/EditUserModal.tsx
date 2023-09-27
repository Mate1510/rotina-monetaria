'use client'

import React, { useState, useEffect } from 'react'
import Input from '@/components/components/Input'
import Button from '@/components/components/Button'
import ModalComponent from '@/components/sections/Modal'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  user: User
  onSave: (updatedUser: User) => void
}

const EditUserModal: React.FC<Props> = ({ isOpen, onClose, user, onSave }) => {
  const [updatedUser, setUpdatedUser] = useState<User>(user)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGoogleOAuth, setIsGoogleOAuth] = useState<boolean>(false)

  useEffect(() => {
    setUpdatedUser(user)

    const checkGoogleOAuth = async () => {
      try {
        const response = await axios.get(
          `/api/get-user-info/oauth-account?userid=${user.id}`,
        )
        setIsGoogleOAuth(response.data.userOAuth)
      } catch (error) {
        console.error(error)
        setIsGoogleOAuth(false)
      }
    }
    checkGoogleOAuth()
  }, [user])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (updatedUser.password !== updatedUser.passwordConfirmation) {
        return
      }

      await onSave(updatedUser)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Editar Usuário"
      actionButton={
        <Button
          className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg"
          onClick={handleSave}
          disabled={isLoading}
        >
          Salvar
        </Button>
      }
    >
      <div className="flex w-full my-3">
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="w-4/5">
            <Input
              placeholder="Nome"
              className="w-full"
              value={updatedUser.name}
              onChange={e =>
                setUpdatedUser({
                  ...updatedUser,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="w-4/5">
            <Input
              placeholder="Email"
              className="w-full disabled:bg-constrastGray disabled:border-constrastBlack"
              value={updatedUser.email}
              onChange={e =>
                setUpdatedUser({
                  ...updatedUser,
                  email: e.target.value,
                })
              }
              disabled={isGoogleOAuth}
            />
            {isGoogleOAuth && (
              <p className="text-xs font-medium text-red-500 w-full mt-1">
                Não é possível alterar o e-mail do usuário logado com
                GoogleOAuth
              </p>
            )}
          </div>
        </div>

        {!isGoogleOAuth && (
          <div className="flex flex-col gap-3 w-full items-start">
            <div className="w-4/5">
              <Input
                placeholder="Nova Senha"
                type="password"
                className="w-full"
                value={updatedUser.password}
                onChange={e =>
                  setUpdatedUser({
                    ...updatedUser,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <div className="w-4/5">
              <Input
                placeholder="Confirme a Senha"
                type="password"
                className="w-full"
                value={updatedUser.passwordConfirmation}
                onChange={e =>
                  setUpdatedUser({
                    ...updatedUser,
                    passwordConfirmation: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </ModalComponent>
  )
}

export default EditUserModal
