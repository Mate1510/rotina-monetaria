"use client";

import Button from "@/components/components/Button";
import ModalComponent from "../Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteCategoryModal: React.FC<Props> = ({
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
        Você tem certeza que irá deletar esta meta?
      </p>
    </ModalComponent>
  );
};

export default DeleteCategoryModal;