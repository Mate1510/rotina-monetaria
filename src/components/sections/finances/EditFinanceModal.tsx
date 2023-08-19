"use client";

import React, { useState, useEffect } from "react";
import { Finance } from "@/finance";
import Modal from "react-modal";
import Input from "@/components/components/Input";
import CurrencyInput from "@/components/components/CurrencyInput";
import Select from "@/components/components/Select";
import DatePicker from "@/components/components/DatePicker";
import Button from "@/components/components/Button";
import { Category } from "@/categories";
import { TransactionType } from "@/enum";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  finance: Finance;
  onSave: (updatedFinance: Finance) => void;
  categories: Category[];
};

const EditFinanceModal: React.FC<Props> = ({ isOpen, onClose, finance, onSave, categories }) => {
  const [updatedFinance, setUpdatedFinance] = useState<Finance>(finance);

  useEffect(() => {
    setUpdatedFinance(finance);
  }, [finance]);

  const handleSave = () => {
    onSave(updatedFinance);
    onClose();
  };

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
      <h2 className="text-2xl text-primaryOrange font-semibold">Editar Finança</h2>

      <div className="flex flex-col gap-3 w-full">
        <Input
          placeholder="Título"
          className="w-full"
          value={updatedFinance.name}
          onChange={(e) => setUpdatedFinance({ ...updatedFinance, name: e.target.value })}
        />

        <div className="grid grid-cols-5 gap-3 w-full">
          <div className="col-span-2">
            <CurrencyInput
              placeholder="R$"
              className="w-full"
              value={updatedFinance.value.toString()}
              onValueChange={(val) => setUpdatedFinance({ ...updatedFinance, value: parseFloat(val || "0") })}
            />
          </div>

          <div className="col-span-3">
            <Select
              placeholder="Categorias"
              className="w-full"
              value={updatedFinance.categoryId}
              onChange={(e) => setUpdatedFinance({ ...updatedFinance, categoryId: e.target.value })}
            >
              {categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-7">
            <DatePicker
              className="w-full"
              selected={new Date(updatedFinance.date)}
              onChange={(date) => setUpdatedFinance({ ...updatedFinance, date: date as Date })}
              placeholderText="Data"
            />
          </div>

          <div className="col-span-5">
            <Select
              placeholder="Tipo Transação"
              className="w-full"
              value={updatedFinance.type}
              onChange={(e) => setUpdatedFinance({ ...updatedFinance, type: e.target.value as TransactionType })}
            >
              <option value="INCOME">Entrada</option>
              <option value="EXPENSE">Despesa</option>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-10">
          <Button className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg" onClick={handleSave}>
            Salvar
          </Button>
          <Button className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditFinanceModal;
