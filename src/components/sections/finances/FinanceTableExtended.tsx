"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Finance } from "@/finance";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import axios from "axios";
import { Category } from "@/categories";
import { MdTrendingUp, MdTrendingDown, MdDelete, MdEdit } from "react-icons/md";
import EditFinanceModal from "./EditFinanceModal";
import ConfirmDeleteModal from "./DeleteModal";

const FinanceTable = () => {
  const { data: session } = useSession();
  const [finances, setFinances] = useState<Finance[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);
  const [financeToDelete, setFinanceToDelete] = useState<Finance | null>(null);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  useEffect(() => {
    if (!session) {
      console.error("User not authenticated.");
      return;
    }

    const fetchFinances = async () => {
      try {
        const response = await axios.get(`/api/finances`, {
          params: { month, year },
        });
        setFinances(response.data);
      } catch (error) {
        console.error("Failed to fetch finances:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const userIdResponse = await fetch(
          `/api/getuserid?email=${session.user?.email}`
        );
        const { userId } = await userIdResponse.json();

        const categoriesResponse = await fetch(
          `/api/categories?userid=${userId}`
        );
        const categoriesData: Category[] = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchFinances();
    fetchCategories();
  }, [month, year]);

  const handlePrevMonth = () => {
    setMonth((prevMonth) => (prevMonth === 1 ? 12 : prevMonth - 1));
    setYear((prevYear) => (month === 1 ? prevYear - 1 : prevYear));
  };

  const handleNextMonth = () => {
    setMonth((prevMonth) => (prevMonth === 12 ? 1 : prevMonth + 1));
    setYear((prevYear) => (month === 12 ? prevYear + 1 : prevYear));
  };

  const handleEditClick = (finance: Finance) => {
    setSelectedFinance(finance);
  };

  const handleSave = async (updatedFinance: Finance) => {
    try {
      const response = await fetch(`/api/finances/${updatedFinance.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFinance),
      });

      if (!response.ok) {
        throw new Error("Failed to update finance data.");
      }

      const updatedFinances = finances.map((finance) =>
        finance.id === updatedFinance.id ? updatedFinance : finance
      );
      setFinances(updatedFinances);
    } catch (error) {
      console.error(error);
    }

    setSelectedFinance(null);
  };

  const handleDeleteClick = (finance: Finance) => {
    setFinanceToDelete(finance);
  };

  const handleConfirmDelete = async () => {
    if (!financeToDelete) return;

    try {
      const response = await fetch(`/api/finances/${financeToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete finance entry.");
      }

      const updatedFinances = finances.filter(
        (finance) => finance.id !== financeToDelete.id
      );
      setFinances(updatedFinances);
    } catch (error) {
      console.error(error);
    }

    setFinanceToDelete(null);
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="min-w-full w-full">
      <div className="flex items-center justify-center mb-3">
        <MdOutlineNavigateBefore
          onClick={handlePrevMonth}
          className="text-primaryOrange cursor-pointer"
          size={38}
        />
        <h3 className="text-primaryOrange font-semibold text-2xl">{`${
          monthNames[month - 1]
        }`}</h3>
        <MdOutlineNavigateNext
          onClick={handleNextMonth}
          className="text-primaryOrange cursor-pointer"
          size={38}
        />
      </div>

      <div className="min-w-full overflow-x-auto  rounded-2xl bg-primaryOrange p-0.5 no-scrollbar">
        <table className="min-w-full bg-white overflow-hidden rounded-2xl">
          <thead className="bg-primaryOrange text-left text-white font-medium text-base">
            <tr>
              <th className="py-2 px-4 border-b font-medium">Título</th>
              <th className="py-2 px-4 border-b font-medium">Categoria</th>
              <th className="py-2 px-4 border-b font-medium">Data</th>
              <th className="py-2 px-4 border-b font-medium">Tipo</th>
              <th className="py-2 px-4 border-b font-medium">Valor</th>
              <th className="py-2 px-4 border-b font-medium text-center">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="font-medium">
            {finances.map((finance) => (
              <tr key={finance.id}>
                <td className="py-2 px-4 border-b">{finance.name}</td>
                <td className="py-2 px-4 border-b">
                  {getCategoryName(finance.categoryId)}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(finance.date).toLocaleDateString()}
                </td>
                {finance.type === "INCOME" ? (
                  <td className="py-2 px-4 border-b text-green-500">
                    <MdTrendingUp size={38} />
                  </td>
                ) : (
                  <td className="py-2 px-4 border-b text-red-500">
                    <MdTrendingDown size={38} />
                  </td>
                )}
                <td
                  className={`py-2 px-4 border-b ${
                    finance.type === "INCOME"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(finance.value))}
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex justify-around items-center">
                    <MdEdit
                      className="text-primaryOrange cursor-pointer"
                      onClick={() => handleEditClick(finance)}
                    />
                    <MdDelete
                      className="text-primaryOrange cursor-pointer"
                      onClick={() => handleDeleteClick(finance)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {finances.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-constrastBlack font-medium text-lg"
                >
                  Suas finanças não chegaram aqui ainda...
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedFinance && (
          <EditFinanceModal
            isOpen={!!selectedFinance}
            onClose={() => setSelectedFinance(null)}
            finance={selectedFinance}
            onSave={handleSave}
            categories={categories}
          />
        )}

        {financeToDelete && (
          <ConfirmDeleteModal
            isOpen={!!financeToDelete}
            onClose={() => setFinanceToDelete(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </div>
  );
};

export default FinanceTable;
