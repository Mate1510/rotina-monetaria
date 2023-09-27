'use client'

import React from 'react'
import ModalComponent from '@/components/sections/Modal'
import Button from '@/components/components/Button'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const DisableUserModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Confirmar Desativação"
      actionButton={
        <Button
          onClick={onConfirm}
          className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg"
        >
          Confirmar
        </Button>
      }
    >
      <p className="text-lg text-constrastBlack font-medium text-center">
        Você tem certeza que deseja desativar sua conta? Após realizar este
        procedimento apenas os administradores do sistema conseguem ativar sua
        conta novamente.
      </p>
    </ModalComponent>
  )
}

export default DisableUserModal
