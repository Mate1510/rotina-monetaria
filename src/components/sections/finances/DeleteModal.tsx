"use client";

import React from "react";
import Modal from "react-modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="flex flex-col gap-5 p-5 border-primaryOrange border-2 rounded-lg items-center justify-center bg-white mx-auto w-4/5"
      style={{
        overlay: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.95)"
        },
        content: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      <h2 className="text-2xl text-primaryOrange font-semibold">Confirmar Exclusão</h2>
      <p className="text-lg text-constrastBlack font-medium text-center">Você tem certeza que irá deletar esta finança?</p>
      <div className="flex flex-wrap gap-10">
        <button onClick={onConfirm} className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg">Confirmar</button>
        <button onClick={onClose} className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg">Cancelar</button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
