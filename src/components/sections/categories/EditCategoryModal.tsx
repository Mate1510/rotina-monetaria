"use client";

import { Category } from "@/categories";
import { useEffect, useState } from "react";
import ModalComponent from "../Modal";
import Button from "@/components/components/Button";
import Input from "@/components/components/Input";
import { CirclePicker } from "react-color";
import { Color } from "@/enum";
import Select from "@/components/components/Select";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onSave: (updatedCategory: Category) => void;
};

const EditCategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const [updatedCategory, setUpdatedCategory] = useState<Category>(category);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    setUpdatedCategory(category);
  }, [category]);

  const handleSave = () => {
    onSave(updatedCategory);
    onClose();
  };

  const getColorName = (hexCode: string): string => {
    const colorName = Object.keys(Color).find(
      (color) => Color[color as keyof typeof Color] === hexCode
    );
    return colorName ?? "";
  };

  const handleColorChange = (color: any) => {
    setUpdatedCategory({ ...updatedCategory, color: getColorName(color.hex) });
    setShowColorPicker(false);
  };

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Editar Categoria"
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
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Nome da Categoria"
            className="w-full"
            value={updatedCategory.name}
            onChange={(e) =>
              setUpdatedCategory({ ...updatedCategory, name: e.target.value })
            }
          />

          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-7 flex flex-col gap-3">
              <Button
                className="bg-white text-textGray w-full flex items-center gap-3 hover:bg-textGray hover:text-white"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <span
                  className="w-8 h-8 rounded-full ml-3 border border-textGray"
                  style={{
                    backgroundColor:
                      Color[updatedCategory.color as keyof typeof Color],
                  }}
                ></span>
                Selecione sua Cor
              </Button>

              {showColorPicker && (
                <div className="w-full mx-auto p-3 bg-white border border-primaryOrange rounded-lg">
                  <CirclePicker
                    colors={Object.values(Color)}
                    onChange={handleColorChange}
                    circleSize={25}
                    circleSpacing={6}
                    className="mx-auto max-w-fit circle-picker"
                  />
                </div>
              )}
            </div>

            <div className="col-span-5">
              <Select
                placeholder="Tipo Transação"
                className="w-full"
                value={updatedCategory.transactionType}
                onChange={(e) =>
                  setUpdatedCategory({
                    ...updatedCategory,
                    transactionType: e.target.value,
                  })
                }
              >
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default EditCategoryModal;
