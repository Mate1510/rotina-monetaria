'use client'

import React from 'react'
import Modal from 'react-modal'
import Button from '../components/Button'

type Props = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  modalTitle: string
  actionButton: React.ReactNode
}

const ModalComponent: React.FC<Props> = ({
  isOpen,
  onClose,
  children,
  modalTitle,
  actionButton,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="flex flex-col gap-5 p-5 border-primaryOrange border-2 rounded-lg items-center justify-center bg-white mx-auto w-2/5"
      style={{
        overlay: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
        },
        content: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <h2 className="text-2xl text-primaryOrange font-semibold">
        {modalTitle}
      </h2>

      {children}

      <div className="flex flex-wrap gap-10">
        {actionButton}

        <Button
          onClick={onClose}
          className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg"
        >
          Cancelar
        </Button>
      </div>
    </Modal>
  )
}

export default ModalComponent
