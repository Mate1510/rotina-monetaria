"use client";

import React, { useState, useEffect } from "react";
import { Finance } from "@/finance";
import Input from "@/components/components/Input";
import CurrencyInput from "@/components/components/CurrencyInput";
import Select from "@/components/components/Select";
import DatePicker from "@/components/components/DatePicker";
import Button from "@/components/components/Button";
import { Category } from "@/categories";
import { TransactionType } from "@/enum";
import ModalComponent from "@/components/sections/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  finance: Finance;
  onSave: (updatedFinance: Finance) => void;
  categories: Category[];
};

const EditFinanceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  finance,
  onSave,
  categories,
}) => {
  const [updatedFinance, setUpdatedFinance] = useState<Finance>(finance);

  useEffect(() => {
    setUpdatedFinance(finance);
  }, [finance]);

  const handleSave = () => {
    onSave(updatedFinance);
    onClose();
  };

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Editar Finança"
      actionButton={
        <Button
          className="bg-primaryOrange p-2 rounded-lg text-white font-medium text-lg"
          onClick={handleSave}
        >
          Salvar
        </Button>
      }
    >
      <div className="flex flex-col gap-3 w-full">
        <Input
          placeholder="Título"
          className="w-full"
          value={updatedFinance.name}
          onChange={(e) =>
            setUpdatedFinance({ ...updatedFinance, name: e.target.value })
          }
        />

        <div className="grid grid-cols-5 gap-3 w-full">
          <div className="col-span-2">
            <CurrencyInput
              placeholder="R$"
              className="w-full"
              value={updatedFinance.value.toString()}
              onValueChange={(val) =>
                setUpdatedFinance({
                  ...updatedFinance,
                  value: parseFloat(val || "0"),
                })
              }
            />
          </div>

          <div className="col-span-3">
            <Select
              placeholder="Categorias"
              className="w-full"
              value={updatedFinance.categoryId}
              onChange={(e) =>
                setUpdatedFinance({
                  ...updatedFinance,
                  categoryId: e.target.value,
                })
              }
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
              onChange={(date) =>
                setUpdatedFinance({ ...updatedFinance, date: date as Date })
              }
              placeholderText="Data"
            />
          </div>

          <div className="col-span-5">
            <Select
              placeholder="Tipo Transação"
              className="w-full"
              value={updatedFinance.type}
              onChange={(e) =>
                setUpdatedFinance({
                  ...updatedFinance,
                  type: e.target.value as TransactionType,
                })
              }
            >
              <option value="INCOME">Entrada</option>
              <option value="EXPENSE">Despesa</option>
            </Select>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default EditFinanceModal;
