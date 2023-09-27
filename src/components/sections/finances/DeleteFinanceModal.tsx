'use client'

import React from 'react'
import ModalComponent from '@/components/sections/Modal'
import Button from '@/components/components/Button'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const DeleteFinanceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Confirmar Exclusão"
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
        Você tem certeza que irá deletar esta finança?
      </p>
    </ModalComponent>
  )
}

export default DeleteFinanceModal
