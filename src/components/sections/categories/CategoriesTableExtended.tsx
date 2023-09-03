"use client";

import React, { useEffect, useState } from "react";
import { Category } from "@/categories";
import { useSession } from "next-auth/react";
import axios from "axios";
import { MdDelete, MdEdit, MdTrendingDown, MdTrendingUp } from "react-icons/md";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { Color } from "@/enum";

const CategoryTable = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      console.error("User not authenticated.");
      return;
    }

    const fetchCategories = async () => {
      try {
        const userIdResponse = await axios.get(
          `/api/get-user-info/user-id?email=${session.user?.email}`
        );
        const userId = await userIdResponse.data.userId;

        const categoriesResponse = await axios.get(
          `/api/categories?userid=${userId}`
        );

        const categoriesData: Category[] = await categoriesResponse.data;
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories: ", error);
      }
    };

    fetchCategories();
  }, [session]);

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category);
  };

  const handleSave = async (updatedCategory: Category) => {
    try {
      const response = await axios.put(
        `/api/categories/${updatedCategory.id}`,
        {
          name: updatedCategory.name,
          color: updatedCategory.color,
          transactionType: updatedCategory.transactionType,
        }
      );

      if (!response) {
        throw new Error("Failed to update category data.");
      }

      const updatedCategories = categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      );
      setCategories(updatedCategories);
    } catch (error) {
      console.error(error);
    }

    setCategoryToEdit(null);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await axios.delete(
        `/api/categories/${categoryToDelete.id}`
      );

      if (!response) {
        throw new Error("Failed to delete category data.");
      }

      const updatedCategories = categories.filter(
        (category) => category.id !== categoryToDelete.id
      );
      setCategories(updatedCategories);
    } catch (error) {
      console.error(error);
    }

    setCategoryToDelete(null);
  };

  return (
    <div className="min-w-full w-full">
      <div className="min-w-full overflow-x-auto rounded-2xl bg-primaryOrange p-0.5 no-scrollbar">
        <table className="w-full bg-white overflow-hidden rounded-2xl">
          <thead className="bg-primaryOrange text-left text-white font-medium text-base">
            <tr>
              <th className="py-2 px-4 border-b font-medium">Cor</th>
              <th className="py-2 px-4 border-b font-medium">
                Nome da Categoria
              </th>
              <th className="py-2 px-4 border-b font-medium">Tipo</th>
              <th className="py-2 px-4 border-b font-medium">Ações</th>
            </tr>
          </thead>

          <tbody className="font-medium">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="flex py-2 px-4 border-b">
                  <span
                    className="w-10 h-10 rounded-full border border-textGray"
                    style={{
                      backgroundColor:
                        Color[category.color as keyof typeof Color],
                    }}
                  ></span>
                </td>
                <td className="py-2 px-4 border-b">{category.name}</td>
                {category.transactionType === "INCOME" ? (
                  <td className="py-2 px-4 border-b text-green-500">
                    <MdTrendingUp size={38} />
                  </td>
                ) : (
                  <td className="py-2 px-4 border-b text-red-500">
                    <MdTrendingDown size={38} />
                  </td>
                )}
                <td className="py-2 px-4 border-b">
                  <div className="flex justify-around items-center">
                    <MdEdit
                      className="text-primaryOrange cursor-pointer"
                      onClick={() => handleEditClick(category)}
                    />
                    <MdDelete
                      className="text-primaryOrange cursor-pointer"
                      onClick={() => handleDeleteClick(category)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  Parece que você não tem categorias ainda...
                </td>
              </tr>
            )}

            {categoryToEdit && (
              <EditCategoryModal
                isOpen={!!categoryToEdit}
                onClose={() => setCategoryToEdit(null)}
                category={categoryToEdit}
                onSave={handleSave}
              />
            )}

            {categoryToDelete && (
              <DeleteCategoryModal
                isOpen={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={handleConfirmDelete}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
